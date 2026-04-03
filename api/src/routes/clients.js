const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/clients - Fetch all strategic clients in the portfolio
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clients ORDER BY name ASC');
    res.json({ clients: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error during portfolio fetch' });
  }
});

// POST /api/clients - Provision new Strategic Client
router.post('/', auth, async (req, res) => {
  const { name, industry } = req.body;
  if (!name) return res.status(422).json({ error: 'Client identification required' });
  
  try {
    const result = await db.query(
      'INSERT INTO clients (name, industry) VALUES ($1, $2) RETURNING *',
      [name, industry]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Client provision failure' });
  }
});

module.exports = router;
