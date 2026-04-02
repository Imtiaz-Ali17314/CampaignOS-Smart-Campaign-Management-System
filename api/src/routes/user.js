const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/user/profile - Fetch strategist profile and settings
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT email, name, rank, specialty, bio, settings FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Strategist profile not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error during strategic fetch' });
  }
});

// PUT /api/user/profile - Update strategist profile and settings
router.put('/profile', auth, async (req, res) => {
  const { name, rank, specialty, bio, settings } = req.body;

  try {
    const result = await db.query(
      `UPDATE users 
       SET name = $1, rank = $2, specialty = $3, bio = $4, settings = $5, updated_at = NOW() 
       WHERE id = $6 
       RETURNING email, name, rank, specialty, bio, settings`,
      [name, rank, specialty, bio, settings, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Strategist profile mismatch' });
    }

    res.json({ message: 'Strategic Matrix Synchronized', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error during strategic sync' });
  }
});

module.exports = router;
