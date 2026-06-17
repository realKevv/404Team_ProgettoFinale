import React, { useState } from 'react';
import { PlusCircle, Send } from 'lucide-react';

export function TrasferteForm({ onAddTrasferta }) {
    const [form, setForm] = useState({
        destinazione: '',
        data_inizio: '',
        data_fine: '',
        motivo: ''
    });

    // 🔥 1. AGGIUNTO: Genera la data di oggi nel formato perfetto (YYYY-MM-DD)
    const oggi = new Date().toLocaleDateString('sv-SE');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.destinazione || !form.data_inizio || !form.data_fine || !form.motivo) return;
        onAddTrasferta(form);
        setForm({ destinazione: '', data_inizio: '', data_fine: '', motivo: '' });
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--colore-testo-mutato)" }}>Destinazione</label>
                    <input type="text" name="destinazione" value={form.destinazione} onChange={handleChange}
                        placeholder="Es. Parigi, Roma..." className={inputStile} style={inputStyle} />
                </div>

                <div className="form-date-grid grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--colore-testo-mutato)" }}>Data Inizio</label>
                        {/* 🔥 2. AGGIUNTO: min={oggi} blocca le date passate nel calendario */}
                        <input type="date" name="data_inizio" value={form.data_inizio} min={oggi} onChange={handleChange} className={inputStile} style={inputStyle} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--colore-testo-mutato)" }}>Data Fine</label>
                        {/* 🔥 3. AGGIUNTO: min={form.data_inizio || oggi} blocca le date precedenti all'inizio */}
                        <input type="date" name="data_fine" value={form.data_fine} min={form.data_inizio || oggi} onChange={handleChange} className={inputStile} style={inputStyle} />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--colore-testo-mutato)" }}>Motivo trasferta</label>
                    <textarea name="motivo" value={form.motivo} onChange={handleChange} rows="3"
                        placeholder="Specificare il motivo..." className={`${inputStile} resize-none`} style={inputStyle} />
                </div>

                <button type="submit"
                    className="mt-2 p-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                        backgroundColor: "var(--colore-primario-luce)",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--colore-primario)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--colore-primario-luce)"}
                >
                    <Send size={16} />
                    Aggiungi Trasferta
                </button>
            </form>
        </div>
    );
}