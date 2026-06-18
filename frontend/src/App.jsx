import './App.css';
import { useState, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Componenti
import { Sidebar } from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Footer from './components/Footer';

// Pagine
import HomePage from './pages/HomePage';
import { Dashboard } from './pages/Dashboard';
import { DipendentiPage } from './pages/DipendentiPage';
import { NoteSpesePage } from './pages/NoteSpesePage';
import { ProfiloUtente } from './pages/ProfiloUtente';
import { ListaViaggi } from './pages/ListaViaggi';
import { ApprovazioniTrasfertePage } from './pages/ApprovazioniTrasfertePage';
import { TravelPoliciesPage } from './pages/TravelPoliciesPage';
import { StoricoViaggiPage } from './pages/StoricoViaggiPage';
import { MieiViaggiPage } from './pages/MieiViaggiPage';
import { ThemeProvider } from './context/ThemeContext';

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
      <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </ThemeProvider>
    );
  }

  // 2. Utente LOGGATO su "/"
  if (isLandingPage) {
    return (  
      <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      </ThemeProvider>
    );
  }

  // 3. Utente LOGGATO su rotte protette
  return (
    <ThemeProvider>
      
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

            {/* La pagina Status Team/Dipendenti è ora per tutti */}
            <Route path="/dipendenti" element={<DipendentiPage />} />

            {/* Rotte User */}
            <Route path="/viaggi" element={<MieiViaggiPage />} />
            <Route path="/rimborsi" element={<NoteSpesePage />} />
            <Route path="/viaggi/nuovo" element={<Dashboard />} />
            <Route path="/profilo" element={<ProfiloUtente />} />

            {/* Rotte Admin */}
            <Route path="/admin/approvazioni" element={<ApprovazioniTrasfertePage />} />

            <Route path="/admin/trasferte" element={<ListaViaggi />} />
            <Route path="/viaggi/storico" element={<StoricoViaggiPage />} />
            <Route path="/admin/policies" element={<TravelPoliciesPage />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
      </ThemeProvider>   
  );
}

export default App;