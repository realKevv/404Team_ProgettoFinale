import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import {
    Receipt, PlusCircle, FileText, AlertTriangle,
    Check, Eye, X, ShieldAlert, CheckCircle2, XCircle, Trash2, AlertCircle
} from 'lucide-react';
import { useStore } from '../store/store';
import { usePaginazione } from '../hooks/usePaginazione';
import { ControlliPaginazione } from '../components/ControlliPaginazione';

export function NoteSpesePage() {
    const {
        trasferte, spese, utenti, policies,
        fetchTrasferte, fetchSpeseByTrasferta, fetchUtenti, fetchPolicies,
        addSpesa, valutaSpesa, deleteSpesa, isLoading
    } = useStore();

    // 🔑 Leggiamo chi è l'utente loggato
    const utenteCorrente = JSON.parse(sessionStorage.getItem('utente') || '{}');
    const isAdmin = utenteCorrente?.ruolo === 'admin';

    // Stati locali
    const [selectedTrasfertaId, setSelectedTrasfertaId] = useState('');
    const [selectedSpesa, setSelectedSpesa] = useState(null);
    const [serverError, setServerError] = useState(null);
    const [categoria, setCategoria] = useState('vitto');
    const [importo, setImporto] = useState('');
    const [fileScontrino, setFileScontrino] = useState(null);
    const [messaggio, setMessaggio] = useState({ testo: '', tipo: '' });

    // Filtri tabella spese
    const [filtroCategoria, setFiltroCategoria] = useState('tutti');
    const [filtroStatoSpesa, setFiltroStatoSpesa] = useState('tutti');
    // Modalità admin: 'approva' o 'carica'
    const [adminMode, setAdminMode] = useState('approva');

    useEffect(() => {
        fetchTrasferte();
        fetchPolicies();
        if (isAdmin) fetchUtenti();
    }, [fetchTrasferte, fetchUtenti, fetchPolicies, isAdmin]);

    const handleTrasfertaChange = (id) => {
        setSelectedTrasfertaId(id);
        setSelectedSpesa(null);
        if (id) fetchSpeseByTrasferta(id);
    };

    // 📤 INVIO SCONTRINO (Vista Utente)
    const handleUploadSpesa = async (e) => {
        e.preventDefault();
        setServerError(null);
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
            // 🔥 ORA MOSTRA IL MOTIVO REALE
            setServerError(err.message);
        }
    };

    // 👑 VALUTAZIONE SPESA (Vista Admin)
    const handleValutaSpesa = async (idSpesa, stato, importoRimborso) => {
        setServerError(null);
        try {
            await valutaSpesa(idSpesa, stato, importoRimborso);
            setMessaggio({ testo: `Spesa ${stato} con successo!`, tipo: "success" });
            setSelectedSpesa(null);
        } catch (err) {
            // 🔥 ORA MOSTRA IL MOTIVO REALE
            setServerError(err.message);
        }
    };

    const handleDeleteSpesa = async (e, id) => {
        e.stopPropagation();
        setServerError(null);
        if (window.confirm("Vuoi davvero eliminare questo scontrino?")) {
            try {
                await deleteSpesa(id);
            } catch (err) {
                setServerError(err.message);
            }
        }
    };

    // Calcolo totale spese caricate per questa trasferta
    const totaleSpeso = spese ? spese.reduce((acc, s) => acc + parseFloat(s.importo), 0) : 0;

    // Filtraggio spese
    const speseFiltrate = (spese || []).filter(s => {
        const matchCat = filtroCategoria === 'tutti' || s.categoria === filtroCategoria;
        const matchStato = filtroStatoSpesa === 'tutti' || s.stato_approvazione === filtroStatoSpesa;
        return matchCat && matchStato;
    });

    // Paginazione spese
    const { paginaCorrente: pagSpese, totalePagine: totPagSpese, elementiPagina: speseInPagina, vaiAPagina: vaiASpesa } = usePaginazione(speseFiltrate, 10);

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
                <>
                    {serverError && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm font-medium text-red-800 animate-fade-in">
                            <AlertCircle size={18} className="text-red-600 shrink-0" />
                            <span>{serverError}</span>
                            <button onClick={() => setServerError(null)} className="ml-auto text-red-400 hover:text-red-700">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">

                        {/* TABELLA DELLE SPESE (2 Colonne) */}
                        <div className="xl:col-span-2 min-w-0 w-full flex flex-col gap-4">
                            <div className="flex justify-between items-center flex-wrap gap-3">
                                <h2 className="text-lg font-bold text-[var(--colore-testo-principale)]">Ricevute presentate</h2>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <div className="text-sm font-bold p-2 px-4 rounded-xl badge-success">
                                        Totale: €{totaleSpeso.toFixed(2)}
                                    </div>
                                    {/* Filtro categoria */}
                                    <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}
                                        className="px-3 py-2 rounded-xl border text-xs outline-none"
                                        style={{ borderColor: 'var(--colore-bordo)', background: 'var(--colore-sfondo-alt)', color: 'var(--colore-testo-principale)' }}>
                                        <option value="tutti">Tutte le categorie</option>
                                        <option value="vitto">Vitto</option>
                                        <option value="alloggio">Alloggio</option>
                                        <option value="trasporto">Trasporto</option>
                                        <option value="altro">Altro</option>
                                    </select>
                                    {/* Filtro stato */}
                                    <select value={filtroStatoSpesa} onChange={e => setFiltroStatoSpesa(e.target.value)}
                                        className="px-3 py-2 rounded-xl border text-xs outline-none"
                                        style={{ borderColor: 'var(--colore-bordo)', background: 'var(--colore-sfondo-alt)', color: 'var(--colore-testo-principale)' }}>
                                        <option value="tutti">Tutti gli stati</option>
                                        <option value="in_attesa">In attesa</option>
                                        <option value="approvata">Approvata</option>
                                        <option value="respinta">Respinta</option>
                                    </select>
                                    {(filtroCategoria !== 'tutti' || filtroStatoSpesa !== 'tutti') && (
                                        <button onClick={() => { setFiltroCategoria('tutti'); setFiltroStatoSpesa('tutti'); }}
                                            className="flex items-center gap-1 px-2 py-1.5 rounded-xl border text-xs font-medium"
                                            style={{ borderColor: 'var(--colore-bordo)', color: 'var(--colore-pericolo)', background: 'var(--colore-pericolo-sfondo)' }}>
                                            <X size={12} /> Reset
                                        </button>
                                    )}
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
                                        {speseInPagina.map((spesa) => (
                                            <TableRow
                                                key={spesa.id}
                                                hover
                                                onClick={() => isAdmin && setSelectedSpesa(spesa)}
                                                className={isAdmin ? "cursor-pointer" : ""}
                                                sx={{
                                                    '& td': { borderBottom: '1px solid var(--colore-bordo)' },
                                                    backgroundColor: selectedSpesa?.id === spesa.id ? 'color-mix(in srgb, var(--colore-primario) 15%, transparent) !important' : 'inherit'
                                                }}
                                            >
                                                <TableCell style={{ fontWeight: 600, textTransform: 'capitalize', color: "var(--colore-testo-principale)" }}>{spesa.categoria}</TableCell>
                                                <TableCell style={{ fontWeight: 700, color: "var(--colore-testo-principale)" }}>€{parseFloat(spesa.importo).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    {spesa.stato_approvazione === 'approvata' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold badge-success">
                                                            <CheckCircle2 size={12} /> Approvata
                                                        </span>
                                                    ) : spesa.stato_approvazione === 'respinta' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold badge-danger">
                                                            <XCircle size={12} /> Rifiutata
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold badge-warning">
                                                            <AlertTriangle size={12} /> In attesa
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {spesa.fuori_policy ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold badge-danger"><ShieldAlert size={12} /> Fuori Policy</span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold badge-success"><Check size={12} /> Nei Limiti</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {isAdmin ? (
                                                        <span className="text-xs text-[var(--colore-primario)] font-semibold flex items-center gap-1"><Eye size={14} /> Ispeziona</span>
                                                    ) : (
                                                        <div className="flex items-center gap-4">
                                                            {spesa.url_scontrino ? (
                                                                <a href={spesa.url_scontrino.startsWith('http') ? spesa.url_scontrino : `http://localhost:5000${spesa.url_scontrino}`}
                                                                    target="_blank" rel="noopener noreferrer"
                                                                    className="text-xs text-teal-600 font-semibold hover:text-teal-800 transition-colors">
                                                                    Vedi File
                                                                </a>
                                                            ) : <span className="text-gray-400 text-xs">Nessun file</span>}
                                                            {spesa.stato_approvazione !== 'approvata' && (
                                                                <button
                                                                    onClick={(e) => handleDeleteSpesa(e, spesa.id)}
                                                                    className="text-xs text-red-500 font-semibold hover:text-red-700 flex items-center gap-1 transition-colors">
                                                                    <Trash2 size={14} /> Elimina
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {speseFiltrate.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center p-8 text-[var(--colore-testo-mutato)] italic text-sm">
                                                    {(!spese || spese.length === 0) ? 'Nessuno scontrino caricato per questa trasferta.' : 'Nessun risultato per i filtri selezionati.'}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <ControlliPaginazione
                                paginaCorrente={pagSpese}
                                totalePagine={totPagSpese}
                                vaiAPagina={vaiASpesa}
                                totaleElementi={speseFiltrate.length}
                                righePerPagina={10}
                            />
                        </div>

                        {/* COLONNA DESTRA */}
                        <div className="xl:col-span-1">

                            {/* Toggle admin: switch tra Approva e Carica */}
                            {isAdmin && (
                                <div className="flex mb-4 rounded-xl overflow-hidden border border-[var(--colore-bordo)] text-xs font-semibold">
                                    <button
                                        onClick={() => { setAdminMode('approva'); setSelectedSpesa(null); }}
                                        className={`flex-1 py-2 transition-all ${adminMode === 'approva'
                                                ? 'bg-[var(--colore-primario)] text-white'
                                                : 'bg-[var(--colore-sfondo-card)] text-[var(--colore-testo-mutato)] hover:bg-[var(--colore-sfondo-alt)]'
                                            }`}
                                    >
                                        👑 Ispeziona Spese
                                    </button>
                                    <button
                                        onClick={() => setAdminMode('carica')}
                                        className={`flex-1 py-2 transition-all ${adminMode === 'carica'
                                                ? 'bg-[var(--colore-secondario)] text-white'
                                                : 'bg-[var(--colore-sfondo-card)] text-[var(--colore-testo-mutato)] hover:bg-[var(--colore-sfondo-alt)]'
                                            }`}
                                    >
                                        📤 Carica Spesa
                                    </button>
                                </div>
                            )}

                            {isAdmin && adminMode === 'approva' ? (
                                selectedSpesa ? (
                                    <div className="p-6 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] shadow-md flex flex-col gap-4 animate-fade-in">
                                        <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--colore-bordo)" }}>
                                            <h3 className="font-bold text-md text-[var(--colore-testo-principale)]">Verifica Giustificativo</h3>
                                            <button onClick={() => setSelectedSpesa(null)} className="p-1 rounded-lg hover-tema text-[var(--colore-testo-mutato)] transition-colors"><X size={16} /></button>
                                        </div>

                                        <div className="bg-[var(--colore-sfondo-alt)] rounded-xl p-2 border border-[var(--colore-bordo)] flex justify-center items-center h-48 overflow-hidden">
                                            {selectedSpesa.url_scontrino ? (
                                                <img src={selectedSpesa.url_scontrino.startsWith('http') ? selectedSpesa.url_scontrino : `http://localhost:5000${selectedSpesa.url_scontrino}`} alt="Scontrino" className="max-h-full object-contain rounded-lg" />
                                            ) : (
                                                <span className="text-sm text-[var(--colore-testo-mutato)] italic">Nessuna foto caricata</span>
                                            )}
                                        </div>

                                        <div className="text-sm flex flex-col gap-1">
                                            <p className="text-[var(--colore-testo-secondario)]">Importo Richiesto: <b className="text-[var(--colore-testo-principale)]">€{selectedSpesa.importo}</b></p>
                                            <p className="text-[var(--colore-testo-secondario)] capitalize">Categoria: <b className="text-[var(--colore-testo-principale)]">{selectedSpesa.categoria}</b></p>
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
                                        <button
                                            onClick={(e) => {
                                                handleDeleteSpesa(e, selectedSpesa.id);
                                                setSelectedSpesa(null);
                                            }}
                                            className="w-full mt-1 p-2.5 rounded-xl font-semibold text-xs border border-[var(--colore-pericolo)] text-[var(--colore-pericolo)] hover:bg-[var(--colore-pericolo-sfondo)] flex items-center justify-center gap-1.5 transition-all"
                                        >
                                            <Trash2 size={13} /> Elimina Ricevuta
                                        </button>
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
                                        <div className={`p-3 mb-4 rounded-xl text-xs font-semibold text-center ${messaggio.tipo === 'error' ? 'badge-danger' : 'badge-success'}`}>
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
                                            {importo && policies && policies[categoria] && parseFloat(importo) > parseFloat(policies[categoria]) && (
                                                <span className="text-xs font-semibold text-red-500 flex items-center gap-1 mt-1">
                                                    <AlertTriangle size={14} /> Ehi, il limite per questa categoria è {policies[categoria]}€, stai per sforare!
                                                </span>
                                            )}
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
                </>
            ) : (
                <div className="p-8 text-center border-2 border-dashed border-[var(--colore-bordo)] rounded-2xl text-[var(--colore-testo-mutato)] bg-[var(--colore-sfondo-card)]">
                    Seleziona una trasferta in alto per sbloccare i dati delle note spese.
                </div>
            )}
        </div>
    );
}
