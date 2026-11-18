// client/src/components/FilterBar.jsx
// Search + filter + sort controls. Purely presentational:
// the parent owns the filter state and passes setters down.

export default function FilterBar({ filters, onChange }) {
  const update = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="filter-bar">
      <div className="filter-bar__field">
        <label className="filter-bar__label" htmlFor="search">Search</label>
        <input
          id="search"
          type="text"
          className="input"
          placeholder="Search by title…"
          value={filters.search}
          onChange={update('search')}
        />
      </div>

      <div className="filter-bar__field">
        <label className="filter-bar__label" htmlFor="status">Status</label>
        <select id="status" className="select" value={filters.status} onChange={update('status')}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="filter-bar__field">
        <label className="filter-bar__label" htmlFor="priority">Priority</label>
        <select id="priority" className="select" value={filters.priority} onChange={update('priority')}>
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="filter-bar__field">
        <label className="filter-bar__label" htmlFor="sort">Sort by</label>
        <select id="sort" className="select" value={filters.sort} onChange={update('sort')}>
          <option value="created-desc">Created (newest)</option>
          <option value="created-asc">Created (oldest)</option>
          <option value="due-asc">Due date (soonest)</option>
          <option value="due-desc">Due date (latest)</option>
        </select>
      </div>
    </div>
  );
}