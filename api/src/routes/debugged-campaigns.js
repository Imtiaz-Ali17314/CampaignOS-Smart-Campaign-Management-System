/**
 * Section 3: Speed Tasks — Q1: Debugged Express API
 * Fixes: SQL Injection, Missing Await, Wrong status codes, Error Handling.
 */

const express = require('express');
const router = express.Router();
const db = require('../db'); // Simulated db connection pool
const { body, validationResult } = require('express-validator');

// GET /campaigns/:id - FIXED
router.get('/:id', async (req, res, next) => {
  try {
    // 1. FIXED: Use parameterized query ($1) instead of template strings to prevent SQL Injection
    // 2. FIXED: Use await for asynchronous db query
    const { rows } = await db.query('SELECT * FROM campaigns WHERE id = $1 AND deleted_at IS NULL', [req.params.id]);

    if (rows.length === 0) {
      // 3. FIXED: Return correct 404 status code (not 200/500)
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    // 4. FIXED: Proper error propagation to centralized error handler
    next(error);
  }
});

// POST /campaigns - FIXED
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('budget').isNumeric().withMessage('Budget must be a number'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 5. FIXED: Return 422 Unprocessable Entity for validation errors
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { name, budget, client_id, start_date, end_date } = req.body;
      const query = `
        INSERT INTO campaigns (name, budget, client_id, start_date, end_date) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`;
      const values = [name, budget, client_id, start_date, end_date];

      // 6. FIXED: Use await
      const { rows } = await db.query(query, values);

      // 7. FIXED: Return 201 Created (not 200 OK) for resource creation
      res.status(201).json(rows[0]);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /campaigns/:id (Soft Delete) - FIXED
router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await db.query(
      'UPDATE campaigns SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Campaign not found or already deleted' });
    }

    // 8. FIXED: Return 204 No Content (standard for successful deletes with no body)
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
