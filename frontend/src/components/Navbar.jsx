import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Menu, Bell, Home, X } from 'lucide-react';
import { Link } from 'react-router-dom';
// Importiamo lo store globale (Zustand) che gestisce i dati dell'applicazione
import { useStore } from '../store/store';
import logoPng from '../assets/img/logo.png';

export default function Navbar({ onMenuClick }) {

    const isNotifOpen = useStore((state) => state.isNotifOpen);
    const setIsNotifOpen = useStore((state) => state.setIsNotifOpen);

    // Intercetta i click dall'esterno delle notifiche
    const notifRef = useRef(null);

    // Stato iniziale basato sul localStorage per evitare che le notifiche già lette
    // riappaiano se l'utente ricarica la pagina web con il tasto F5
    const [notificheLette, setNotificheLette] = useState(() => {
        const salvate = localStorage.getItem('notifiche_lette_ids');
        return salvate ? JSON.parse(salvate) : [];
    });

    // La Navbar reagisce solo se cambiano gli elementi interni all'array 'trasferte' 
    const trasferte = useStore((state) => state.trasferte);
    const utenteAutenticato = useStore((state) => state.utenteAutenticato);

    // useMemo memorizza il risultato del filtro. Viene ricalcolato solo
    // quando cambiano i dati reali nel database (trasferte), l'utente loggato o l'elenco dei letti.
    const userNotifications = useMemo(() => {
        // Controllo di sicurezza: se l'array non è pronto o è vuoto, restituisce un array vuoto
        if (!trasferte || !Array.isArray(trasferte)) return [];

        return trasferte
            // 1. FILTRO: Mostra le trasferte assegnate all'utente attualmente loggato
            .filter(trip => {
                if (utenteAutenticato?.id) {
                    return trip.id_utente === utenteAutenticato.id;
                }
                return true;
            })
            // 2. MAP: Trasforma l'oggetto trasferta in un messaggio leggibile dall'utente
            .map(trip => {
                let messaggio = `Nuova trasferta assegnata per ${trip.destinazione}.`;

                // Personalizza il testo della notifica in base allo stato impostato dall'Admin
                if (trip.stato === 'approvata') messaggio = `L'admin ha approvato la tua trasferta a ${trip.destinazione}! 🎉`;
                if (trip.stato === 'rifiutata') messaggio = `La richiesta per ${trip.destinazione} è stata rifiutata dall'admin.`;

                return {
                    // ID univoco composto da ID della trasferta + stato corrente per tracciare i cambi di stato
                    id: `${trip.id}-${trip.stato}`,
                    text: messaggio,
                    time: trip.updated_at ? "Aggiornato" : "Nuovo"
                };
            })
            // 3. FILTRO FINALE: Esclude all'istante le notifiche i cui ID sono presenti dentro l'array notifiche lette
            .filter(notif => !notificheLette.includes(notif.id));

    }, [trasferte, utenteAutenticato?.id, notificheLette]);

    // Variabile booleana: attiva il pallino rosso solo se la lista contiene almeno una notifica
    const mostraPallinoRosso = userNotifications.length > 0;

    // ── RIMOZIONE ISTANTANEA AL CLICK ──
    const gestisciClickNotifica = (id) => {
        // Aggiunge l'ID cliccato all'elenco di quelli letti
        const nuoveLette = [...notificheLette, id];
        // Aggiorna lo stato di React (fa sparire la notifica a schermo)
        setNotificheLette(nuoveLette);
        // Salva la scelta nel browser così la decisione rimane memorizzata
        localStorage.setItem('notifiche_lette_ids', JSON.stringify(nuoveLette));
    };



    useEffect(() => {
        // controlla dove l'utente clicca
        function handleClickOutside(event) {
            // SE la tendina esiste a schermo (notifRef.current) 
            // E l'utente ha cliccato FUORI da quella zona (!notifRef.current.contains)
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                // Allora chiudi la tendina delle notifiche in tutto il sito
                setIsNotifOpen(false);
            }
        }
        // Diciamo al browser di attivare il controllo 
        // ogni volta che l'utente preme il tasto del mouse ("mousedown") in un punto qualsiasi dello schermo.
        document.addEventListener("mousedown", handleClickOutside);
        // Quando questo pezzo di sito viene chiuso o l'utente cambia pagina,
        // diciamo al browser di eliminare i controllo
        return () => document.removeEventListener("mousedown", handleClickOutside);
        // [setIsNotifOpen] dice a React: "Fai partire questo controllo una sola volta all'inizio, 
        // usando la funzione dello store globale per gestire la tendina".
    }, [setIsNotifOpen]);

    return (
        <nav
            // className: Sfondo bianco un po' trasparente che sfoca i disegni sotto quando si scorre. 
            // Resta appiccicata in alto (sticky top-0) e sta sopra a tutto il resto (z-50)        
            className="bg-white/80 backdrop-blur-md border-b w-full sticky top-0 z-50"
            style={{ borderColor: 'var(--colore-bordo)' }}
        >
            {/* Scatola interna che tiene i contenuti distanti dai bordi dello schermo */}
            <div className="px-4 sm:px-6 lg:px-8">
                {/* Mette le cose in linea: logo a sinistra e pulsanti a destra */}
                <div className="flex items-center justify-between h-16">

                    {/* LATO SINISTRO: Hamburger Menu e Logo Aziendale */}
                    <div className="flex items-center gap-3">
                        {/* Il bottone con le 3 linee per il schermi piccoli nascosto con display: 'none' */}
                        <button
                            onClick={onMenuClick}
                            className="navbar-hamburger p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            style={{ display: 'none' }}
                        >
                            <Menu className="h-5 w-5" style={{ color: 'var(--colore-testo-principale)' }} />
                        </button>
                        {/* Logo e scritta "Business Travel". Se ci clicchi sopra torni alla Home */}
                        {/* 'group' serve a dire: "Quando il mouse passa qui sopra, fai ingrandire la foto del logo" */}
                        <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
                            <img
                                src={logoPng}
                                alt="Business Travel logo"
                                className="navbar-logo h-10 w-10 rounded-xl object-cover shadow-sm transition-transform duration-200 group-hover:scale-105"
                            />
                            {/* Nome del sito in lettere grandi, sottili e staccate */}
                            <span
                                className="text-2xl font-light uppercase text-gray-900 tracking-widest font-sans"
                                style={{ color: 'var(--colore-primario-scuro)' }}
                            >
                                Business Travel
                            </span>
                        </Link>
                    </div>

                    {/* LATO DESTRO: Navigazione Home + Icona Campanella con Dropdown */}
                    {/* Agganciamo qui il ref per monitorare i click esterni alla sezione */}
                    <div className="flex items-center gap-2" ref={notifRef}>

                        {/* Collegamento ipertestuale alla Home */}
                        <Link
                            to="/"
                            title="Torna alla Homepage"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100"
                            style={{ color: 'var(--colore-testo-secondario)', textDecoration: 'none' }}
                        >
                            <Home size={18} />
                            <span className="hidden sm:inline">Home</span>
                        </Link>

                        {/* Contenitore Relativo della sezione notifiche per ancorare la tendina */}
                        <div className="relative">
                            {/* Bottone Campanella */}
                            {/* cursor-pointer = mostra la manina quando ci passi sopra con il mouse */}
                            {/* Se la tendina è aperta, il bottone resta colorato di grigio chiaro */}
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className={`relative p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer ${isNotifOpen ? 'bg-gray-100' : ''}`}
                            >
                                <Bell size={20} style={{ color: 'var(--colore-testo-secondario)' }} />

                                {/* Il pallino rosso compare dinamicamente solo se mostraPallinoRosso è vero */}
                                {mostraPallinoRosso && (
                                    <span
                                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                                        style={{ backgroundColor: 'var(--colore-pericolo)' }}
                                    />
                                )}
                            </button>

                            {/* TENDINA NOTIFICHE: Appare a schermo solo se lo stato isNotifOpen è true */}
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">

                                    {/* Intestazione del Dropdown */}
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-800 text-sm">Le tue Notifiche</h3>
                                        {/* Pulsante con la "X" per chiudere, si vede solo su schermi piccoli */}
                                        <button onClick={() => setIsNotifOpen(false)} className="text-gray-400 hover:text-gray-600 sm:hidden">
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Elenco delle notifiche. Se diventano troppe, crea una barra di scorrimento interna (max-h-80) */}
                                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                                        {/* SE NON CI SONO NOTIFICHE: mostra questa scritta */}
                                        {userNotifications.length === 0 ? (
                                            <div className="p-6 text-center text-sm text-gray-400">
                                                Nessun nuovo aggiornamento sui tuoi viaggi
                                            </div>
                                        ) : (
                                            // SE CI SONO NOTIFICHE: le mostra una sotto l'altra
                                            userNotifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    // Quando l'utente fa click sulla riga della notifica, chiama la funzione di rimozione immediata
                                                    onClick={() => gestisciClickNotifica(notif.id)}
                                                    // Cambia colore quando ci passi sopra e mostra la manina
                                                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer text-xs sm:text-sm flex items-start justify-between gap-2"
                                                    title="Clicca per segnare come letta e rimuovere"
                                                >
                                                    {/* Testo del messaggio e scritta "Nuovo" o "Aggiornato" */}
                                                    <div className="flex-1">
                                                        <p className="text-gray-700 leading-relaxed font-medium">
                                                            {notif.text}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400 block mt-1">{notif.time}</span>
                                                    </div>
                                                    {/* Pallino */}
                                                    <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: 'var(--colore-pericolo)' }} />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
}