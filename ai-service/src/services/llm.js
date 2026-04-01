const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  openai,
  model: process.env.MODEL || 'gpt-4o-mini'
};
