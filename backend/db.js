// test-db.js
const { Pool } = require('pg');
(async () => {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized:false } : false });
    const { rows } = await pool.query('SELECT NOW() as now');
    console.log('DB ok — now:', rows[0].now);
    await pool.end();
  } catch (err) {
    console.error('DB connection error:', err.stack || err);
    process.exit(1);
  }
})();
