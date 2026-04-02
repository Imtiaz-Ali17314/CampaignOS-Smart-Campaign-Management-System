const db = require('./src/db');
db.query('SELECT 1 FROM users LIMIT 1')
    .then(() => console.log('Database ready: users table found'))
    .catch((err) => {
        console.error('Database connection failed or table missing:');
        console.error(err.message);
        process.exit(1);
    });
