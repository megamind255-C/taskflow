// client/src/components/TaskList.jsx
// Renders a list of TaskCards, or an empty state.

import TaskCard from './TaskCard.jsx';

export default function TaskList({ tasks, onView, onEdit, onDelete, onToggle }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks found</h3>
        <p>Create your first task with the “New Task” button above.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}