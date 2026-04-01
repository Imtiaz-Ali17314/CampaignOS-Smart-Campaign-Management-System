const db = require('./db');

const evaluateAlerts = async (io) => {
  try {
    // 1. Fetch active campaigns with thresholds
    const result = await db.query(`
      SELECT 
        c.id, c.name, c.client_id, c.budget, c.spend, c.impressions, c.clicks,
        (CASE WHEN c.impressions > 0 THEN (c.clicks::numeric / c.impressions::numeric) ELSE 0 END) as ctr
      FROM campaigns c
      WHERE c.status = 'active' AND c.deleted_at IS NULL
    `);

    const campaigns = result.rows;

    for (const campaign of campaigns) {
      // Rule 1: CTR < 1% (0.01)
      if (campaign.ctr < 0.01 && campaign.impressions > 1000) {
        await triggerAlert(io, campaign, 'ctr', `Campaign "${campaign.name}" has low CTR: ${(campaign.ctr * 100).toFixed(2)}%`);
      }

      // Rule 2: Spend > 90% of budget
      const spendPct = campaign.spend / campaign.budget;
      if (spendPct > 0.9) {
        await triggerAlert(io, campaign, 'spend_pct', `Campaign "${campaign.name}" has used ${(spendPct * 100).toFixed(1)}% of its budget`);
      }
    }
  } catch (err) {
    console.error('Error in alert engine:', err);
  }
};

const triggerAlert = async (io, campaign, metric, message) => {
  try {
    // Check if this alert was already triggered recently (e.g., last 24h) to avoid spam
    const check = await db.query(
      `SELECT id FROM alert_history 
       WHERE campaign_id = $1 AND triggered_at > NOW() - INTERVAL '24 hours' 
       AND message = $2`,
      [campaign.id, message]
    );

    if (check.rows.length === 0) {
      // Insert into alert history
      const insert = await db.query(
        `INSERT INTO alert_history (campaign_id, message) 
         VALUES ($1, $2) RETURNING id, triggered_at`,
        [campaign.id, message]
      );

      const alert = {
        id: insert.rows[0].id,
        campaign_id: campaign.id,
        campaign_name: campaign.name,
        message,
        triggered_at: insert.rows[0].triggered_at,
        is_read: false
      };

      // Emit to WebSocket rooms
      // 1. To the global admins/dashboard
      io.emit('alert', alert);
      
      // 2. To specific campaign room (if implemented in UI)
      io.to(campaign.id).emit('alert', alert);

      console.log(`[ALERT] ${message}`);
    }
  } catch (err) {
    console.error('Error triggering alert:', err);
  }
};

module.exports = {
  start: (io) => {
    console.log('Alert engine started...');
    // Run every 60 seconds
    setInterval(() => evaluateAlerts(io), 60 * 1000);
    // Initial run
    evaluateAlerts(io);
  }
};
