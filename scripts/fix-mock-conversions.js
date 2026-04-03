/**
 * Fix Script: Add realistic `conversions` to every dailyMetrics entry in campaigns.json
 * Conversions are derived from clicks using a realistic 2-5% conversion rate per entry.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/src/data/campaigns.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

data.campaigns = data.campaigns.map(campaign => {
  // Use a consistent conversion rate per campaign (between 2% and 5%)
  const baseRate = 0.02 + Math.random() * 0.03;
  
  campaign.dailyMetrics = (campaign.dailyMetrics || []).map(day => {
    if (day.conversions !== undefined) return day; // already has conversions
    return {
      ...day,
      conversions: Math.round(day.clicks * baseRate)
    };
  });
  return campaign;
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
console.log('✅ campaigns.json updated — conversions added to all dailyMetrics entries.');
