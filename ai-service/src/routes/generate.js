const express = require('express');
const router = express.Router();
const { openai, model } = require('../services/llm');

// Helper to get random fallback results for dynamic feel
const getRandomResult = (type, context = {}) => {
    const fallbacks = {
        copy: [
            { headline: `Experience the future of ${context.product} with our ${context.tone} solution.`, body: `Our specialized platform for ${context.platform} delivers high-performance results tailored for your needs.`, cta: `Learn More About ${context.product}` },
            { headline: `Unleash the Power of ${context.product}: A ${context.tone} Revolution.`, body: `Elevate your ${context.platform} execution with strategic intelligence and tactical precision.`, cta: `Initialize ${context.product} Now` },
            { headline: `Why Strategic Leaders Choose ${context.product} for ${context.platform}.`, body: `A ${context.tone} approach to complex market challenges. Performance at scale.`, cta: `Join the ${context.product} Network` }
        ],
        social: [
            [
                `🚀 Pushing boundaries with our ${context.goal} initiative in a ${context.voice} voice.`,
                `The new era of ${context.platform} is here. Stay ahead with our latest strategy.`,
                `How are you handling your ${context.platform} growth? Our ${context.voice} approach makes it easy.`,
                `Unlocking new potential on ${context.platform} today. #Strategy #Success`,
                `Our mission: ${context.goal}. Our voice: ${context.voice}. Our impact: Global.`
            ],
            [
                `Intelligence. Precision. Results. Our ${context.goal} protocol for ${context.platform} is live.`,
                `The future belongs to the prepared. Is your ${context.voice} strategy ready?`,
                `Data-driven insights meeting ${context.voice} execution. This is ${context.goal}.`,
                `Transforming the ${context.platform} landscape, one strategy at a time. #Innovation`,
                `Your ${context.goal} objective is our priority. Let's build it together.`
            ],
            [
                `Strategic Pulse Check: ${context.goal} is set for ${context.platform} dominance.`,
                `Efficiency reclaimed. Profitability optimized. Our ${context.voice} promise.`,
                `Connecting vision to value through the ${context.goal} framework.`,
                `A higher standard of ${context.platform} performance. Delivered. #Excellence`,
                `Scale without friction. Progress with ${context.voice} authority.`
            ]
        ],
        hashtags: [
            ["#strategy", "#marketing", "#innovation", "#growth", "#performance", "#digital", "#intelligence", "#campaign", "#objective", "#future"],
            ["#leadership", "#execution", "#scale", "#efficiency", "#metrics", "#data", "#vision", "#global", "#success", "#pulse"],
            ["#creative", "#narrative", "#identity", "#impact", "#conversion", "#market", "#target", "#reach", "#influence", "#standard"]
        ]
    };

    const results = fallbacks[type];
    if (Array.isArray(results[0])) {
        return results[Math.floor(Math.random() * results.length)];
    }
    return results[Math.floor(Math.random() * results.length)];
};

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
    console.error('AI Copy Fallback Triggered:', err.message);
    const synthCopy = getRandomResult('copy', { product, tone, platform });
    res.write(`data: ${JSON.stringify({ content: JSON.stringify(synthCopy) })}\n\n`);
    res.write('data: [DONE]\n\n');
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
    console.error('AI Social Fallback Triggered:', err.message);
    const captions = getRandomResult('social', { platform, goal: campaign_goal, voice: brand_voice });
    res.json({ captions });
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
    console.error('AI Hashtags Fallback Triggered:', err.message);
    const hashtags = getRandomResult('hashtags', { industry });
    res.json({ hashtags });
  }
});

// POST /generate/brief - Generates a full creative brief
router.post('/brief', async (req, res) => {
  const { clientName, industry, objective, targetAudience, tone, imageryStyle, budget, colorDirection } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { 
          role: 'system', 
          content: `You are an expert marketing strategist. Generate a structured JSON creative brief.
          Return a JSON object ONLY with the following keys:
          - campaignTitle: string
          - headlines: [string, string, string]
          - toneGuide: string
          - channels: [{ name, budgetPct }] (at least 3 channels totalling 100%)
          - visualDirection: string` 
        },
        { 
          role: 'user', 
          content: `Client: ${clientName}, Industry: ${industry}, Objective: ${objective}, Audience: ${targetAudience}, Tone: ${tone}, Visual Style: ${imageryStyle}` 
        }
      ],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    console.error('AI Brief Fallback Triggered:', err.message);
    const synthResult = {
      campaignTitle: `${clientName} ${objective.charAt(0).toUpperCase() + objective.slice(1)} Pulse 2026`,
      headlines: [
        `Discover the Absolute Future of ${industry} with ${clientName}.`,
        `Precision Meeting Performance at ${clientName}.`,
        `The Only ${industry} Intelligence You Need.`
      ],
      toneGuide: `Maintaining a ${tone} authority. We will speak directly to ${targetAudience} using the power of ${industry} innovation and strategic clarity.`,
      channels: [
        { name: 'Algorithmic Social', budgetPct: 45 },
        { name: 'Semantic Search', budgetPct: 35 },
        { name: 'Strategic Display', budgetPct: 20 }
      ],
      visualDirection: `${imageryStyle} aesthetic language dominated by clean ${colorDirection} accents and premium typography.`
    };
    
    res.json(synthResult);
  }
});

module.exports = router;
