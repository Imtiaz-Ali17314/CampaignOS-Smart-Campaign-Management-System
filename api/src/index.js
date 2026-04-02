const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
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
app.use('/user', userRoutes);

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
