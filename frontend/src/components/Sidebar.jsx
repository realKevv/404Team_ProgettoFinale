import { NavLink } from "react-router-dom";
import "../mockData.js"

import {
    LayoutDashboard,
    Plane,
    Receipt,
    PlusCircle,
    ClipboardCheck,
    User,
    LogOut,
    X
} from "lucide-react";

// Componente Sidebar
export function Sidebar({ utente, onLogout, isOpen, onClose }) {

    const baseLinkClass = `
    flex 
    items-center
    gap-3
    px-4
    py-3
    rounded-xl
    transition-all
    duration-200
    text-sm
    font-medium`;

    const renderLinkStyle = ({ isActive }) => ({
        backgroundColor: isActive
            ? "var(--colore-primario)"
            : "transparent",
        color: isActive
            ? "#ffffff"
            : "var(--colore-testo-secondario)",
        fontWeight: isActive ? "600" : "500",
        boxShadow: isActive
            ? "0 4px 12px rgba(30, 58, 138, 0.25)"
            : "none"
    });

    return (
        <>
            {/* Overlay scuro su mobile */}
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            <aside
                className={`sidebar w-64 min-h-screen flex flex-col justify-between p-5 border-r shrink-0 ${isOpen ? 'sidebar-open' : ''}`}
                style={{
                    backgroundColor: "var(--colore-sfondo-card)",
                    borderColor: "var(--colore-bordo)"
                }}
            >
                {/* Header sidebar */}
                <div>
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: "var(--colore-primario-scuro)" }}>
                                Business Travel
                            </h2>
                            <p className="text-xs mt-0.5" style={{ color: "var(--colore-testo-mutato)" }}>
                                Gestionale Trasferte
                            </p>
                        </div>
                        {/* Chiudi su mobile */}
                        <button
                            onClick={onClose}
                            className="md:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} style={{ color: "var(--colore-testo-mutato)" }} />
                        </button>
                    </div>

                    {/* Label sezione */}
                    <p className="text-[10px] uppercase tracking-widest font-semibold px-4 mb-3" style={{ color: "var(--colore-testo-mutato)" }}>
                        Menu Principale
                    </p>

                    <nav className="flex flex-col gap-1">
                        {/* DASHBOARD */}
                        <NavLink to="/dashboard" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </NavLink>

                        {/* USER MENU */}
                        {utente?.ruolo === "user" && (
                            <>
                                <NavLink to="/viaggi" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <Plane size={18} />
                                    <span>Viaggi</span>
                                </NavLink>

                                <NavLink to="/rimborsi" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <Receipt size={18} />
                                    <span>Rimborsi</span>
                                </NavLink>

                                <NavLink to="/viaggi/nuovo" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <PlusCircle size={18} />
                                    <span>Nuova Trasferta</span>
                                </NavLink>
                            </>
                        )}

                        {/* ADMIN MENU */}
                        {utente?.ruolo === "admin" && (
                            <>
                                <NavLink to="/admin/approvazioni" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <ClipboardCheck size={18} />
                                    <span>Approvazioni</span>
                                </NavLink>

                                <NavLink to="/admin/trasferte" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <Plane size={18} />
                                    <span>Tutte le Trasferte</span>
                                </NavLink>
                            </>
                        )}
                    </nav>
                </div>

                {/* Sezione bassa */}
                <div>
                    <div className="my-4" style={{ borderTop: "1px solid var(--colore-bordo)" }} />

                    {/* PROFILO */}
                    <NavLink to="/profilo" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                        <User size={18} />
                        <span>Profilo</span>
                    </NavLink>

                    {/* LOGOUT */}
                    <button
                        onClick={() => { onLogout(); if (onClose) onClose(); }}
                        className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-xl
                            transition-all
                            duration-200
                            text-sm
                            font-medium
                            mt-1
                        "
                        style={{ color: "var(--colore-pericolo)" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--colore-pericolo-sfondo)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <LogOut size={18} />
                        <span>Esci</span>
                    </button>

                    {/* User card */}
                    <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: "var(--colore-sfondo-alt)" }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: "var(--colore-primario)" }}>
                            {utente?.nome?.charAt(0) || "U"}
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--colore-testo-principale)" }}>
                                {utente?.nome || "Utente"}
                            </p>
                            <p className="text-xs capitalize" style={{ color: "var(--colore-testo-mutato)" }}>
                                {utente?.ruolo || "user"}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
