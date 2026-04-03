const { query } = require('./index');

async function runMigration() {
    try {
        console.log('Running migration: Adding creative_content column to campaigns...');
        await query('ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS creative_content JSONB DEFAULT \'{}\';');
        console.log('Migration SUCCESS.');
        process.exit(0);
    } catch (err) {
        console.error('Migration FAILED:', err);
        process.exit(1);
    }
}

runMigration();
