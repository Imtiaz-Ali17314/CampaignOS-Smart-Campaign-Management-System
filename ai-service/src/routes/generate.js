const express = require('express');
const router = express.Router();
const { openai, model } = require('../services/llm');

// POST /generate/copy - SSE Streaming
router.post('/copy', async (req, res) => {
  const { product, tone, platform, word_limit = 50 } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: `You are an expert copywriter. Generate ad copy for ${platform} in a ${tone} tone. Limit to ${word_limit} words. Output JSON format: { "headline": "...", "body": "...", "cta": "..." }` },
        { role: 'user', content: `Product: ${product}` }
      ],
      stream: true,
      response_format: { type: "json_object" }
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

// POST /generate/social
router.post('/social', async (req, res) => {
  const { platform, campaign_goal, brand_voice } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: `Generate 5 social media captions for ${platform}. Goal: ${campaign_goal}. Voice: ${brand_voice}. Output format: { "captions": ["...", "...", "...", "...", "..."] }` }
      ],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Generation failed' });
  }
});

// POST /generate/hashtags
router.post('/hashtags', async (req, res) => {
  const { content, industry } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: `Generate 10 trending hashtags for the following content in the ${industry} industry. Output format: { "hashtags": ["#tag1", ..., "#tag10"] }` },
        { role: 'user', content: `Content: ${content}` }
      ],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Generation failed' });
  }
});

module.exports = router;
