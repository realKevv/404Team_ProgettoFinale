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
                    <div className="flex items-center space-x-2 flex-shrink-0 mr-16">
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
                    <div className="hidden lg:flex justify-center items-center w-2/4 space-x-10">
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
        </nav>
    );
}