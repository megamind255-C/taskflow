// middleware/errorHandler.js
// The LAST middleware in the chain. Any error thrown or passed to next()
// in a route/controller ends up here. It logs the full error on the server,
// but sends only a safe, generic message to the client.

export function errorHandler(err, req, res, next) {
  // Log full details server-side (with stack trace) for debugging.
  console.error('🛑 Error:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Determine status: if a controller set err.status, use it.
  // Otherwise default to 500 (Internal Server Error).
  const status = err.status || 500;

  // Never leak internal details (SQL text, file paths) to the browser.
  const message =
    status === 500
      ? 'Something went wrong. Please try again.'
      : err.message || 'Request failed.';

  res.status(status).json({ error: message });
}

// 404 handler for unknown /api routes (must be registered AFTER all routes).
export function notFound(req, res, next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}