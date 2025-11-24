// // E:\aganitha\backend\index.js
// require('dotenv').config();
// const express = require('express');
// const { Pool } = require('pg');
// const { nanoid } = require('nanoid');
// const cors = require('cors');
// const helmet = require('helmet');

// const app = express();
// app.use(helmet());
// app.use(express.json());

// // SIMPLE REQUEST LOGGER (helps diagnose 404s)
// app.use((req, res, next) => {
//   console.log(new Date().toISOString(), req.method, req.originalUrl);
//   next();
// });

// // app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));


// // const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
// // app.use(cors({
// //   origin: allowedOrigin,
// //   methods: ['GET','POST','OPTIONS'],
// //   credentials: true
// // }));
// // Dev-friendly CORS — put this BEFORE any route definitions

// // <-- FIX: CORS setup  aur jab hame need hoge local check karna ka so below code are use-->
// // const FRONTEND = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
// // app.use(cors({
// //   origin: function(origin, callback) {
// //     if (!origin) return callback(null, true); // allow curl / non-browser
// //     const allowed = [FRONTEND, 'http://127.0.0.1:5173'];
// //     if (allowed.includes(origin)) return callback(null, true);
// //     return callback(new Error('Not allowed by CORS'));
// //   },
// //   methods: ['GET','POST','OPTIONS'],
// //   allowedHeaders: ['Content-Type','Authorization'],
// //   credentials: true
// // }));






// const allowedOrigins = [
//   process.env.FRONTEND_ORIGIN,
//   'https://aganitha-8.onrender.com',
//   'http://localhost:5173',
//   'http://127.0.0.1:5173'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     callback(new Error('Not allowed by CORS'));
//   },
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// // IMPORTANT → handle preflight
// // app.options('*', cors());


// // Use the production frontend origin (Vercel)
// // const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://aganitha-8.onrender.com';

// // // Simple, explicit CORS for production
// // app.use(cors({
// //   origin: FRONTEND_ORIGIN,
// //   methods: ['GET','POST','OPTIONS'],
// //   allowedHeaders: ['Content-Type','Authorization'],
// //   credentials: false
// // }));

// // // Explicitly allow preflight on API routes (avoid app.options('*') which can break some setups)
// // app.options('/api/*', cors({
// //   origin: FRONTEND_ORIGIN,
// //   methods: ['GET','POST','OPTIONS'],
// //   allowedHeaders: ['Content-Type','Authorization'],
// //   credentials: false
// // }));























// // DO NOT add app.options('*', cors()); — it causes path-to-regexp errors on some Express versions


// // Simple PG pool — make sure DATABASE_URL exists in your .env
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
// });

// // Health check
// app.get('/health', (req, res) => res.json({ ok: true }));

// // POST /api/shorten  -> create a short code
// app.post('/api/shorten', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'missing url' });
//   try {
//     const code = nanoid(7);
//     const result = await pool.query(
//       'INSERT INTO links(code, original_url) VALUES($1,$2) RETURNING id, code, original_url, clicks, created_at',
//       [code, url]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('POST /api/shorten error:', err);
//     res.status(500).json({ error: 'server error' });
//   }
// });

// // GET /api/links -> list links
// app.get('/api/links', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT id, code, original_url, clicks, created_at FROM links ORDER BY created_at DESC'
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error('GET /api/links error:', err);
//     res.status(500).json({ error: 'server error' });
//   }
// });

// // Redirect route: increments clicks then redirects
// app.get('/:code', async (req, res) => {
//   const { code } = req.params;
//   try {
//     const client = await pool.connect();
//     try {
//       await client.query('BEGIN');
//       const r = await client.query('SELECT id, original_url FROM links WHERE code=$1 FOR UPDATE', [code]);
//       if (r.rows.length === 0) {
//         await client.query('ROLLBACK');
//         return res.status(404).send('Not found');
//       }
//       const { id, original_url } = r.rows[0];
//       await client.query('UPDATE links SET clicks = clicks + 1 WHERE id=$1', [id]);
//       await client.query('COMMIT');
//       return res.redirect(original_url);
//     } catch (err) {
//       await client.query('ROLLBACK');
//       throw err;
//     } finally {
//       client.release();
//     }
//   } catch (err) {
//     console.error('Redirect error:', err);
//     res.status(500).send('Server error');
//   }
// });

// // <-- FIX: define PORT here (was missing) -->
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server listening on ${PORT}`));







// // before:
// // app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));

// // after:
// // const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
// // app.use(cors({
// //   origin: allowedOrigin,
// //   methods: ['GET','POST','OPTIONS'],
// //   credentials: true
// // }));












































// index.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security + body parser
app.use(helmet());
app.use(express.json());

// SIMPLE REQUEST LOGGER (helps diagnose 404s)
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

/*
  CORS configuration
  - Use a concrete allowlist (no `undefined` entries).
  - Pass the array to cors() so the package handles preflight automatically.
  - optionsSuccessStatus ensures some browsers accept 204 for OPTIONS.
*/
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || 'https://aganitha-stkp.vercel.app',
  'https://aganitha-8.onrender.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Optional: explicitly respond to preflight for any route (safe when using cors())
// app.options('*', cors({ origin: allowedOrigins, optionsSuccessStatus: 204 }));

// Postgres pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// POST /api/shorten -> create a short code
app.post('/api/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'missing url' });

  try {
    const code = nanoid(7);
    const result = await pool.query(
      'INSERT INTO links(code, original_url) VALUES($1,$2) RETURNING id, code, original_url, clicks, created_at',
      [code, url]
    );
    // Return created link (JSON)
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/shorten error:', err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /api/links -> list links
app.get('/api/links', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, code, original_url, clicks, created_at FROM links ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/links error:', err);
    res.status(500).json({ error: 'server error' });
  }
});

// Redirect route (must be after /api/* routes)
app.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const r = await client.query('SELECT id, original_url FROM links WHERE code=$1 FOR UPDATE', [code]);
      if (r.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).send('Not found');
      }
      const { id, original_url } = r.rows[0];
      await client.query('UPDATE links SET clicks = clicks + 1 WHERE id=$1', [id]);
      await client.query('COMMIT');
      return res.redirect(original_url);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).send('Server error');
  }
});

// Global error handler (nice to have - returns JSON for API paths)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  // For API routes, always return JSON (avoid HTML error pages)
  if (req.originalUrl.startsWith('/api') || req.originalUrl === '/health') {
    return res.status(500).json({ error: 'internal server error' });
  }
  res.status(500).send('Internal Server Error');
});

// Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
