import { Menu, Bell, Search } from 'lucide-react';
import logoPng from '../assets/img/logo.png'

export default function Navbar({ onMenuClick }) {
    return (
        <nav className="bg-white/80 backdrop-blur-md border-b w-full sticky top-0 z-50"
            style={{ borderColor: "var(--colore-bordo)" }}
        >
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Sinistra: Hamburger (mobile) + Logo */}
                    <div className="flex items-center gap-3">
                        {/* Hamburger: visibile solo su mobile */}
                        <button
                            onClick={onMenuClick}
                            className="navbar-hamburger p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            style={{ display: 'none' }}
                        >
                            <Menu className="h-5 w-5" style={{ color: "var(--colore-testo-principale)" }} />
                        </button>

                        <div className="flex items-center gap-3">
                            <img
                                src={logoPng}
                                alt="Logo Business Travel"
                                className="navbar-logo h-10 w-10 rounded-xl object-cover shadow-sm"
                            />
                            <span className="navbar-brand-text text-lg font-semibold tracking-wide"
                                style={{ color: "var(--colore-primario-scuro)" }}
                            >
                                Business Travel
                            </span>
                        </div>
                    </div>

                    {/* Centro: Search bar (solo desktop) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--colore-testo-mutato)" }} />
                            <input
                                type="text"
                                placeholder="Cerca trasferte, rimborsi..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border transition-all duration-200 focus:outline-none focus:ring-2"
                                style={{
                                    borderColor: "var(--colore-bordo)",
                                    backgroundColor: "var(--colore-sfondo-alt)",
                                    color: "var(--colore-testo-principale)",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "var(--colore-primario-luce)";
                                    e.target.style.backgroundColor = "#fff";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "var(--colore-bordo)";
                                    e.target.style.backgroundColor = "var(--colore-sfondo-alt)";
                                }}
                            />
                        </div>
                    </div>

                    {/* Destra: Notifiche */}
                    <div className="flex items-center gap-2">
                        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                            <Bell size={20} style={{ color: "var(--colore-testo-secondario)" }} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--colore-pericolo)" }}></span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}