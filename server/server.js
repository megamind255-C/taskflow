// server/server.js
// The app entry point: load env, create Express app, attach middleware,
// mount routes, start listening.

import 'dotenv/config'; // must run BEFORE we import config/db.js
import express from 'express';
import cors from 'cors';

import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Importing the pool here triggers its startup connection check.
import './config/db.js';

const app = express();

// --- Global middleware ---
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json({ limit: '1mb' })); // parse JSON bodies

// --- Health check (nice for debugging) ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/tasks', taskRoutes);

// --- 404 for unknown /api routes ---
app.use(notFound);

// --- Centralized error handler (MUST be last) ---
app.use(errorHandler);

// --- Start ---
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TaskFlow API running at http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/api/health`);
  console.log(`   Tasks:   http://localhost:${PORT}/api/tasks`);
});