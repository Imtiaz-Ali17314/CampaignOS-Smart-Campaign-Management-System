const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { model } = require('./services/llm');
const requestLogger = require('./middleware/requestLogger');
const generateRoutes = require('./routes/generate');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(requestLogger);

// Routes
app.use('/generate', generateRoutes);

// GET /health
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    model: model,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal AI Service Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

app.listen(PORT, () => {
  console.log(`AI Content Microservice running on port ${PORT}`);
});
