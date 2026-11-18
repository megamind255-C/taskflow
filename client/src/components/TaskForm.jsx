// client/src/components/TaskForm.jsx
// Modal form used both for creating (initial = null) and editing
// (initial = the task to edit). Client-side validation is a courtesy;
// the backend is authoritative.

import { useState } from 'react';

const EMPTY = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  due_date: '',
};

export default function TaskForm({ initial, onSubmit, onCancel }) {
  // Convert initial task to a form-shaped object.
  const startValues = initial
    ? {
        title: initial.title || '',
        description: initial.description || '',
        priority: initial.priority || 'Medium',
        status: initial.status || 'Pending',
        due_date: initial.due_date ? initial.due_date.slice(0, 10) : '',
      }
    : EMPTY;

  const [values, setValues] = useState(startValues);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!values.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (values.title.trim().length > 255) {
      setError('Title must be 255 characters or fewer.');
      return;
    }

    // Build payload: empty description/due_date become null.
    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      priority: values.priority,
      status: values.status,
      due_date: values.due_date || null,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <h2>{initial ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal__close" onClick={onCancel} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" htmlFor="title">Title *</label>
              <input
                id="title" className="input" type="text" maxLength={255}
                value={values.title} onChange={update('title')} autoFocus required
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                id="description" className="textarea" maxLength={2000}
                value={values.description} onChange={update('description')}
              />
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label className="form-label" htmlFor="priority">Priority</label>
                <select id="priority" className="select" value={values.priority} onChange={update('priority')}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="status">Status</label>
                <select id="status" className="select" value={values.status} onChange={update('status')}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="due_date">Due date</label>
              <input
                id="due_date" className="input" type="date"
                value={values.due_date} onChange={update('due_date')}
              />
            </div>

            {error && <div className="form-error">{error}</div>}
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Saving…' : (initial ? 'Save changes' : 'Create task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}