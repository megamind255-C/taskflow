// client/src/components/Sidebar.jsx
// Simple brand + nav. In v1 there's only one page, but the structure
// is ready for more (e.g., "Completed Tasks", "Settings").

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">T</span>
        <span>TaskFlow</span>
      </div>

      <nav className="sidebar__nav">
        <a href="#" className="sidebar__nav-item is-active" onClick={(e) => e.preventDefault()}>
          <span aria-hidden="true">📋</span> Dashboard
        </a>
      </nav>

      <div className="sidebar__footer">
        <div>Personal Task Manager</div>
        <div>v1.0 — PERN Stack</div>
      </div>
    </aside>
  );
}