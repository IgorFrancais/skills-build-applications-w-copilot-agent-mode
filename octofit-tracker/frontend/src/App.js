import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg app-navbar">
        <div className="container py-2">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/users">
            <img src="/octofitapp-small.png" alt="Octofit logo" className="app-logo" />
            <span className="fw-semibold">Octofit Tracker</span>
          </NavLink>
          <div className="navbar-nav ms-auto gap-1">
            <NavLink className={({ isActive }) => `nav-link px-3 rounded-pill ${isActive ? 'active' : ''}`} to="/users">
              Users
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link px-3 rounded-pill ${isActive ? 'active' : ''}`} to="/teams">
              Teams
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link px-3 rounded-pill ${isActive ? 'active' : ''}`} to="/activities">
              Activities
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link px-3 rounded-pill ${isActive ? 'active' : ''}`} to="/leaderboard">
              Leaderboard
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link px-3 rounded-pill ${isActive ? 'active' : ''}`} to="/workouts">
              Workouts
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="pb-4">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
