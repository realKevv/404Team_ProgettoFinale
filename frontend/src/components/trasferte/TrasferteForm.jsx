import React, { useState } from 'react';
import { PlusCircle, Send, AlertCircle, Loader2 } from 'lucide-react';

export function TrasferteForm({ onAddTrasferta, isAdmin, utenti }) {
    const [form, setForm] = useState({
        destinazione: '',
        data_inizio: '',
        data_fine: '',
        motivo: '',
        id_utente: ''
    });

    // 🔥 STATI PER ERRORE SERVER E CARICAMENTO
    const [serverError, setServerError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const oggi = new Date().toLocaleDateString('sv-SE');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (serverError) setServerError(null); // Nascondi l'errore se l'utente ricomincia a digitare
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null); // Resetta eventuali errori precedenti

        // Controllo frontend rapido
        if (!form.destinazione || !form.data_inizio || !form.data_fine || !form.motivo) {
            setServerError("Compila tutti i campi richiesti.");
            return;
        }
        if (isAdmin && !form.id_utente) {
            setServerError("Seleziona il dipendente che andrà in trasferta.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onAddTrasferta(form); // Lancia l'azione al server

            // SE IL SERVER RISPONDE OK (201):
            // Svuota i campi
            setForm({ destinazione: '', data_inizio: '', data_fine: '', motivo: '', id_utente: '' });
        } catch (err) {
            // SE IL SERVER RIFIUTA (400, ecc):
            // Catturiamo il messaggio di errore lanciato dal nuovo store.js
            setServerError(err.message);
        } finally {
            setIsSubmitting(false); // Rilascia il bottone
        }
    };

    const inputStile = "w-full p-2.5 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2";
    const inputStyle = {
        borderColor: "var(--colore-bordo)",
        backgroundColor: "var(--colore-sfondo-pagina)",
        color: "var(--colore-testo-principale)",
    };

    return (
        <div className="p-6 rounded-2xl border bg-white flex flex-col gap-4 h-fit transition-all duration-300 hover:shadow-lg"
            style={{
                borderColor: "var(--colore-bordo)",
                backgroundColor: "var(--colore-sfondo-card)"
            }}
        >
            <div className="flex items-center gap-2 border-b pb-4" style={{ borderColor: "var(--colore-bordo)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#10b98120" }}>
                    <PlusCircle size={18} style={{ color: "var(--colore-successo)" }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: "var(--colore-testo-principale)" }}>Nuova Trasferta</h2>
            </div>

            {/* 🔥 SE C'È UN ERRORE, MOSTRA IL BANNER ROSSO */}
            {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 animate-fade-in">
                    <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-800 leading-tight">
                        {serverError}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">

                {isAdmin && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide text-[var(--colore-secondario)]">Dipendente in trasferta</label>
                        <select
                            name="id_utente"
                            value={form.id_utente}
                            onChange={handleChange}
                            className={inputStile}
                            style={inputStyle}
                        >
                            <option value="">-- Seleziona chi viaggia --</option>
                            {utenti?.map(u => (
                                <option key={u.id} value={u.id}>{u.nome_completo}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--colore-testo-mutato)" }}>Destinazione</label>
                    <input type="text" name="destinazione" value={form.destinazione} onChange={handleChange}
                        placeholder="Es. Parigi, Roma..." className={inputStile} style={inputStyle} />
                </div>

                <div className="form-date-grid grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--colore-testo-mutato)" }}>Data Inizio</label>
                        <input type="date" name="data_inizio" value={form.data_inizio} min={oggi} onChange={handleChange} className={inputStile} style={inputStyle} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--colore-testo-mutato)" }}>Data Fine</label>
                        <input type="date" name="data_fine" value={form.data_fine} min={form.data_inizio || oggi} onChange={handleChange} className={inputStile} style={inputStyle} />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--colore-testo-mutato)" }}>Motivo trasferta</label>
                    <textarea name="motivo" value={form.motivo} onChange={handleChange} rows="3"
                        placeholder="Specificare il motivo..." className={`${inputStile} resize-none`} style={inputStyle} />
                </div>

                <button type="submit"
                    disabled={isSubmitting}
                    className="mt-2 p-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    style={{ backgroundColor: "var(--colore-primario-luce)" }}
                    onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = "var(--colore-primario)" }}
                    onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = "var(--colore-primario-luce)" }}
                >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {isSubmitting ? 'Salvataggio...' : 'Aggiungi Trasferta'}
                </button>
            </form>
        </div>
    );
}