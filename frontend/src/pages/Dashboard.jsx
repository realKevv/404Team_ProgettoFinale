import React, { useEffect } from 'react';
import { Plane, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { TrasferteTable } from '../components/trasferte/TrasferteTable';
import { TrasferteForm } from '../components/trasferte/TrasferteForm';

// 🔥 IMPORTIAMO IL NOSTRO ZUSTAND STORE
import { useStore } from '../store/store';

const statCardsBase = [
    { label: "Trasferte Totali", icon: Plane, color: "var(--colore-primario-luce)", bg: "#3b82f620" },
    { label: "In Approvazione", icon: Clock, color: "var(--colore-avviso)", bg: "#f59e0b20" },
    { label: "Approvate", icon: CheckCircle, color: "var(--colore-successo)", bg: "#10b98120" },
    { label: "Spese Totali", icon: TrendingUp, color: "var(--colore-secondario)", bg: "#0d948820" },
];

export function Dashboard() {
    const { trasferte, isLoading, error, fetchTrasferte, addTrasferta } = useStore();

    useEffect(() => {
        fetchTrasferte();
    }, [fetchTrasferte]);

    const handleFormSubmit = async (nuoviDati) => {
        try {
            // Chiamiamo la funzione di Zustand. Fa tutto lei (API + aggiornamento stato)!
            await addTrasferta(nuoviDati);
        } catch (err) {
            alert("Errore durante il salvataggio della trasferta.");
        }
    };

    // 4️⃣ CALCOLIAMO LE STATISTICHE IN TEMPO REALE
    const statsDinamiche = [
        { ...statCardsBase[0], value: trasferte.length.toString() },
        { ...statCardsBase[1], value: trasferte.filter(t => t.stato === 'in_attesa').length.toString() },
        { ...statCardsBase[2], value: trasferte.filter(t => t.stato === 'approvata').length.toString() },
        { ...statCardsBase[3], value: "€..." }
    ];

    // Se sta caricando o c'è un errore, mostriamo un feedback all'utente
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--colore-testo-principale)]">
                        Dashboard Trasferte
                    </h1>
                    <p className="text-sm text-[var(--colore-testo-mutato)]">
                        Dati reali sincronizzati in tempo reale con Zustand e MySQL
                    </p>
                </div>
            </div>

            {/* Stat Cards Dinamiche */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
                {statsDinamiche.map((card, i) => (
                    <div key={i} className="p-4 sm:p-5 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] transition-all hover:shadow-lg hover:-translate-y-0.5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--colore-testo-mutato)]">
                                {card.label}
                            </span>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                                <card.icon size={18} style={{ color: card.color }} />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-[var(--colore-testo-principale)]">
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Grid: Tabella (sinistra) + Form (destra) */}
            <div className="dashboard-grid grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 animate-fade-in-up stagger-1">
                <div className="xl:col-span-2">
                    <TrasferteTable trasferte={trasferte} />
                </div>
                <div className="xl:col-span-1">
                    <TrasferteForm onAddTrasferta={handleFormSubmit} />
                </div>
            </div>
        </div>
    );
}