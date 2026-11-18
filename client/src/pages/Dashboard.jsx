// client/src/pages/Dashboard.jsx
// The single page. Owns tasks, loading, error, filters, modals, toasts.
// Children are presentational; this file makes all network calls.

import { useEffect, useMemo, useState } from 'react';
import StatCard from '../components/StatCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import TaskList from '../components/TaskList.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskDetails from '../components/TaskDetails.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Toast from '../components/Toast.jsx';
import {
  getTasks, createTask, updateTask, deleteTask,
} from '../services/taskService.js';

export default function Dashboard() {
  // ---------- state ----------
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    priority: 'All',
    sort: 'created-desc',
  });

  // Modal state: null = closed
  const [creating, setCreating] = useState(false);
  const [editing, setEditing]   = useState(null); // task object
  const [viewing, setViewing]   = useState(null); // task object
  const [confirming, setConfirming] = useState(null); // task object

  // Toasts array
  const [toasts, setToasts] = useState([]);

  // ---------- toasts ----------
  const pushToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
  };
  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  // ---------- initial load ----------
  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setLoadError('');
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ---------- stats (derived from tasks) ----------
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      progress: tasks.filter((t) => t.status === 'In Progress').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
    };
  }, [tasks]);

  // ---------- visible tasks (search + filter + sort) ----------
  const visibleTasks = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    let result = tasks;

    if (search) {
      result = result.filter((t) => t.title.toLowerCase().includes(search));
    }
    if (filters.status !== 'All') {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.priority !== 'All') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    const sorted = [...result];
    switch (filters.sort) {
      case 'created-asc':
        sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'due-asc':
        // Nulls sort last for ascending by due date.
        sorted.sort((a, b) => {
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date) - new Date(b.due_date);
        });
        break;
      case 'due-desc':
        sorted.sort((a, b) => {
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(b.due_date) - new Date(a.due_date);
        });
        break;
      case 'created-desc':
      default:
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return sorted;
  }, [tasks, filters]);

  // ---------- CRUD handlers ----------
  async function handleCreate(payload) {
    const created = await createTask(payload);
    setTasks((prev) => [created, ...prev]);
    setCreating(false);
    pushToast('success', 'Task created successfully.');
  }

  async function handleUpdate(id, payload) {
    const updated = await updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    setEditing(null);
    pushToast('success', 'Task updated successfully.');
  }

  async function handleDeleteConfirmed() {
    const target = confirming;
    try {
      await deleteTask(target.id);
      setTasks((prev) => prev.filter((t) => t.id !== target.id));
      pushToast('success', 'Task deleted.');
    } catch (err) {
      pushToast('error', err.message);
    } finally {
      setConfirming(null);
    }
  }

  async function handleToggle(task) {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const updated = await updateTask(task.id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      pushToast('success', `Marked as ${nextStatus}.`);
    } catch (err) {
      pushToast('error', err.message);
    }
  }

  // ---------- render ----------
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-header__subtitle">
            Manage your tasks — create, edit, complete, and delete.
          </p>
        </div>
        <button className="btn btn--primary" onClick={() => setCreating(true)}>
          + New Task
        </button>
      </div>

      <div className="stats-grid">
        <StatCard label="Total"       value={stats.total}     variant="total" />
        <StatCard label="Pending"     value={stats.pending}   variant="pending" />
        <StatCard label="In Progress" value={stats.progress}  variant="progress" />
        <StatCard label="Completed"   value={stats.completed} variant="completed" />
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {loading && <div className="loading">Loading tasks…</div>}

      {!loading && loadError && (
        <div className="empty-state">
          <h3>Could not load tasks</h3>
          <p>{loadError}</p>
          <button className="btn btn--primary" onClick={load}>Retry</button>
        </div>
      )}

      {!loading && !loadError && (
        <TaskList
          tasks={visibleTasks}
          onView={setViewing}
          onEdit={setEditing}
          onDelete={setConfirming}
          onToggle={handleToggle}
        />
      )}

      {/* ---------- modals ---------- */}
      {creating && (
        <TaskForm
          initial={null}
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      )}

      {editing && (
        <TaskForm
          initial={editing}
          onSubmit={(payload) => handleUpdate(editing.id, payload)}
          onCancel={() => setEditing(null)}
        />
      )}

      {viewing && (
        <TaskDetails task={viewing} onClose={() => setViewing(null)} />
      )}

      {confirming && (
        <ConfirmDialog
          title="Delete task?"
          message={`Are you sure you want to delete “${confirming.title}”? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirming(null)}
        />
      )}

      {/* ---------- toasts ---------- */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}