import './App.css';
import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Componenti
import { Sidebar } from './components/Sidebar';
import Navbar from './components/Navbar';

// Pagine
import HomePage from './pages/HomePage';
import { Dashboard } from './pages/Dashboard';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const utenteLoggato = {
    nome: "Kevin",
    ruolo: "user"
  };

  const handleLogout = () => {
    console.log("Logout effettuato");
  };

  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Landing page: full screen senza sidebar/navbar
  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        utente={utenteLoggato}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-main-area">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/viaggi" element={<Dashboard />} />
            <Route path="/rimborsi" element={<Dashboard />} />
            <Route path="/viaggi/nuovo" element={<Dashboard />} />
            <Route path="/profilo" element={<Dashboard />} />
            <Route path="/admin/approvazioni" element={<Dashboard />} />
            <Route path="/admin/trasferte" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;