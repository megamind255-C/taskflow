// client/src/App.jsx
// Top-level shell: Sidebar + Dashboard.

import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Dashboard />
      </main>
    </div>
  );
}