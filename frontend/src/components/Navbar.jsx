import { Menu, Bell, Search, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoPng from '../assets/img/logo.png';

// Componente accetta prop con onMenuClick
// Funzione che passa da genitore a e gestisce
// Apertura menu hamburger
export default function Navbar({ onMenuClick }) {
    return (
        <nav
            // Colore bianco semi trasparente, combina con sfocatura dello sfondo
            className="bg-white/80 backdrop-blur-md border-b w-full sticky top-0 z-50"
            // Colore bordo inferiore
            style={{ borderColor: 'var(--colore-bordo)' }}
        >
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Hamburger (mobile) + Logo cliccabile */}
                    <div className="flex items-center gap-3">
                        {/* Hamburger – visibile solo su mobile */}
                        <button
                            onClick={onMenuClick}
                            className="navbar-hamburger p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            // Hamburger nascosto sugli schermi, si vede solo su schermi piccoli
                            style={{ display: 'none' }}
                        >
                            <Menu className="h-5 w-5" style={{ color: 'var(--colore-testo-principale)' }} />
                        </button>

                        {/* Logo + brand → cliccabile → torna alla Homepage 
                        group -> attiva le animazioni sui figli */}

                        <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
                            <img
                                src={logoPng}
                                alt="Business Travel logo"
                                className="navbar-logo h-10 w-10 rounded-xl object-cover shadow-sm
                                           transition-transform duration-200 group-hover:scale-105"
                            />
                            <span
                                className="text-2xl font-light uppercase text-gray-900 tracking-widest font-sans"
                                style={{ color: 'var(--colore-primario-scuro)' }}
                            >
                                Business Travel
                            </span>
                        </Link>
                    </div>

                    {/* ── Centro: Search bar (solo desktop) ── */}
                    {/* solo su schermi grandi -> flex flex-1 max-w-md mx-8 */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                                style={{ color: 'var(--colore-testo-mutato)' }}
                            />
                            {/* Barra di ricerca */}
                            <input
                                type="text"
                                placeholder="Cerca trasferte, rimborsi..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border
                                           transition-all duration-200 focus:outline-none focus:ring-2"
                                style={{
                                    borderColor: 'var(--colore-bordo)',
                                    backgroundColor: 'var(--colore-sfondo-alt)',
                                    color: 'var(--colore-testo-principale)',
                                }}
                                // onFocus -> il bordo si illumina e lo sfondo diventa bianco
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--colore-primario-luce)';
                                    e.target.style.backgroundColor = '#fff';
                                }}
                                // onBlur -> il bordo torna come prima e lo sfondo diventa grigio
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--colore-bordo)';
                                    e.target.style.backgroundColor = 'var(--colore-sfondo-alt)';
                                }}
                            />
                        </div>
                    </div>

                    {/* ── Destra: pulsante Home + Notifiche ── */}
                    <div className="flex items-center gap-2">

                        {/* Pulsante Home esplicito */}
                        <Link
                            to="/"
                            title="Torna alla Homepage"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm
                                       font-medium transition-all duration-200 hover:bg-gray-100"
                            style={{ color: 'var(--colore-testo-secondario)', textDecoration: 'none' }}
                        >
                            <Home size={18} />
                            {/* Nasconde la scritta home su schermi piccoli */}
                            <span className="hidden sm:inline">Home</span>
                        </Link>

                        {/* Notifiche */}
                        {/* Bottone posizionato in modo assoluto */}
                        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                            <Bell size={20} style={{ color: 'var(--colore-testo-secondario)' }} />
                            <span
                                // Pallino rosso per indicare notifiche
                                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                                style={{ backgroundColor: 'var(--colore-pericolo)' }}
                            />
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}