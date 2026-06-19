import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Plane,
    Receipt,
    PlusCircle,
    ClipboardCheck,
    User,
    LogOut,
    X,
    Users,
    Shield,
    History,
    UserPlus,
    UserMinus
} from "lucide-react";

export function Sidebar({ utente, onLogout, isOpen, onClose }) {

    const baseLinkClass = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium`;

    const renderLinkStyle = ({ isActive }) => ({
        backgroundColor: isActive ? "var(--colore-primario)" : "transparent",
        color: isActive ? "#ffffff" : "var(--colore-testo-secondario)",
        fontWeight: isActive ? "600" : "500",
        boxShadow: isActive ? "0 4px 12px rgba(30, 58, 138, 0.25)" : "none"
    });

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />

            <aside className={`sidebar w-64 min-h-screen flex flex-col justify-between p-5 border-r shrink-0 ${isOpen ? 'sidebar-open' : ''}`}
                style={{ backgroundColor: "var(--colore-sfondo-card)", borderColor: "var(--colore-bordo)" }}>

                <div>
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div>
                            <h2 className="text-lg font-bold" style={{ color: "var(--colore-primario-scuro)" }}>Business Travel</h2>
                            <p className="text-xs mt-0.5" style={{ color: "var(--colore-testo-mutato)" }}>Gestionale Trasferte</p>
                        </div>
                        <button onClick={onClose} className="md:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors">
                            <X size={20} style={{ color: "var(--colore-testo-mutato)" }} />
                        </button>
                    </div>

                    <p className="text-[10px] uppercase tracking-widest font-semibold px-4 mb-3" style={{ color: "var(--colore-testo-mutato)" }}>Menu Principale</p>

                    <nav className="flex flex-col gap-1">
                        {/* ==================================
                            ROTTE CONDIVISE (Tutti le vedono)
                        ================================== */}
                        <NavLink to="/dashboard" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </NavLink>

                        {/* 🔥 SPOSTATO QUI: Ora tutti vedono chi c'è in ufficio! */}
                        <NavLink to="/dipendenti" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                            <Users size={18} />
                            <span>Status Team</span>
                        </NavLink>

                        {/* ==================================
                            USER MENU (Dipendente)
                        ================================== */}
                        {utente?.ruolo === "user" && (
                            <>
                                <NavLink to="/viaggi" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <Plane size={18} />
                                    <span>I Miei Viaggi</span>
                                </NavLink>
                                <NavLink to="/rimborsi" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <Receipt size={18} />
                                    <span>Note Spese</span>
                                </NavLink>
                                <NavLink to="/viaggi/storico" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <History size={18} />
                                    <span>Storico Viaggi</span>
                                </NavLink>
                            </>
                        )}

                        {/* ==================================
                            ADMIN MENU (Sara Bianchi)
                        ================================== */}
                        {utente?.ruolo === "admin" && (
                            <>
                                <NavLink to="/admin/approvazioni" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <ClipboardCheck size={18} />
                                    <span>Approvazioni</span>
                                </NavLink>
                                <NavLink to="/rimborsi" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <Receipt size={18} />
                                    <span>Approvazione Spese</span>
                                </NavLink>
                                <NavLink to="/admin/trasferte" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <Plane size={18} />
                                    <span>Tutte le Trasferte</span>
                                </NavLink>
                                <NavLink to="/admin/policies" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <Shield size={18} />
                                    <span>Travel Policies</span>
                                </NavLink>
                                <NavLink to="/admin/nuovo-utente" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <UserPlus size={18} />
                                    <span>Aggiungi Utente</span>
                                </NavLink>
                                <NavLink to="/admin/rimuovi-utente" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                                    <UserMinus size={18} />
                                    <span>Rimuovi Utente</span>
                                </NavLink>
                            </>
                        )}
                    </nav>
                </div>

                {/* Sezione bassa */}
                <div>
                    <div className="my-4" style={{ borderTop: "1px solid var(--colore-bordo)" }} />
                    <NavLink to="/profilo" className={baseLinkClass} style={renderLinkStyle} onClick={onClose}>
                        <User size={18} />
                        <span>Il Mio Profilo</span>
                    </NavLink>
                    <button onClick={() => { onLogout(); if (onClose) onClose(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium mt-1"
                        style={{ color: "var(--colore-pericolo)" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--colore-pericolo-sfondo)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <LogOut size={18} />
                        <span>Esci</span>
                    </button>

                    <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: "var(--colore-sfondo-alt)" }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase" style={{ backgroundColor: "var(--colore-primario)" }}>
                            {utente?.nome_completo?.charAt(0) || "U"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate" style={{ color: "var(--colore-testo-principale)" }}>
                                {utente?.nome_completo || "Utente"}
                            </p>
                            <p className="text-xs capitalize truncate" style={{ color: "var(--colore-testo-mutato)" }}>
                                {utente?.ruolo || "user"}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}