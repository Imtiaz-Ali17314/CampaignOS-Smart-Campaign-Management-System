const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const clientRoutes = require('./routes/clients');
const userRoutes = require('./routes/user');
const rateLimit = require('./middleware/rateLimit');
const { runMigrations } = require('./db/migration');

const app = express();
const PORT = process.env.PORT || 3000;

// Run Strategic Migrations
runMigrations();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit);

// Routes
app.use('/auth', authRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/clients', clientRoutes);
app.use('/user', userRoutes);

// Temporary seed endpoint (reloaded)
app.get('/seed-all', async (req, res) => {
  try {
    const { seed } = require('./db/seed-months');
    await seed();
    res.json({ success: true, message: "April to September 2026 data successfully seeded." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message, stack: err.stack });
  }
});

// Temporary db inspection endpoint
app.get('/check-db', async (req, res) => {
  try {
    const db = require('./db');
    const campaigns = await db.query('SELECT id, name, start_date, end_date FROM campaigns');
    const alerts = await db.query('SELECT id, campaign_id, message FROM alert_history');
    res.json({ campaigns: campaigns.rows, alerts: alerts.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

app.listen(PORT, () => {
  console.log(`Campaign OS API running on port ${PORT}`);
});
