const db = require('./index');

async function runMigrations() {
  try {
    console.log('--- Initializing Strategic Persistence Migration ---');
    
    // Add missing profile columns IF NOT EXISTS
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT 'Lead Strategist',
      ADD COLUMN IF NOT EXISTS rank VARCHAR(100) DEFAULT 'Commander',
      ADD COLUMN IF NOT EXISTS specialty VARCHAR(100) DEFAULT 'Performance Marketing',
      ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT 'Architecting high-conversion campaign systems.',
      ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
    `);

    console.log('--- Strategic Migration Success: Database Schema Synchronized ---');
  } catch (err) {
    console.error('--- Strategic Migration Collision: ---', err.message);
  }
}

module.exports = { runMigrations };
