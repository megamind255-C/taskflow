// client/src/components/TaskCard.jsx
// Single task with actions. Stateless: parent passes callbacks.

export default function TaskCard({ task, onView, onEdit, onDelete, onToggle }) {
  const isCompleted = task.status === 'Completed';

  // Convert "In Progress" → "InProgress" for the CSS class, and same for status.
  const statusClass = `badge--status-${task.status.replace(/\s+/g, '')}`;
  const priorityClass = `badge--priority-${task.priority}`;

  // Format due date; show "Overdue" if it's in the past and not completed.
  let dueLabel = null;
  let dueIsOverdue = false;
  if (task.due_date) {
    const due = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueIsOverdue = !isCompleted && due < today;
    dueLabel = `Due ${due.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    })}`;
  }

  return (
    <article className={`task-card ${isCompleted ? 'task-card--completed' : ''}`}>
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <div className="task-card__meta">
          <span className={`badge ${priorityClass}`}>{task.priority}</span>
          <span className={`badge ${statusClass}`}>{task.status}</span>
        </div>
      </div>

      {task.description && <p className="task-card__desc">{task.description}</p>}

      {dueLabel && (
        <div className={`task-card__due ${dueIsOverdue ? 'is-overdue' : ''}`}>
          {dueIsOverdue ? '⚠️ ' : '📅 '}{dueLabel}
        </div>
      )}

      <div className="task-card__actions">
        <button className="btn btn--ghost btn--sm" onClick={() => onView(task)}>
          View
        </button>
        <button className="btn btn--ghost btn--sm" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn--primary btn--sm" onClick={() => onToggle(task)}>
          {isCompleted ? 'Mark Pending' : 'Mark Completed'}
        </button>
        <button className="btn btn--danger btn--sm" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </article>
  );
}