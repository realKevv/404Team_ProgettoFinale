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

  // Simulazione utente loggato
  const utenteLoggato = {
    nome_completo: "Sara Bianchi",
    ruolo: "admin"
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
            {/* ROTTE USER */}
            <Route path="/viaggi" element={<Dashboard />} />
            <Route path="/rimborsi" element={<Dashboard />} />
            <Route path="/viaggi/nuovo" element={<Dashboard />} />
            {/* ROTTA PROFILO */}
            <Route path="/profilo" element={<Dashboard />} />
            {/* ROTTE ADMIN */}
            <Route path="/admin/approvazioni" element={<Dashboard />} />
            <Route path="/admin/trasferte" element={<Dashboard />} />
            <Route path="/admin/dipendenti" element={
              <div className="p-8 text-center text-[var(--colore-testo-secondario)]">
                <h1 className="text-2xl font-bold">👥 Elenco Dipendenti</h1>
              </div>
            } />
            <Route path="/admin/policies" element={
              <div className="p-8 text-center text-[var(--colore-testo-secondario)]">
                <h1 className="text-2xl font-bold">🛡️ Travel Policies</h1>
              </div>
            } />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;