const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db');
const authenticate = require('../middleware/auth');

// Apply authentication to all routes below
router.use(authenticate);

// GET /campaigns
router.get('/', async (req, res) => {
  const { status, client_id, sortBy = 'created_at', order = 'DESC', page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let sql = `
      SELECT 
        c.*,
        cl.name as client_name,
        (CASE WHEN c.impressions > 0 THEN (c.clicks::numeric / c.impressions::numeric) * 100 ELSE 0 END) as ctr,
        (CASE WHEN c.spend > 0 THEN (c.conversions::numeric * 50 / c.spend::numeric) ELSE 0 END) as roas,
        (CASE WHEN c.budget > 0 THEN (c.spend::numeric / c.budget::numeric) * 100 ELSE 0 END) as spend_pct
      FROM campaigns c
      JOIN clients cl ON c.client_id = cl.id
      WHERE c.deleted_at IS NULL
    `;
    const params = [];

    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }
    if (client_id) {
      params.push(client_id);
      sql += ` AND client_id = $${params.length}`;
    }

    // Basic SQL Injection protection for dynamic sorting (since $1 doesn't work for column names)
    const allowedSortCols = ['name', 'budget', 'spend', 'created_at', 'status'];
    const finalSortBy = allowedSortCols.includes(sortBy) ? sortBy : 'created_at';
    const finalOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    sql += ` ORDER BY ${finalSortBy} ${finalOrder} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(sql, params);
    
    // Get total count for pagination
    const countResult = await db.query('SELECT COUNT(*) FROM campaigns WHERE deleted_at IS NULL');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      campaigns: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /campaigns/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.*,
        cl.name as client_name,
        (CASE WHEN c.impressions > 0 THEN (c.clicks::numeric / c.impressions::numeric) * 100 ELSE 0 END) as ctr,
        (CASE WHEN c.spend > 0 THEN (c.conversions::numeric * 50 / c.spend::numeric) ELSE 0 END) as roas
      FROM campaigns c
      JOIN clients cl ON c.client_id = cl.id
      WHERE c.id = $1 AND c.deleted_at IS NULL
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /campaigns
router.post('/', [
  body('name').notEmpty().trim(),
  body('client_id').isUUID(),
  body('budget').isNumeric().custom(val => val > 0),
  body('status').optional().isIn(['active', 'paused', 'completed', 'draft']),
  body('start_date').optional().isDate(),
  body('end_date').optional().isDate()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { name, client_id, budget, status = 'draft', start_date, end_date } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO campaigns (name, client_id, budget, status, start_date, end_date, creative_content) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, client_id, budget, status, start_date, end_date, req.body.creative_content || {}]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /campaigns/:id
router.put('/:id', [
  body('name').optional().notEmpty().trim(),
  body('budget').optional().isNumeric().custom(val => val > 0),
  body('status').optional().isIn(['active', 'paused', 'completed', 'draft']),
  body('start_date').optional().isDate(),
  body('end_date').optional().isDate()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const fields = req.body;
  const updates = [];
  const params = [req.params.id];

  Object.entries(fields).forEach(([key, val]) => {
    if (['name', 'budget', 'status', 'start_date', 'end_date', 'creative_content'].includes(key)) {
      params.push(val);
      updates.push(`${key} = $${params.length}`);
    }
  });

  if (updates.length === 0) return res.status(400).json({ error: 'No valid fields provided for update' });

  try {
    const sql = `UPDATE campaigns SET ${updates.join(', ')}, updated_at = NOW() 
                 WHERE id = $1 AND deleted_at IS NULL RETURNING *`;
    const result = await db.query(sql, params);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /campaigns/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE campaigns SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
