// controllers/taskController.js
// All CRUD operations. Every SQL query is PARAMETERIZED ($1, $2, ...)
// to prevent SQL injection.

import pool from '../config/db.js';

// Helper: parse :id into a positive integer, or throw a 400.
function parseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error('Invalid task id. Must be a positive integer.');
    err.status = 400;
    throw err;
  }
  return id;
}

// ------------------------------------------------------------
// GET /api/tasks
// Returns all tasks, newest first.
// ------------------------------------------------------------
export async function getTasks(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, title, description, priority, status, due_date,
              created_at, updated_at
         FROM tasks
        ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err); // hand off to centralized errorHandler
  }
}

// ------------------------------------------------------------
// GET /api/tasks/:id
// ------------------------------------------------------------
export async function getTaskById(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const result = await pool.query(
      `SELECT id, title, description, priority, status, due_date,
              created_at, updated_at
         FROM tasks
        WHERE id = $1`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: `Task with id ${id} not found.` });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/tasks
// Body: { title, description?, priority?, status?, due_date? }
// ------------------------------------------------------------
export async function createTask(req, res, next) {
  try {
    const { title, description = null, priority = 'Medium',
            status = 'Pending', due_date = null } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority, status, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, priority, status, due_date,
                 created_at, updated_at`,
      [title, description, priority, status, due_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// PUT /api/tasks/:id
// Any subset of { title, description, priority, status, due_date }.
// Only the fields that are actually provided get updated.
// ------------------------------------------------------------
export async function updateTask(req, res, next) {
  try {
    const id = parseId(req.params.id);

    // Build the SET clause dynamically from provided fields.
    // SAFETY: column names come from a fixed allowlist — never user input.
    const fieldMap = {
      title:       'title',
      description: 'description',
      priority:    'priority',
      status:      'status',
      due_date:    'due_date',
    };

    const sets = [];
    const values = [];
    let paramIndex = 1;

    for (const key of Object.keys(fieldMap)) {
      if (req.body[key] !== undefined) {
        sets.push(`${fieldMap[key]} = $${paramIndex}`);
        values.push(req.body[key]);
        paramIndex++;
      }
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update.' });
    }

    // The id goes last as the highest-numbered parameter.
    values.push(id);
    const idParam = `$${paramIndex}`;

    const sql = `
      UPDATE tasks
         SET ${sets.join(', ')}
       WHERE id = ${idParam}
       RETURNING id, title, description, priority, status, due_date,
                 created_at, updated_at
    `;

    const result = await pool.query(sql, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: `Task with id ${id} not found.` });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// DELETE /api/tasks/:id
// ------------------------------------------------------------
export async function deleteTask(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: `Task with id ${id} not found.` });
    }
    res.json({ message: `Task ${id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
}