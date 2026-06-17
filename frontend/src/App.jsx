<<<<<<< Updated upstream
import './App.css';
import { useState, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
=======
import Navbar from './components/Navbar'
import './App.css'
>>>>>>> Stashed changes

// Componenti
import { Sidebar } from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Footer from './components/Footer';

<<<<<<< Updated upstream
// Pagine
import HomePage from './pages/HomePage';
import { Dashboard } from './pages/Dashboard';
import { DipendentiPage } from './pages/DipendentiPage';

// Helper: legge in sicurezza dal localStorage
function readToken() {
  const t = localStorage.getItem('token');
  return t && t !== 'undefined' ? t : null;
}

function readUtente() {
  try {
    const raw = localStorage.getItem('utente');
    if (raw && raw !== 'undefined') return JSON.parse(raw);
  } catch (_) { }
  return null;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [token, setToken] = useState(readToken);
  const [utenteLoggato, setUtenteLoggato] = useState(readUtente);

  const handleLoginSuccess = useCallback(() => {
    setToken(readToken());
    setUtenteLoggato(readUtente());
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('utente');
    setToken(null);
    setUtenteLoggato(null);
  }, []);

  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // 1. Utente NON loggato
  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 2. Utente LOGGATO su "/"
  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    );
  }

  // 3. Utente LOGGATO su rotte protette
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

            {/* 🔥 La pagina Status Team/Dipendenti è ora per tutti */}
            <Route path="/dipendenti" element={<DipendentiPage />} />

            {/* Rotte User */}
            <Route path="/viaggi" element={<Dashboard />} />
            <Route path="/rimborsi" element={<Dashboard />} />
            <Route path="/viaggi/nuovo" element={<Dashboard />} />
            <Route path="/profilo" element={<Dashboard />} />

            {/* Rotte Admin */}
            <Route path="/admin/approvazioni" element={<Dashboard />} />
            <Route path="/admin/trasferte" element={<Dashboard />} />
            <Route path="/admin/policies" element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--colore-testo-principale)' }}>
                  🛡️ Travel Policies
                </h1>
              </div>
            } />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
=======
  return (
    <>
      <Navbar />
    </>
  )
}

export default App;
>>>>>>> Stashed changes
