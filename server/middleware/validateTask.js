// middleware/validateTask.js
// Server-side validation — never trust the browser.
// Two middlewares: one for create (all required rules),
// one for update (all fields optional, but if present, must be valid).

const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High'];
const ALLOWED_STATUSES = ['Pending', 'In Progress', 'Completed'];

// Helper: parse a "YYYY-MM-DD" date string into a Date or return null.
function isValidDateString(value) {
  if (value === undefined || value === null || value === '') return true; // optional
  if (typeof value !== 'string') return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

// ---------- CREATE ----------
export function validateCreateTask(req, res, next) {
  const errors = [];
  const { title, description, priority, status, due_date } = req.body || {};

  // Title
  if (typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string.');
  } else if (title.trim().length > 255) {
    errors.push('Title must be 255 characters or fewer.');
  }

  // Description (optional, but must be string)
  if (description !== undefined && description !== null && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }
  if (typeof description === 'string' && description.length > 2000) {
    errors.push('Description must be 2000 characters or fewer.');
  }

  // Priority
  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`);
  }

  // Status
  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${ALLOWED_STATUSES.join(', ')}.`);
  }

  // Due date
  if (!isValidDateString(due_date)) {
    errors.push('Due date must be a valid date (YYYY-MM-DD).');
  }

  if (errors.length) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  // Normalize title (trim) so the DB stays clean.
  req.body.title = title.trim();
  next();
}

// ---------- UPDATE ----------
export function validateUpdateTask(req, res, next) {
  const errors = [];
  const { title, description, priority, status, due_date } = req.body || {};

  // Title is optional in update, but if present, must be valid.
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title, if provided, must be a non-empty string.');
    } else if (title.trim().length > 255) {
      errors.push('Title must be 255 characters or fewer.');
    }
  }

  if (description !== undefined && description !== null && typeof description !== 'string') {
    errors.push('Description must be a string.');
  }
  if (typeof description === 'string' && description.length > 2000) {
    errors.push('Description must be 2000 characters or fewer.');
  }

  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`);
  }

  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${ALLOWED_STATUSES.join(', ')}.`);
  }

  if (!isValidDateString(due_date)) {
    errors.push('Due date must be a valid date (YYYY-MM-DD).');
  }

  if (errors.length) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  if (typeof title === 'string') req.body.title = title.trim();
  next();
}