// config/db.js
// Creates ONE shared PostgreSQL connection pool for the whole app.
// Every controller imports this and reuses it — never creates its own.

import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Fail fast: if DATABASE_URL is missing, we want to know at startup,
// not on the first request.
if (!process.env.DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL in .env file.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Keep these conservative for local dev:
  max: 10,                    // up to 10 concurrent connections
  idleTimeoutMillis: 30_000,  // close idle connections after 30s
  connectionTimeoutMillis: 5_000, // fail a connection attempt after 5s
});

// Small event hooks so we know the pool is healthy.
pool.on('error', (err) => {
  console.error('💥 Unexpected PostgreSQL pool error:', err.message);
});

// Quick startup check: try one query, log success or fail.
pool
  .query('SELECT NOW() AS now')
  .then((r) => console.log(`✅ PostgreSQL connected @ ${r.rows[0].now}`))
  .catch((e) => {
    console.error('❌ PostgreSQL connection failed:', e.message);
    process.exit(1);
  });

export default pool;