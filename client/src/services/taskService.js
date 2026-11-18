// client/src/services/taskService.js
// Single source of truth for talking to the API.
// No other file in the app is allowed to call fetch().

const API_BASE = 'http://localhost:5000/api';

// Helper: throw a plain Error with the server's message on non-2xx.
async function handleResponse(response) {
  let body = null;
  try { body = await response.json(); } catch { /* empty body */ }

  if (!response.ok) {
    const message =
      (body && body.error) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return body;
}

export async function getTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  return handleResponse(res);
}

export async function getTaskById(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`);
  return handleResponse(res);
}

export async function createTask(payload) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateTask(id, payload) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}