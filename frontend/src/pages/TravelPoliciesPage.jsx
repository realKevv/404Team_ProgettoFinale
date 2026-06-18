import React, { useState, useEffect } from 'react';
import { ShieldAlert, Euro, Clock, Save, CheckCircle, Loader2 } from 'lucide-react';
import { useStore } from '../store/store';

export function TravelPoliciesPage() {
    const { policies, fetchPolicies, updatePolicy, isLoading } = useStore();
    const [tempPolicies, setTempPolicies] = useState({});
    const [salvataggioInCorso, setSalvataggioInCorso] = useState(false);
    const [salvato, setSalvato] = useState(false);

    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]);

    useEffect(() => {
        if (policies) setTempPolicies(policies);
    }, [policies]);

    const handleSave = async () => {
        setSalvataggioInCorso(true);
        try {
            // Aggiorniamo ogni singola policy nel DB
            for (const [cat, val] of Object.entries(tempPolicies)) {
                await updatePolicy(cat, val);
            }
            setSalvato(true);
            setTimeout(() => setSalvato(false), 3000);
        } catch (err) {
            alert("Errore durante il salvataggio");
        } finally {
            setSalvataggioInCorso(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-[var(--colore-testo-principale)]">🛡️ Configurazione Policies</h1>

            <div className="grid grid-cols-1 gap-6">
                {Object.keys(tempPolicies).map((categoria) => (
                    <div key={categoria} className="p-4 rounded-xl border border-[var(--colore-bordo)] bg-[var(--colore-sfondo-card)] flex justify-between items-center">
                        <span className="capitalize font-semibold">{categoria}</span>
                        <div className="flex items-center gap-2">
                            <Euro size={16} />
                            <input
                                type="number"
                                value={tempPolicies[categoria]}
                                onChange={(e) => setTempPolicies({ ...tempPolicies, [categoria]: e.target.value })}
                                className="w-24 p-2 rounded-lg border border-[var(--colore-bordo)]"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSave}
                disabled={salvataggioInCorso}
                className="mt-6 w-full py-3 bg-[var(--colore-primario)] text-white rounded-xl font-bold hover:opacity-90 transition-all flex justify-center gap-2"
            >
                {salvataggioInCorso ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {salvato ? "Salvato!" : "Salva Configurazione"}
            </button>
        </div>
    );
}