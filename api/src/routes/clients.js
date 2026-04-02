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

module.exports = router;
