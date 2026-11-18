// client/src/components/TaskDetails.jsx
// Read-only detail view.

export default function TaskDetails({ task, onClose }) {
  const fmt = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium', timeStyle: 'short',
    });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <h2>Task details</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="form-grid">
          <div><strong>Title:</strong> {task.title}</div>
          <div><strong>Description:</strong> {task.description || <em>—</em>}</div>
          <div><strong>Priority:</strong> {task.priority}</div>
          <div><strong>Status:</strong> {task.status}</div>
          <div><strong>Due date:</strong> {task.due_date ? task.due_date.slice(0, 10) : <em>—</em>}</div>
          <div><strong>Created:</strong> {fmt(task.created_at)}</div>
          <div><strong>Last updated:</strong> {fmt(task.updated_at)}</div>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}