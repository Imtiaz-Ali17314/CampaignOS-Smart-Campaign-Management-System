const db = require('./index');

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function generateDailyMetrics(startDateStr, endDateStr, budget) {
  const start = new Date(startDateStr + 'T00:00:00.000Z');
  const end = new Date(endDateStr + 'T00:00:00.000Z');
  const diffTime = Math.abs(end - start);
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const today = new Date('2026-06-29T00:00:00.000Z'); // System local time reference
  
  const dailyMetrics = [];
  let totalSpend = 0;
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalConversions = 0;

  const averageDailySpend = budget / totalDays;

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(start);
    currentDate.setUTCDate(start.getUTCDate() + i);

    if (currentDate > today) {
      continue; // Don't generate metrics for future days
    }

    const dateStr = formatDate(currentDate);
    const factor = 0.7 + Math.random() * 0.5;
    let spend = Math.round(averageDailySpend * factor);
    if (totalSpend + spend > budget) {
      spend = Math.max(0, Math.round(budget - totalSpend));
    }

    const impressions = Math.round(spend * (60 + Math.round(Math.random() * 30)));
    const ctr = 0.015 + Math.random() * 0.02;
    const clicks = Math.round(impressions * ctr);
    const cvr = 0.03 + Math.random() * 0.05;
    const conversions = Math.round(clicks * cvr);

    dailyMetrics.push({
      date: dateStr,
      impressions,
      clicks,
      spend,
      conversions
    });

    totalSpend += spend;
    totalImpressions += impressions;
    totalClicks += clicks;
    totalConversions += conversions;
  }

  return {
    dailyMetrics,
    totalSpend,
    totalImpressions,
    totalClicks,
    totalConversions
  };
}

async function seed() {
  console.log('--- Seeding campaigns: April to September 2026 ---');

  // Get clients
  const clientsRes = await db.query('SELECT id, name FROM clients');
  const clientsMap = {};
  clientsRes.rows.forEach(row => {
    clientsMap[row.name] = row.id;
  });

  const requiredClients = ['Lumiere Skincare', 'Zenith Tech', 'Global Eats'];
  for (const clientName of requiredClients) {
    if (!clientsMap[clientName]) {
      const insertRes = await db.query(
        'INSERT INTO clients (name, industry) VALUES ($1, $2) RETURNING id',
        [clientName, clientName === 'Lumiere Skincare' ? 'Beauty' : (clientName === 'Zenith Tech' ? 'Technology' : 'Food & Beverage')]
      );
      clientsMap[clientName] = insertRes.rows[0].id;
    }
  }

  const campaignConfigs = [
    { name: 'Lumiere Spring Renewal', client: 'Lumiere Skincare', startDate: '2026-04-01', endDate: '2026-04-30', budget: 15000, status: 'completed' },
    { name: 'Zenith Cloud Migration Promo', client: 'Zenith Tech', startDate: '2026-04-01', endDate: '2026-04-30', budget: 25000, status: 'completed' },
    { name: 'Global Eats Easter Feast', client: 'Global Eats', startDate: '2026-04-01', endDate: '2026-04-30', budget: 8000, status: 'completed' },
    
    { name: 'Lumiere Sun Protection Duo', client: 'Lumiere Skincare', startDate: '2026-05-01', endDate: '2026-05-31', budget: 18000, status: 'completed' },
    { name: 'Zenith Developer Summit 2026', client: 'Zenith Tech', startDate: '2026-05-01', endDate: '2026-05-31', budget: 40000, status: 'completed' },
    { name: 'Global Eats Summer Kickoff', client: 'Global Eats', startDate: '2026-05-01', endDate: '2026-05-31', budget: 12000, status: 'completed' },
    
    { name: 'Lumiere Midsummer Glow', client: 'Lumiere Skincare', startDate: '2026-06-01', endDate: '2026-06-30', budget: 20000, status: 'active' },
    { name: 'Zenith IoT Launchpad', client: 'Zenith Tech', startDate: '2026-06-01', endDate: '2026-06-30', budget: 30000, status: 'active' },
    { name: 'Global Eats Food Truck Festival', client: 'Global Eats', startDate: '2026-06-01', endDate: '2026-06-30', budget: 15000, status: 'active' },
    
    { name: 'Lumiere Hydration Boost', client: 'Lumiere Skincare', startDate: '2026-07-01', endDate: '2026-07-31', budget: 22000, status: 'draft' },
    { name: 'Zenith Cyber Security Suite', client: 'Zenith Tech', startDate: '2026-07-01', endDate: '2026-07-31', budget: 35000, status: 'draft' },
    { name: 'Global Eats Summer Barbecue', client: 'Global Eats', startDate: '2026-07-01', endDate: '2026-07-31', budget: 10000, status: 'draft' },
    
    { name: 'Lumiere Late Summer Clearance', client: 'Lumiere Skincare', startDate: '2026-08-01', endDate: '2026-08-31', budget: 12000, status: 'draft' },
    { name: 'Zenith Back-to-School Tech Deals', client: 'Zenith Tech', startDate: '2026-08-01', endDate: '2026-08-31', budget: 45000, status: 'draft' },
    { name: 'Global Eats Harvest Festival', client: 'Global Eats', startDate: '2026-08-01', endDate: '2026-08-31', budget: 14000, status: 'draft' },
    
    { name: 'Lumiere Autumn Radiance', client: 'Lumiere Skincare', startDate: '2026-09-01', endDate: '2026-09-30', budget: 25000, status: 'draft' },
    { name: 'Zenith Quantum Analytics Beta', client: 'Zenith Tech', startDate: '2026-09-01', endDate: '2026-09-30', budget: 50000, status: 'draft' },
    { name: 'Global Eats Oktoberfest Celebration', client: 'Global Eats', startDate: '2026-09-01', endDate: '2026-09-30', budget: 20000, status: 'draft' }
  ];

  // Clear all alert histories, alert rules, and campaigns to avoid foreign key violations
  await db.query('DELETE FROM alert_history');
  await db.query('DELETE FROM alert_rules');
  await db.query('DELETE FROM campaigns');

  for (const config of campaignConfigs) {
    const clientId = clientsMap[config.client];
    const metrics = generateDailyMetrics(config.startDate, config.endDate, config.budget);
    
    const creativeContent = {
      dailyMetrics: metrics.dailyMetrics,
      headlines: [`${config.name} Live`, `Access ${config.name}`],
      socialPosts: [`Launch for ${config.name}!`],
      hashtags: [`#${config.client.replace(/\s+/g, '')}`]
    };

    await db.query(`
      INSERT INTO campaigns (client_id, name, status, budget, spend, impressions, clicks, conversions, start_date, end_date, creative_content)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      clientId,
      config.name,
      config.status,
      config.budget,
      metrics.totalSpend,
      metrics.totalImpressions,
      metrics.totalClicks,
      metrics.totalConversions,
      config.startDate,
      config.endDate,
      JSON.stringify(creativeContent)
    ]);
    
    console.log(`Successfully seeded ${config.name}`);
  }
}

module.exports = { seed };

if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
