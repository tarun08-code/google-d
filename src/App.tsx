import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  const handleAdminLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    window.location.href = '/';
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={isAdminLoggedIn ? <AdminPanel onLogout={handleAdminLogout} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;