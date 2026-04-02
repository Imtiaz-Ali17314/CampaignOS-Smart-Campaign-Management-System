/**
 * Section 3: Speed Tasks — Q5: Scaffolded Express CRUD for "campaigns"
 * Features: Validation, AsyncHandler, Parameterized SQL, Soft Delete, JWT, Proper Status Codes.
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db'); // Pool import
const authMiddleware = require('../middleware/auth'); // Mocked or actual JWT auth

// Async Handler helper for clean error handling
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @desc Get all active campaigns
 * @route GET /campaigns
 * @access Private
 */
router.get(
  '/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { status, client_id, limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT *,
      (clicks::NUMERIC / NULLIF(impressions, 0)) * 100 as ctr,
      (conversions::NUMERIC / NULLIF(spend, 0)) as roas
      FROM campaigns WHERE deleted_at IS NULL
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (client_id) {
      params.push(client_id);
      query += ` AND client_id = $${params.length}`;
    }

    params.push(limit, offset);
    query += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const { rows } = await db.query(query, params);
    res.status(200).json({ data: rows, meta: { limit, page } });
  })
);

/**
 * @desc Get single campaign
 * @route GET /campaigns/:id
 * @access Private
 */
router.get(
  '/:id',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { rows } = await db.query(
      'SELECT * FROM campaigns WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });
    res.status(200).json(rows[0]);
  })
);

/**
 * @desc Create new campaign
 * @route POST /campaigns
 * @access Private
 */
router.post(
  '/',
  authMiddleware,
  [
    body('name').notEmpty().trim().escape(),
    body('budget').isFloat({ min: 0.01 }),
    body('client_id').isUUID(),
    body('status').isIn(['active', 'paused', 'completed', 'draft']),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  },
  asyncHandler(async (req, res) => {
    const { client_id, name, status, budget, start_date, end_date } = req.body;
    const query = `
      INSERT INTO campaigns (client_id, name, status, budget, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await db.query(query, [client_id, name, status, budget, start_date, end_date]);
    res.status(201).json(rows[0]);
  })
);

/**
 * @desc Update campaign
 * @route PUT /campaigns/:id
 * @access Private
 */
router.put(
  '/:id',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const fields = Object.keys(req.body);
    if (fields.length === 0) return res.status(400).json({ error: 'Fields required' });

    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const query = `UPDATE campaigns SET ${setClause}, updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *`;
    const values = [req.params.id, ...Object.values(req.body)];

    const { rows } = await db.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });
    res.status(200).json(rows[0]);
  })
);

/**
 * @desc Soft delete campaign
 * @route DELETE /campaigns/:id
 * @access Private
 */
router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { rowCount } = await db.query(
      'UPDATE campaigns SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Campaign not found' });
    res.status(204).send();
  })
);

module.exports = router;
