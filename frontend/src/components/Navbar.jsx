<<<<<<< Updated upstream
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
=======
import { useState } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';
import logoPng from '../assets/img/logo.png'

export default function Navbar() {
    // Creazione variabile isOpen per il menu hamburger
    // (true aperto, false chiuso)
    // setIsOpen cambia il valore
    const [isOpen, setIsOpen] = useState(false);

    return (
        // Sfondo bianco, ombra inferiore, bloccata in cima allo schermo
        // profondità z-50 (nessun elemento va sopra la navbar)
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
            {/* Larghezza massima navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Attiva flexbox, distribuisce i blocchi */}
                <div className="flex justify-between h-16 p-10">

                    {/*Logo e Nome Azienda */}
                    {/* Allinea logo e testo con un piccolo spazio tra loro */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        {/* Logo Azienda */}
                        <img
                            src={logoPng}
                            alt="Logo Business Travel"
                            // Logo a cerchio
                            className="h-16 w-16 rounded-full object-cover"
                        />
                        {/* Nome Azienda */}
                        {/* Testo sottile maiuscolo e distanziamento lettere */}
                        <span className="text-2xl font-light uppercase text-gray-900 tracking-widest font-sans">
                            Business Travel
                        </span>
                    </div>

                    {/* Link per home, gestionale, policy */}
                    {/* Nasconde il blocco sui schermi piccoli, posiziona
                    il blocco al centro  */}
                    <div className="hidden md:flex items-center space-x-10 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <a href="#home" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                            Home
                        </a>
                        <a href="#gestionale" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                            Gestionale
                        </a>
                        <a href="#policy" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                            Policy
                        </a>
                    </div>

                    {/* Link e bottone per il login */}
                    {/* Nasconde sempre il tasto su schermi piccoli
                    z-10 il blocco rimane cliccabile e non viene coperto
                    dal blocco centrale */}
                    <div className="hidden md:flex items-center z-10">
                        <a href="#login" className="bg-indigo-600 text-white px-4 p-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                            Login
                        </a>
                    </div>

                    {/* Menu Hamburger */}
                    {/* Si vede sugli schermi piccoli e non si vede su schermi grandi */}
                    <div className="flex items-center md:hidden">
                        <button
                            // Quando l'utente clicca si inverte lo stato true/false
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {/* Operatore ternario, se il menù è aperto mostra l'icona X per chiudere */}
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Dropdown*/}
            {/* Se isOpen è true mostra ciò che c'è tra parentesi */}
            {isOpen && (
                <div className="md:hidden bg-gray-50 border-t border-gray-100 animate-fadeIn">
                    <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                        <a
                            href="#home"
                            className="block px-3 p-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                            // Quando l'utente clicca su un link per cambiare pagina
                            // La tendina si richiude automaticamente
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </a>
                        <a
                            href="#gestionale"
                            className="block px-3 p-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                            onClick={() => setIsOpen(false)}
                        >
                            Gestionale
                        </a>
                        <a
                            href="#policy"
                            className="block px-3 p-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                            onClick={() => setIsOpen(false)}
                        >
                            Policy
                        </a>
                        <a
                            href="#login"
                            className="block text-center bg-indigo-600 text-white px-4 p-2 rounded-lg font-medium hover:bg-indigo-700 mt-4"
                            onClick={() => setIsOpen(false)}
                        >
                            Login
                        </a>
                    </div>
                </div>
            )}
>>>>>>> Stashed changes
        </nav>
    );
}