import { NavLink } from "react-router-dom";
import "../mockData.js"

import {
    LayoutDashboard,
    Plane,
    Receipt,
    PlusCircle,
    ClipboardCheck,
    Users,
    User,
    LogOut
} from "lucide-react";

//componente Sidebar
export function Sidebar({ utente, onLogout }) {
    //creo stringa di classi Tailwind riutilizzabile
    //flex metto in orizzontale; item-center centro verticalmente icona e testo
    //gap 3 (12px) è lo spazio tra l'icona e testo; px-4 (16px) e py-3(12px) sono rispettivamente il padding sx/dx e sopra/sotto
    //rounded-lg arrotonda gli angoli; transition-all e duration-200 applicano una transizione fluida di 0.2s a tutte le proprietà CSS al passaggio del mouse
    const baseLinkClass = `
    flex 
    items-center
    gap-3
    px-4
    py-3
    rounded-lg
    transition-all
    duration-200`;

    //funzione che gestisce se un link è attivo o meno
    const renderLinkStyle = ({ isActive }) => ({
        backgroundColor: isActive
            ? "var(--colore-sfondo-alt)"
            : "transparent",

        color: isActive
            ? "var(--colore-primario)"
            : "var(--colore-testo-principale)",

        fontWeight: isActive ? "600" : "400"

    });

    return (
        <aside
            //w-64:la sidebar ha larghezza fissa di 256px; min-h-screen:la sidebar occupa tutta l'altezza dello schermo;
            //flex-col:dispongo gli elementi in verticale;p-4(16px):spazio interno su tutti i lati;
            //border-r:aggiungo un bordo sinistro per separarla dal contenuto;
            //shrink-0:impedisce che la sidebar si ridimensioni;
            className="
                w-64
                min-h-screen
                flex
                flex-col
                justify-between
                p-4
                border-r
                shrink-0
            "
            style={{
                backgroundColor: "var(--colore-sfondo-card)",
                borderColor: "var(--colore-bordo)"
            }}
        >
            {/* menù principale */}
            {/* attivo flexbox, li metto in colonna, gap di 8 px(spazio tra gli elementi) */}
            <nav className="flex flex-col gap-2">

                {/* DASHBOARD */}
                <NavLink to="/dashboard" className={baseLinkClass} style={renderLinkStyle}>
                    <LayoutDashboard size={20} style={{ color: "var(--colore-primario-luce)" }} />
                    <span>Dashboard</span>
                </NavLink>

                {/* USER MENU */}

                {utente?.ruolo === "user" && (
                    <>
                        <NavLink to="/viaggi" className={baseLinkClass} style={renderLinkStyle}>
                            {/* size{20}: width e height 20px */}
                            <Plane size={20} style={{ color: "var(--colore-secondario)" }} />
                            <span>Viaggi</span>
                        </NavLink>

                        <NavLink to="/rimborsi" className={baseLinkClass} style={renderLinkStyle}>
                            <Receipt size={20} style={{ color: "var(--colore-accento)" }} />
                            <span>Rimborsi</span>
                        </NavLink>

                        <NavLink to="/viaggi/nuovo" className={baseLinkClass} style={renderLinkStyle}>
                            <PlusCircle size={20} style={{ color: "var(--colore-successo)" }} />
                            <span>Nuova Trasferta</span>
                        </NavLink>

                    </>
                )}

                {/* ADMIN MENU */}

                {utente?.ruolo === "admin" && (
                    <>
                        <NavLink to="/admin/approvazioni" className={baseLinkClass} style={renderLinkStyle}>
                            <ClipboardCheck size={20} style={{ color: "var(--colore-info)" }} />
                            <span>Approvazioni</span>
                        </NavLink>

                        <NavLink to="/admin/trasferte" className={baseLinkClass} style={renderLinkStyle}>
                            <Plane size={20} style={{ color: "var(--colore-secondario)" }} />
                            <span>Tutte le Trasferte</span>
                        </NavLink>
                    </>
                )}

            </nav>


            {/* sezione sotto */}
            <div>
                {/* SEPARATORE */}
                {/* my-4:Margine superiore e inferiore di 16px. */}
                <div className="my-4" style={{ borderTop: "1px solid var(--colore-bordo)" }} />

                {/* PROFILO */}
                <NavLink to="/profilo" className={baseLinkClass} style={renderLinkStyle}>
                    <User size={20} style={{ color: "var(--colore-testo-secondario)" }} />
                    <span>Profilo</span>
                </NavLink>

                {/* LOGOUT */}
                <button
                    // quando clicco il bottone esco
                    onClick={onLogout}
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-lg
                        transition-all
                        hover:bg-red-50
                    "
                >
                    <LogOut size={20} style={{ color: "var(--colore-pericolo)" }} />
                    <span style={{ color: "var(--colore-pericolo)" }}>
                        Esci
                    </span>
                </button>

            </div>


        </aside>
    )
}
