import React, { useEffect, useState, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import {
    Plane, Search, X, Filter, CheckCircle, XCircle, Clock,
    MapPin, Calendar, ChevronUp, ChevronDown, SlidersHorizontal, Trash2, AlertCircle // 🔥 Aggiunto AlertCircle
} from 'lucide-react';
import { useStore } from '../store/store';
import { usePaginazione } from '../hooks/usePaginazione';
import { ControlliPaginazione } from '../components/ControlliPaginazione';

// ─── Badge Stato ──────────────────────────────────────────────────────────────
function BadgeStato({ stato }) {
    const config = {
        approvata: { label: 'Approvata', bg: 'var(--colore-successo-sfondo)', color: 'var(--colore-successo)', border: 'var(--colore-successo)', Icon: CheckCircle },
        rifiutata: { label: 'Rifiutata', bg: 'var(--colore-pericolo-sfondo)', color: 'var(--colore-pericolo)', border: 'var(--colore-pericolo)', Icon: XCircle },
        in_attesa: { label: 'In attesa', bg: 'var(--colore-avviso-sfondo)', color: 'var(--colore-avviso)', border: 'var(--colore-avviso)', Icon: Clock },
    };
    const c = config[stato] ?? config.in_attesa;
    return (
        <span style={{ backgroundColor: c.bg, color: c.color, borderColor: c.border }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize">
            <c.Icon size={12} />{c.label}
        </span>
    );
}

// ─── Icona per ordinamento colonne ──────────────────────────────────────────
function SortIcon({ col, sortBy, sortDir }) {
    if (sortBy !== col) return <span className="opacity-20 ml-1"><ChevronUp size={12} /></span>;
    return sortDir === 'asc'
        ? <ChevronUp size={12} className="ml-1 inline" style={{ color: 'var(--colore-primario)' }} />
        : <ChevronDown size={12} className="ml-1 inline" style={{ color: 'var(--colore-primario)' }} />;
}

export function MieiViaggiPage() {
    const { trasferte, isLoading, error, fetchTrasferte, deleteTrasferta } = useStore();
    const utenteCorrente = JSON.parse(sessionStorage.getItem('utente') || '{}');

    // ─── Filtri ─────────────────────────────────────────────────────────────
    const [search, setSearch] = useState('');
    const [filtroStato, setFiltroStato] = useState('tutti');
    const [showFiltri, setShowFiltri] = useState(false);

    // 🔥 STATO PER L'ERRORE DI ELIMINAZIONE
    const [errorDelete, setErrorDelete] = useState(null);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        setErrorDelete(null);
        if (window.confirm("Sei sicuro di voler eliminare questa trasferta?")) {
            try {
                await deleteTrasferta(id);
            } catch (err) {
                // Catturiamo l'errore reale
                setErrorDelete(err.message);
            }
        }
    };

    // ─── Ordinamento ────────────────────────────────────────────────────────
    const [sortBy, setSortBy] = useState('data_inizio');   // colonna di default
    const [sortDir, setSortDir] = useState('desc');         // più recenti prima

    useEffect(() => {
        fetchTrasferte();
    }, [fetchTrasferte]);

    // ─── Ordina colonna: toggle asc/desc se stesso campo, else asc ──────────
    const handleSort = (col) => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(col); setSortDir('asc'); }
    };

    // ─── Pipeline: filtra per utente → filtra → ordina ──────────────────────────
    const leMieTrasferte = useMemo(() => trasferte.filter(t => t.id_utente === utenteCorrente.id), [trasferte, utenteCorrente.id]);

    const viaggiFiltrati = useMemo(() => {
        const filtered = leMieTrasferte.filter(t => {
            const matchSearch = !search ||
                t.destinazione?.toLowerCase().includes(search.toLowerCase()) ||
                t.motivo?.toLowerCase().includes(search.toLowerCase());
            const matchStato = filtroStato === 'tutti' || t.stato === filtroStato;
            return matchSearch && matchStato;
        });

        return [...filtered].sort((a, b) => {
            let valA, valB;
            if (sortBy === 'stato') {
                valA = a.stato;
                valB = b.stato;
            } else if (sortBy === 'destinazione') {
                valA = a.destinazione;
                valB = b.destinazione;
            } else {
                // data_inizio (default)
                valA = a.data_inizio?.substring(0, 10) ?? '';
                valB = b.data_inizio?.substring(0, 10) ?? '';
            }
            const cmp = valA?.localeCompare(valB ?? '', 'it', { sensitivity: 'base' });
            return sortDir === 'asc' ? cmp : -cmp;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leMieTrasferte, search, filtroStato, sortBy, sortDir]);

    const { paginaCorrente, totalePagine, elementiPagina, vaiAPagina } = usePaginazione(viaggiFiltrati, 10);

    const resetFiltri = () => { setSearch(''); setFiltroStato('tutti'); };
    const filtriAttivi = search || filtroStato !== 'tutti';

    // ─── Stats ──────────────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        totali: leMieTrasferte.length,
        approvate: leMieTrasferte.filter(t => t.stato === 'approvata').length,
        inAttesa: leMieTrasferte.filter(t => t.stato === 'in_attesa').length,
        rifiutate: leMieTrasferte.filter(t => t.stato === 'rifiutata').length,
    }), [leMieTrasferte]);

    if (isLoading) return (
        <div className="flex-1 flex items-center justify-center min-h-screen" style={{ background: 'var(--colore-sfondo-pagina)' }}>
            <div className="text-center">
                <Plane size={40} className="mx-auto mb-3 animate-pulse" style={{ color: 'var(--colore-primario-luce)' }} />
                <p style={{ color: 'var(--colore-testo-secondario)' }}>Caricamento dei tuoi viaggi...</p>
            </div>
        </div>
    );

    // Rimuoviamo questo per evitare che un errore globale uccida la pagina
    // if (error) return (...)

    // ─── Colonne ordinabili ──────────────────────────────────────────────────
    const colonne = [
        { key: 'destinazione', label: 'Destinazione' },
        { key: 'data_inizio', label: 'Data Inizio' },
        { key: null, label: 'Data Fine' },       // non ordinabile
        { key: 'stato', label: 'Stato' },
        { key: null, label: 'Durata' },           // calcolata
        { key: null, label: '' }
    ];

    const cellStyle = { padding: '14px 16px', fontSize: '0.875rem', color: 'var(--colore-testo-secondario)' };

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen"
            style={{ background: 'var(--colore-sfondo-pagina)', fontFamily: 'var(--font-principale)' }}>

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#1e3a8a15' }}>
                    <Plane size={22} style={{ color: 'var(--colore-primario)' }} />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--colore-testo-principale)' }}>
                        I Miei Viaggi
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--colore-testo-mutato)' }}>
                        Gestisci e monitora le tue trasferte personali · {leMieTrasferte.length} totali
                    </p>
                </div>
            </div>

            {/* 🔥 BANNER ERRORE ELIMINAZIONE: Spostato correttamente all'interno del return JSX */}
            {errorDelete && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm font-medium text-red-800 animate-fade-in">
                    <AlertCircle size={18} className="text-red-600 shrink-0" />
                    <span>{errorDelete}</span>
                    <button onClick={() => setErrorDelete(null)} className="ml-auto text-red-400 hover:text-red-700">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* ── Stat cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Totali', value: stats.totali, color: 'var(--colore-primario-luce)', bg: '#3b82f620' },
                    { label: 'Approvate', value: stats.approvate, color: 'var(--colore-successo)', bg: '#10b98120' },
                    { label: 'In attesa', value: stats.inAttesa, color: 'var(--colore-avviso)', bg: '#f59e0b20' },
                    { label: 'Rifiutate', value: stats.rifiutate, color: 'var(--colore-pericolo)', bg: '#ef444420' },
                ].map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl border"
                        style={{ background: 'var(--colore-sfondo-card)', borderColor: 'var(--colore-bordo)' }}>
                        <p className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--colore-testo-mutato)' }}>{s.label}</p>
                        <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* ── Barra ricerca + filtri ──────────────────────────────────── */}
            <div className="p-4 rounded-2xl border mb-6 flex flex-col gap-3"
                style={{ background: 'var(--colore-sfondo-card)', borderColor: 'var(--colore-bordo)' }}>
                <div className="flex gap-3 flex-wrap items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--colore-testo-mutato)' }} />
                        <input type="text" placeholder="Cerca destinazione, motivo..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                            style={{ borderColor: 'var(--colore-bordo)', background: 'var(--colore-sfondo-alt)', color: 'var(--colore-testo-principale)' }} />
                    </div>
                    <button onClick={() => setShowFiltri(v => !v)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
                        style={{
                            borderColor: showFiltri ? 'var(--colore-primario-luce)' : 'var(--colore-bordo)',
                            background: showFiltri ? 'color-mix(in srgb, var(--colore-primario) 15%, transparent)' : 'var(--colore-sfondo-alt)',
                            color: showFiltri ? 'var(--colore-primario-luce)' : 'var(--colore-testo-secondario)',
                        }}>
                        <SlidersHorizontal size={15} /> Filtri
                        {filtriAttivi && <span className="w-2 h-2 rounded-full bg-[var(--colore-primario-luce)]" />}
                    </button>
                    {filtriAttivi && (
                        <button onClick={resetFiltri}
                            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium"
                            style={{ borderColor: 'var(--colore-bordo)', color: 'var(--colore-pericolo)', background: 'var(--colore-pericolo-sfondo)' }}>
                            <X size={14} /> Reset
                        </button>
                    )}
                    <span className="ml-auto text-xs" style={{ color: 'var(--colore-testo-mutato)' }}>
                        {viaggiFiltrati.length} di {leMieTrasferte.length} trasferte
                    </span>
                </div>

                {/* Filtri avanzati */}
                {showFiltri && (
                    <div className="flex flex-wrap gap-4 pt-3 border-t" style={{ borderColor: 'var(--colore-bordo)' }}>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1"
                                style={{ color: 'var(--colore-testo-mutato)' }}>
                                <Filter size={11} /> Stato
                            </label>
                            <select value={filtroStato} onChange={e => setFiltroStato(e.target.value)}
                                className="px-3 py-2 rounded-xl border text-sm outline-none min-w-[140px]"
                                style={{ borderColor: 'var(--colore-bordo)', background: 'var(--colore-sfondo-alt)', color: 'var(--colore-testo-principale)' }}>
                                <option value="tutti">Tutti gli stati</option>
                                <option value="in_attesa">In attesa</option>
                                <option value="approvata">Approvata</option>
                                <option value="rifiutata">Rifiutata</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Tabella trasferte personali ──────────────────────────────────────────── */}
            {viaggiFiltrati.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Plane size={32} style={{ color: 'var(--colore-testo-mutato)' }} />
                    <p className="text-lg font-semibold" style={{ color: 'var(--colore-testo-secondario)' }}>
                        Nessun viaggio trovato
                    </p>
                    {filtriAttivi && (
                        <button onClick={resetFiltri} className="px-4 py-2 rounded-xl text-sm font-semibold"
                            style={{ background: 'var(--colore-primario-luce)', color: '#fff' }}>
                            Rimuovi filtri
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <TableContainer component={Paper} className="rounded-2xl overflow-hidden border"
                        elevation={0} style={{ background: 'var(--colore-sfondo-card)', borderColor: 'var(--colore-bordo)', boxShadow: 'none' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow style={{ backgroundColor: 'var(--colore-sfondo-alt)' }}>
                                    {colonne.map((col, i) => (
                                        <TableCell key={i}
                                            onClick={col.key ? () => handleSort(col.key) : undefined}
                                            style={{
                                                fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase',
                                                letterSpacing: '0.05em', color: 'var(--colore-testo-mutato)',
                                                padding: '12px 16px',
                                                cursor: col.key ? 'pointer' : 'default',
                                                userSelect: 'none',
                                                whiteSpace: 'nowrap',
                                            }}>
                                            {col.label}
                                            {col.key && <SortIcon col={col.key} sortBy={sortBy} sortDir={sortDir} />}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {elementiPagina.map((t) => {
                                    const inizio = t.data_inizio?.substring(0, 10);
                                    const fine = t.data_fine?.substring(0, 10);
                                    const giorni = inizio && fine
                                        ? Math.max(1, Math.round((new Date(fine) - new Date(inizio)) / 86400000) + 1)
                                        : '—';
                                    return (
                                        <TableRow key={t.id} hover
                                            sx={{ '& td': { borderBottom: '1px solid var(--colore-bordo)' } }}>
                                            {/* Destinazione */}
                                            <TableCell style={{ ...cellStyle, fontWeight: 600, color: 'var(--colore-testo-principale)' }}>
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={13} style={{ color: 'var(--colore-secondario)', flexShrink: 0 }} />
                                                    {t.destinazione}
                                                </div>
                                            </TableCell>
                                            {/* Data inizio */}
                                            <TableCell style={cellStyle}>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={13} style={{ color: 'var(--colore-testo-mutato)', flexShrink: 0 }} />
                                                    {inizio}
                                                </div>
                                            </TableCell>
                                            {/* Data fine */}
                                            <TableCell style={cellStyle}>{fine}</TableCell>
                                            {/* Stato */}
                                            <TableCell style={{ padding: '14px 16px' }}>
                                                <BadgeStato stato={t.stato} />
                                            </TableCell>
                                            {/* Durata */}
                                            <TableCell style={{ ...cellStyle, fontWeight: 600 }}>
                                                {typeof giorni === 'number'
                                                    ? `${giorni} ${giorni === 1 ? 'giorno' : 'giorni'}`
                                                    : giorni}
                                            </TableCell>
                                            {/* Azioni */}
                                            <TableCell style={{ padding: '14px 16px', width: '50px' }}>
                                                <button onClick={(e) => handleDelete(e, t.id)}
                                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <ControlliPaginazione
                        paginaCorrente={paginaCorrente}
                        totalePagine={totalePagine}
                        vaiAPagina={vaiAPagina}
                        totaleElementi={viaggiFiltrati.length}
                        righePerPagina={10}
                    />
                </>
            )}
        </div>
    );
}