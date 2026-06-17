import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import {
    Receipt, PlusCircle, FileText, AlertTriangle,
    Check, Eye, X, ShieldAlert, CheckCircle2, XCircle, Trash2
} from 'lucide-react';
import { useStore } from '../store/store';

export function NoteSpesePage() {
    const {
        trasferte, spese, utenti,
        fetchTrasferte, fetchSpeseByTrasferta, fetchUtenti,
        addSpesa, valutaSpesa, deleteSpesa, isLoading
    } = useStore();

    // 🔑 Leggiamo chi è l'utente loggato
    const utenteCorrente = JSON.parse(localStorage.getItem('utente') || '{}');
    const isAdmin = utenteCorrente?.ruolo === 'admin';

    // Stati locali
    const [selectedTrasfertaId, setSelectedTrasfertaId] = useState('');
    const [selectedSpesa, setSelectedSpesa] = useState(null);
    const [categoria, setCategoria] = useState('vitto');
    const [importo, setImporto] = useState('');
    const [fileScontrino, setFileScontrino] = useState(null);
    const [messaggio, setMessaggio] = useState({ testo: '', tipo: '' });

    useEffect(() => {
        fetchTrasferte();
        if (isAdmin) fetchUtenti();
    }, [fetchTrasferte, fetchUtenti, isAdmin]);

    const handleTrasfertaChange = (id) => {
        setSelectedTrasfertaId(id);
        setSelectedSpesa(null);
        if (id) fetchSpeseByTrasferta(id);
    };

    // 📤 INVIO SCONTRINO (Vista Utente)
    const handleUploadSpesa = async (e) => {
        e.preventDefault();
        if (!selectedTrasfertaId || !importo || !fileScontrino) {
            setMessaggio({ testo: "Compila tutti i campi!", tipo: "error" });
            return;
        }

        const formData = new FormData();
        formData.append('id_trasferta', selectedTrasfertaId);
        formData.append('categoria', categoria);
        formData.append('importo', importo);
        formData.append('scontrino', fileScontrino);

        try {
            await addSpesa(formData);
            setMessaggio({ testo: "Scontrino caricato con successo!", tipo: "success" });
            setImporto('');
            setFileScontrino(null);
            fetchSpeseByTrasferta(selectedTrasfertaId);
        } catch (err) {
            setMessaggio({ testo: "Errore durante l'upload.", tipo: "error" });
        }
    };

    // 👑 VALUTAZIONE SPESA (Vista Admin)
    const handleValutaSpesa = async (idSpesa, stato, importoRimborso) => {
        try {
            await valutaSpesa(idSpesa, stato, importoRimborso);
            setMessaggio({ testo: `Spesa ${stato} con successo!`, tipo: "success" });
            setSelectedSpesa(null);
        } catch (err) {
            setMessaggio({ testo: "Errore durante la valutazione.", tipo: "error" });
        }
    };

    // Calcolo totale spese caricate per questa trasferta
    const totaleSpeso = spese ? spese.reduce((acc, s) => acc + parseFloat(s.importo), 0) : 0;

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen bg-[var(--colore-sfondo-pagina)] font-[var(--font-principale)]">

            {/* HEADER DINAMICO */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: isAdmin ? "#1e3a8a15" : "#0d948815" }}>
                    <Receipt size={22} className={isAdmin ? "text-[var(--colore-primario)]" : "text-[var(--colore-secondario)]"} />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--colore-testo-principale)]">
                        {isAdmin ? "Pannello Approvazione Spese" : "Giustificativi e Note Spese"}
                    </h1>
                    <p className="text-sm text-[var(--colore-testo-mutato)]">
                        {isAdmin ? "Verifica le ricevute caricate dal team e sblocca i rimborsi aziendali." : "Seleziona un tuo viaggio approvato e inserisci le ricevute fiscali."}
                    </p>
                </div>
            </div>

            {/* SELETTORE TRASFERTA */}
            <div className="mb-8 p-6 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] max-w-xl shadow-sm">
                <label className="block text-xs font-bold uppercase tracking-wide text-[var(--colore-testo-mutato)] mb-2">
                    {isAdmin ? "Filtra per Trasferta Aziendale" : "Seleziona la tua trasferta di riferimento"}
                </label>
                <select
                    value={selectedTrasfertaId}
                    onChange={(e) => handleTrasfertaChange(e.target.value)}
                    className="w-full p-3 border rounded-xl text-sm bg-[var(--colore-sfondo-pagina)] text-[var(--colore-testo-principale)] border-[var(--colore-bordo)] focus:outline-none"
                >
                    <option value="">-- Scegli un viaggio dalla lista --</option>
                    {trasferte.filter(t => t.stato === 'approvata').map(t => {
                        const dipendente = isAdmin && utenti ? utenti.find(u => u.id === t.id_utente) : null;
                        return (
                            <option key={t.id} value={t.id}>
                                {isAdmin ? `[${dipendente?.nome_completo || 'Utente'}] ` : ''}{t.destinazione} ({t.data_inizio.substring(0, 10)})
                            </option>
                        );
                    })}
                </select>
            </div>

            {selectedTrasfertaId ? (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">

                    {/* TABELLA DELLE SPESE (2 Colonne) */}
                    <div className="xl:col-span-2 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-[var(--colore-testo-principale)]">Ricevute presentate</h2>
                            <div className="text-sm font-bold p-2 px-4 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                                Totale Rendicontato: €{totaleSpeso.toFixed(2)}
                            </div>
                        </div>

                        <TableContainer component={Paper} className="rounded-2xl overflow-hidden border bg-[var(--colore-sfondo-card)]" elevation={0} style={{ borderColor: "var(--colore-bordo)", boxShadow: "none" }}>
                            <Table>
                                <TableHead>
                                    <TableRow style={{ backgroundColor: "var(--colore-sfondo-alt)" }}>
                                        {["Categoria", "Importo", "Stato", "Controllo Policy", isAdmin ? "Revisione" : "Allegato"].map((h, i) => (
                                            <TableCell key={i} style={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", color: "var(--colore-testo-mutato)", padding: "12px 16px" }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {spese && spese.map((spesa) => (
                                        <TableRow
                                            key={spesa.id}
                                            hover
                                            onClick={() => isAdmin && setSelectedSpesa(spesa)}
                                            className={isAdmin ? "cursor-pointer" : ""}
                                            sx={{
                                                '& td': { borderBottom: '1px solid var(--colore-bordo)' },
                                                backgroundColor: selectedSpesa?.id === spesa.id ? 'rgba(30, 58, 138, 0.04) !important' : 'inherit'
                                            }}
                                        >
                                            <TableCell style={{ fontWeight: 600, textTransform: 'capitalize', color: "var(--colore-testo-principale)" }}>{spesa.categoria}</TableCell>
                                            <TableCell style={{ fontWeight: 700, color: "var(--colore-testo-principale)" }}>€{parseFloat(spesa.importo).toFixed(2)}</TableCell>
                                            <TableCell>
                                                {spesa.stato_approvazione === 'approvata' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
                                                        <CheckCircle2 size={12} /> Approvata
                                                    </span>
                                                ) : spesa.stato_approvazione === 'respinta' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                                                        <XCircle size={12} /> Rifiutata
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                                                        <AlertTriangle size={12} /> In attesa
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {spesa.fuori_policy ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200"><ShieldAlert size={12} /> Fuori Policy</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-200"><Check size={12} /> Nei Limiti</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isAdmin ? (
                                                    <span className="text-xs text-[var(--colore-primario)] font-semibold flex items-center gap-1"><Eye size={14} /> Ispeziona</span>
                                                ) : (
                                                    <div className="flex items-center gap-4">
                                                        {spesa.url_scontrino ? (
                                                            <a
                                                                href={spesa.url_scontrino.startsWith('http') ? spesa.url_scontrino : `http://localhost:5000${spesa.url_scontrino}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-teal-600 font-semibold hover:text-teal-800 transition-colors"
                                                            >
                                                                Vedi File
                                                            </a>
                                                        ) : <span className="text-gray-400 text-xs">Nessun file</span>}

                                                        {/* 🔥 BOTTONE ELIMINA PER L'UTENTE */}
                                                        {spesa.stato_approvazione !== 'approvata' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (window.confirm('Vuoi davvero eliminare questo scontrino?')) {
                                                                        deleteSpesa(spesa.id);
                                                                    }
                                                                }}
                                                                className="text-xs text-red-500 font-semibold hover:text-red-700 flex items-center gap-1 transition-colors"
                                                            >
                                                                <Trash2 size={14} /> Elimina
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!spese || spese.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center p-8 text-[var(--colore-testo-mutato)] italic text-sm">
                                                Nessuno scontrino caricato per questa trasferta.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    {/* COLONNA DESTRA (Form per Utente / Split-Screen per Admin) */}
                    <div className="xl:col-span-1">

                        {isAdmin ? (
                            selectedSpesa ? (
                                <div className="p-6 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] shadow-md flex flex-col gap-4 animate-fade-in">
                                    <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--colore-bordo)" }}>
                                        <h3 className="font-bold text-md text-[var(--colore-testo-principale)]">Verifica Giustificativo</h3>
                                        <button onClick={() => setSelectedSpesa(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={16} /></button>
                                    </div>

                                    <div className="bg-gray-100 rounded-xl p-2 border border-gray-200 flex justify-center items-center h-48 overflow-hidden">
                                        {selectedSpesa.url_scontrino ? (
                                            <img src={selectedSpesa.url_scontrino.startsWith('http') ? selectedSpesa.url_scontrino : `http://localhost:5000${selectedSpesa.url_scontrino}`} alt="Scontrino" className="max-h-full object-contain rounded-lg" />
                                        ) : (
                                            <span className="text-sm text-gray-500 italic">Nessuna foto caricata</span>
                                        )}
                                    </div>

                                    <div className="text-sm">
                                        <p className="text-gray-500">Importo Richiesto: <b className="text-slate-800">€{selectedSpesa.importo}</b></p>
                                        <p className="text-gray-500 capitalize">Categoria: <b className="text-slate-800">{selectedSpesa.categoria}</b></p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button
                                            onClick={() => handleValutaSpesa(selectedSpesa.id, 'approvata', selectedSpesa.importo)}
                                            className="p-3 rounded-xl font-semibold text-xs text-white bg-green-600 hover:bg-green-700 flex items-center justify-center gap-1 shadow-sm"
                                        >
                                            <CheckCircle2 size={14} /> Approva
                                        </button>
                                        <button
                                            onClick={() => handleValutaSpesa(selectedSpesa.id, 'respinta', 0)}
                                            className="p-3 rounded-xl font-semibold text-xs text-white bg-red-600 hover:bg-red-700 flex items-center justify-center gap-1 shadow-sm"
                                        >
                                            <XCircle size={14} /> Rifiuta
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 text-center border border-dashed border-[var(--colore-bordo)] rounded-2xl text-[var(--colore-testo-mutato)] text-sm bg-[var(--colore-sfondo-card)]">
                                    Seleziona una riga della tabella a sinistra per ispezionare la foto dello scontrino e decretare il rimborso.
                                </div>
                            )
                        ) : (
                            <div className="p-6 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] shadow-sm">
                                <div className="flex items-center gap-2 border-b pb-4 mb-4" style={{ borderColor: "var(--colore-bordo)" }}>
                                    <PlusCircle size={18} className="text-[var(--colore-secondario)]" />
                                    <h2 className="text-lg font-bold text-[var(--colore-testo-principale)]">Aggiungi Spesa</h2>
                                </div>

                                {messaggio.testo && (
                                    <div className={`p-3 mb-4 rounded-xl text-xs font-semibold text-center border ${messaggio.tipo === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                                        {messaggio.testo}
                                    </div>
                                )}

                                <form onSubmit={handleUploadSpesa} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold uppercase text-[var(--colore-testo-mutato)]">Tipo di Spesa</label>
                                        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm bg-[var(--colore-sfondo-pagina)] border-[var(--colore-bordo)] text-[var(--colore-testo-principale)] focus:outline-none">
                                            <option value="vitto">🍽️ Vitto (Pranzi/Cene)</option>
                                            <option value="alloggio">🏨 Alloggio (Hotel)</option>
                                            <option value="trasporto">✈️ Trasporto (Treni/Voli)</option>
                                            <option value="altro">📦 Altro / Varie</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold uppercase text-[var(--colore-testo-mutato)]">Importo (€)</label>
                                        <input type="number" step="0.01" value={importo} onChange={(e) => setImporto(e.target.value)} placeholder="0.00" className="w-full p-2.5 border rounded-xl text-sm bg-[var(--colore-sfondo-pagina)] border-[var(--colore-bordo)] text-[var(--colore-testo-principale)] focus:outline-none" />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold uppercase text-[var(--colore-testo-mutato)]">Carica Scontrino</label>
                                        <input type="file" accept="image/*,application/pdf" onChange={(e) => setFileScontrino(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 cursor-pointer" />
                                    </div>

                                    <button type="submit" disabled={isLoading} className="mt-2 p-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all bg-teal-600 hover:bg-teal-700 shadow-sm disabled:opacity-50">
                                        <FileText size={16} /> {isLoading ? 'Caricamento...' : 'Carica nel Sistema'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="p-8 text-center border-2 border-dashed border-[var(--colore-bordo)] rounded-2xl text-[var(--colore-testo-mutato)] bg-[var(--colore-sfondo-card)]">
                    Seleziona una trasferta in alto per sbloccare i dati delle note spese.
                </div>
            )}
        </div>
    );
}
