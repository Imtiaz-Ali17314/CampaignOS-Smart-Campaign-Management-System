const db = require('./db');

async function seedAnomaly() {
  try {
    console.log('--- Initializing Strategic Alert Simulation ---');
    
    // 1. Get a client ID
    const clientRes = await db.query('SELECT id FROM clients LIMIT 1');
    if (clientRes.rows.length === 0) {
      console.log('Error: No clients found to associate alert with.');
      return;
    }
    const clientId = clientRes.rows[0].id;

    // 2. Insert a "Budget Breach" campaign (Spent 95% of 10k)
    await db.query(`
      INSERT INTO campaigns (client_id, name, status, budget, spend, impressions, clicks, start_date)
      VALUES ($1, 'Winter Sparkle 2025 - Critical', 'active', 10000, 9550, 50000, 850, NOW() - INTERVAL '10 days')
      ON CONFLICT DO NOTHING;
    `, [clientId]);

    // 3. Insert a "Performance Anomaly" campaign (High impressions, Low CTR)
    await db.query(`
      INSERT INTO campaigns (client_id, name, status, budget, spend, impressions, clicks, start_date)
      VALUES ($1, 'Echo Growth Protocol - Low CTR', 'active', 5000, 1200, 15000, 85, NOW() - INTERVAL '5 days')
      ON CONFLICT DO NOTHING;
    `, [clientId]);

    console.log('--- Strategic Anomaly Injected: Thresholds Breached ---');
    console.log('--- The Alert Engine will broadcast these within 60 seconds ---');
  } catch (err) {
    console.error('--- Simulation Failed: ---', err.message);
  }
}

seedAnomaly();
