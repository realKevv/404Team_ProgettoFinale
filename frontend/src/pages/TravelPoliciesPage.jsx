import React, { useState, useEffect } from 'react';
import { Euro, Save, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '../store/store';

export function TravelPoliciesPage() {
    // 1. ESTRAZIONE DELLO STATO GLOBALE
    // Prendiamo i dati e le funzioni dal nostro nuovo store.js "intelligente"
    const { policies, fetchPolicies, updatePolicy, isLoading } = useStore();

    // 2. STATI LOCALI DEL COMPONENTE
    // tempPolicies: salva le modifiche in memoria finché non premiamo "Salva"
    const [tempPolicies, setTempPolicies] = useState({});

    // Gestiscono l'interfaccia utente durante il salvataggio
    const [salvataggioInCorso, setSalvataggioInCorso] = useState(false);
    const [salvato, setSalvato] = useState(false);

    // STATO FONDAMENTALE PER GLI ERRORI: Cattura il messaggio esatto inviato dal backend
    const [serverError, setServerError] = useState(null);

    // 3. CARICAMENTO DATI INIZIALE
    // Scarica le policy dal database appena si apre la pagina
    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]);

    // Quando le policy arrivano dal server, le copiamo nello stato temporaneo per poterle modificare
    useEffect(() => {
        if (policies) setTempPolicies(policies);
    }, [policies]);

    // Funzione asincrona che si occupa di ciclare e salvare le modifiche effettuate dall'utente
    const handleSave = async () => {
        setSalvataggioInCorso(true);
        setServerError(null); // Resetta eventuali errori rossi di un tentativo precedente

        try {
            // Cicla attraverso tutte le categorie modificate (vitto, alloggio, ecc.)
            for (const [cat, val] of Object.entries(tempPolicies)) {
                // Invia l'aggiornamento al server per ogni categoria
                await updatePolicy(cat, val);
            }

            // SE ARRIVA QUI: TUTTO È ANDATO A BUON FINE (Niente alert fastidiosi)
            setSalvato(true);
            // Dopo 3 secondi, fa tornare il bottone da "Salvato!" a "Salva Configurazione"
            setTimeout(() => setSalvato(false), 3000);

        } catch (err) {
            // SE IL SERVER RIFIUTA L'AGGIORNAMENTO:
            // Intercetta l'errore reale ("err.message") dallo store.js e lo salva nello stato
            setServerError(err.message);
        } finally {
            // In ogni caso, ferma la rotellina di caricamento
            setSalvataggioInCorso(false);
        }
    };

    // 4. SCHERMATA DI CARICAMENTO GLOBALE
    // Mostra la rotellina se sta ancora scaricando i dati all'avvio
    if (isLoading && Object.keys(tempPolicies).length === 0) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" /></div>;
    }

    // 5. INTERFACCIA GRAFICA (JSX)
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-[var(--colore-testo-principale)]">🛡️ Configurazione Policies</h1>

            {/* BANNER ERRORE (Appare SOLO se il salvataggio fallisce) */}
            {serverError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 animate-fade-in">
                    <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-800 leading-tight">
                        {serverError}
                    </p>
                </div>
            )}

            {/* LISTA DEI MASSIMALI DI SPESA */}
            <div className="grid grid-cols-1 gap-6">
                {Object.keys(tempPolicies).map((categoria) => (
                    <div key={categoria} className="p-4 rounded-xl border border-[var(--colore-bordo)] bg-[var(--colore-sfondo-card)] flex justify-between items-center">
                        <span className="capitalize font-semibold text-[var(--colore-testo-principale)]">{categoria}</span>
                        <div className="flex items-center gap-2">
                            <Euro size={16} className="text-[var(--colore-testo-mutato)]" />
                            <input
                                type="number"
                                value={tempPolicies[categoria]}
                                onChange={(e) => {
                                    // Aggiorna solo la categoria modificata
                                    setTempPolicies({ ...tempPolicies, [categoria]: e.target.value });
                                    // Se l'utente corregge il numero, nascondi l'avviso di errore
                                    if (serverError) setServerError(null);
                                }}
                                className="w-24 p-2 rounded-lg border text-[var(--colore-testo-principale)] bg-[var(--colore-sfondo-pagina)] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                style={{ borderColor: "var(--colore-bordo)" }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* BOTTONE DI SALVATAGGIO GLOBALE */}
            <button
                onClick={handleSave}
                disabled={salvataggioInCorso}
                className="mt-6 w-full py-3 bg-[var(--colore-primario)] text-white rounded-xl font-bold hover:opacity-90 transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {/* Cambia icona e testo in base allo stato del salvataggio */}
                {salvataggioInCorso ? <Loader2 className="animate-spin" /> : (salvato ? <CheckCircle size={20} /> : <Save size={20} />)}
                {salvataggioInCorso ? "Salvataggio..." : (salvato ? "Salvato!" : "Salva Configurazione")}
            </button>
        </div>
    );
}