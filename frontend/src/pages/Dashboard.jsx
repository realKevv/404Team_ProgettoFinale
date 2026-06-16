import React, { useState } from 'react';
import { Plane, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { TrasferteTable } from '../components/trasferte/TrasferteTable';
import { TrasferteForm } from '../components/trasferte/TrasferteForm';

const trasferteIniziali = [
    { id: 1, destinazione: 'Milano', dataInizio: '2026-06-20', dataFine: '2026-06-23', motivo: 'Meeting Clienti', rimborso: 'Piè di lista', stato: 'In approvazione' },
    { id: 2, destinazione: 'Roma', dataInizio: '2026-07-02', dataFine: '2026-07-05', motivo: 'Corso Aggiornamento', rimborso: 'Indennità fissa', stato: 'Approvata' },
];

const statCards = [
    { label: "Trasferte Totali", value: "12", icon: Plane, color: "var(--colore-primario-luce)", bg: "#3b82f620" },
    { label: "In Approvazione", value: "3", icon: Clock, color: "var(--colore-avviso)", bg: "#f59e0b20" },
    { label: "Approvate", value: "8", icon: CheckCircle, color: "var(--colore-successo)", bg: "#10b98120" },
    { label: "Spese Totali", value: "€2.450", icon: TrendingUp, color: "var(--colore-secondario)", bg: "#0d948820" },
];

export function Dashboard() {
    const [trasferte, setTrasferte] = useState(trasferteIniziali);

    const handleAddTrasferta = (nuoviDati) => {
        const nuovaTrasferta = {
            id: trasferte.length + 1,
            ...nuoviDati,
            stato: 'In approvazione'
        };
        setTrasferte([...trasferte, nuovaTrasferta]);
    };

    return (
        <div className="dashboard-page flex-1 p-4 sm:p-6 lg:p-8 min-h-screen font-[var(--font-principale)]"
            style={{ backgroundColor: "var(--colore-sfondo-pagina)" }}
        >
            {/* Header */}
            <div className="dashboard-header flex items-center gap-3 mb-8 animate-fade-in">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#1e3a8a15" }}>
                    <Plane size={22} style={{ color: "var(--colore-primario)" }} />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--colore-testo-principale)" }}>
                        Dashboard Trasferte
                    </h1>
                    <p className="text-sm" style={{ color: "var(--colore-testo-mutato)" }}>
                        Panoramica delle tue trasferte aziendali
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up stagger-1">
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        className="p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        style={{
                            backgroundColor: "var(--colore-sfondo-card)",
                            borderColor: "var(--colore-bordo)"
                        }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--colore-testo-mutato)" }}>
                                {card.label}
                            </span>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                                <card.icon size={18} style={{ color: card.color }} />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--colore-testo-principale)" }}>
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Grid: Table + Form */}
            <div className="dashboard-grid grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 animate-fade-in-up stagger-2">
                <div className="xl:col-span-2">
                    <TrasferteTable trasferte={trasferte} />
                </div>
                <div className="xl:col-span-1">
                    <TrasferteForm onAddTrasferta={handleAddTrasferta} />
                </div>
            </div>
        </div>
    );
}