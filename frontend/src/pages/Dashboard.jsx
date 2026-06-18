import React, { useEffect, useState } from 'react';
import { Plane, Clock, CheckCircle, Info, X, Calendar, FileText, MapPin } from 'lucide-react';
import { TrasferteTable } from '../components/trasferte/TrasferteTable';
import { TrasferteForm } from '../components/trasferte/TrasferteForm';
import { ColleaguesTracker } from '../components/trasferte/ColleaguesTracker';

import { useStore } from '../store/store';

const statCardsBase = [
    { label: "Trasferte Totali", icon: Plane, color: "var(--colore-primario-luce)", bg: "#3b82f620" },
    { label: "In Approvazione", icon: Clock, color: "var(--colore-avviso)", bg: "#f59e0b20" },
    { label: "Approvate", icon: CheckCircle, color: "var(--colore-successo)", bg: "#10b98120" },
];

export function Dashboard() {
    // 🧹 NOTA: Abbiamo rimosso cambiaStatoTrasferta, qui non si approva più nulla!
    const { trasferte, utenti, isLoading, error, fetchTrasferte, fetchUtenti, addTrasferta } = useStore();

    // 🔑 Leggiamo l'utente loggato per filtrare i dati
    const utenteCorrente = JSON.parse(localStorage.getItem('utente') || '{}');
    const isAdmin = utenteCorrente?.ruolo === 'admin';

    const [selectedTrasferta, setSelectedTrasferta] = useState(null);

    useEffect(() => {
        fetchTrasferte();
        fetchUtenti();
    }, [fetchTrasferte, fetchUtenti]);

    const handleFormSubmit = async (nuoviDati) => {
        try {
            await addTrasferta(nuoviDati);
        } catch (err) {
            alert("Errore durante il salvataggio della trasferta.");
        }
    };

    // 🛡️ Filtriamo le trasferte in base al ruolo: Admin vede tutto, Utente normale vede solo le sue
    const trasferteFiltrate = isAdmin
        ? trasferte
        : trasferte.filter(t => t.id_utente === utenteCorrente.id);

    const statsDinamiche = [
        { ...statCardsBase[0], value: trasferteFiltrate.length.toString() },
        { ...statCardsBase[1], value: trasferteFiltrate.filter(t => t.stato === 'in_attesa').length.toString() },
        { ...statCardsBase[2], value: trasferteFiltrate.filter(t => t.stato === 'approvata').length.toString() }
    ];

    if (isLoading) return <div className="p-8 text-center text-[var(--colore-testo-secondario)]">Caricamento dati dal server... ⏳</div>;
    if (error) return <div className="p-8 text-center text-[var(--colore-pericolo)]">❌ {error}</div>;

    return (
        <div className="dashboard-page flex-1 p-4 sm:p-6 lg:p-8 min-h-screen font-[var(--font-principale)] bg-[var(--colore-sfondo-pagina)]">

            {/* Header */}
            <div className="dashboard-header flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1e3a8a15]">
                    <Plane size={22} className="text-[var(--colore-primario)]" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--colore-testo-principale)]">Dashboard Operativa</h1>
                    <p className="text-sm text-[var(--colore-testo-mutato)]">Panoramica viaggi e statistiche in tempo reale</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {statsDinamiche.map((card, i) => (
                    <div key={i} className="p-4 sm:p-5 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] transition-all hover:shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase text-[var(--colore-testo-mutato)]">{card.label}</span>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                                <card.icon size={18} style={{ color: card.color }} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-[var(--colore-testo-principale)]">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Grid: Tabella (sinistra) + Form/Dettagli & Tracker (destra) */}
            <div className="dashboard-grid grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">

                {/* SINISTRA: TABELLA */}
                <div className="xl:col-span-2">
                    <TrasferteTable
                        trasferte={trasferteFiltrate}
                        onRowClick={(row) => setSelectedTrasferta(row)}
                        selectedId={selectedTrasferta?.id}
                    />
                </div>

                {/* DESTRA: DETTAGLI (se cliccato) OPPURE FORM (di default) + TRACKER */}
                <div className="xl:col-span-1 flex flex-col gap-6">

                    {selectedTrasferta ? (
                        <div className="p-6 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] shadow-md flex flex-col gap-5 animate-fade-in">

                            {/* Header Dettagli */}
                            <div className="flex justify-between items-start border-b pb-4" style={{ borderColor: "var(--colore-bordo)" }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1e3a8a10]">
                                        <Info size={18} className="text-[var(--colore-primario)]" />
                                    </div>
                                    <h2 className="text-lg font-bold text-[var(--colore-testo-principale)]">Dettagli Trasferta</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedTrasferta(null)}
                                    className="p-1 rounded-lg hover:bg-gray-100 text-[var(--colore-testo-mutato)] transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Info Principali */}
                            <div>
                                <h3 className="text-xl font-bold text-[var(--colore-testo-principale)] flex items-center gap-2">
                                    <MapPin size={20} className="text-[var(--colore-secondario)]" />
                                    {selectedTrasferta.destinazione}
                                </h3>
                                <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize border"
                                    style={
                                        selectedTrasferta.stato === 'approvata' ? { backgroundColor: "var(--colore-successo-sfondo)", color: "var(--colore-successo)", borderColor: "var(--colore-successo)" }
                                            : selectedTrasferta.stato === 'rifiutata' ? { backgroundColor: "var(--colore-pericolo-sfondo)", color: "var(--colore-pericolo)", borderColor: "var(--colore-pericolo)" }
                                                : { backgroundColor: "var(--colore-avviso-sfondo)", color: "var(--colore-avviso)", borderColor: "var(--colore-avviso)" }
                                    }
                                >
                                    Status: {selectedTrasferta.stato.replace('_', ' ')}
                                </div>
                            </div>

                            {/* Date */}
                            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col gap-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-blue-700 flex items-center gap-1">
                                    <Calendar size={14} /> Periodo
                                </span>
                                <div className="text-sm font-medium text-slate-700 flex justify-between">
                                    <span>Dal: <b>{selectedTrasferta.data_inizio?.substring(0, 10)}</b></span>
                                    <span>Al: <b>{selectedTrasferta.data_fine?.substring(0, 10)}</b></span>
                                </div>
                            </div>

                            {/* Motivo Completo */}
                            <div className="p-3.5 rounded-xl bg-gray-50 border border-[var(--colore-bordo)] flex flex-col gap-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-[var(--colore-testo-mutato)] flex items-center gap-1">
                                    <FileText size={14} /> Motivo completo
                                </span>
                                <p className="text-sm text-[var(--colore-testo-secondario)] leading-relaxed italic">
                                    "{selectedTrasferta.motivo}"
                                </p>
                            </div>

                            {/* Tasto di chiusura generico */}
                            <button onClick={() => setSelectedTrasferta(null)} className="mt-2 text-sm text-[var(--colore-primario)] font-semibold hover:underline text-center w-full">
                                Chiudi dettagli e torna a "Nuova Trasferta"
                            </button>
                        </div>
                    ) : (
                        // 🔥 IL FORM ORA LO VEDONO TUTTI! Passiamo i dati necessari per la tendina Admin
                        <TrasferteForm onAddTrasferta={handleFormSubmit} isAdmin={isAdmin} utenti={utenti} />
                    )}

                    <ColleaguesTracker trasferte={trasferte} utenti={utenti} />
                </div>
            </div>
        </div>
    );
}