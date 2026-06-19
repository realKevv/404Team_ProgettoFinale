import React, { useEffect, useState, useMemo } from 'react';
import {
    Plane, Search, Filter, Calendar, MapPin, Clock,
    CheckCircle, XCircle, ChevronRight, SlidersHorizontal, X, User
} from 'lucide-react';
import { useStore } from '../store/store';
import { usePaginazione } from '../hooks/usePaginazione';
import { ControlliPaginazione } from '../components/ControlliPaginazione';

// ─── Badge Stato ───────────────────────────────────────────────────────────
function BadgeStato({ stato }) {
    const config = {
        approvata: { label: 'Approvata', bg: 'var(--colore-successo-sfondo)', color: 'var(--colore-successo)', border: 'var(--colore-successo)', Icon: CheckCircle },
        rifiutata: { label: 'Rifiutata', bg: 'var(--colore-pericolo-sfondo)', color: 'var(--colore-pericolo)', border: 'var(--colore-pericolo)', Icon: XCircle },
        in_attesa: { label: 'In attesa', bg: 'var(--colore-avviso-sfondo)', color: 'var(--colore-avviso)', border: 'var(--colore-avviso)', Icon: Clock },
    };
    const c = config[stato] ?? config.in_attesa;
    return (
        <span
            style={{ backgroundColor: c.bg, color: c.color, borderColor: c.border }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize"
        >
            <c.Icon size={12} />
            {c.label}
        </span>
    );
}

// ─── Card singola viaggio ──────────────────────────────────────────────────
function ViaggioCard({ trasferta, nomeDipendente, onClick }) {
    const inizio = trasferta.data_inizio?.substring(0, 10);
    const fine = trasferta.data_fine?.substring(0, 10);
    const giorniDiff = useMemo(() => {
        if (!inizio || !fine) return 0;
        const ms = new Date(fine) - new Date(inizio);
        return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
    }, [inizio, fine]);
    return (
        <div
            onClick={onClick}
            className="group p-5 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] hover:shadow-lg hover:border-[var(--colore-bordo-focus)] transition-all duration-200 cursor-pointer"
        >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1e3a8a10] shrink-0">
                        <Plane size={18} style={{ color: 'var(--colore-primario-luce)' }} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-[var(--colore-testo-principale)] truncate text-base">
                            {trasferta.destinazione}
                        </h3>
                        {/* 🔥 FIX 1: Mostra il nome reale del dipendente pescato dal DB */}
                        <p className="text-xs text-[var(--colore-testo-mutato)] truncate flex items-center gap-1 mt-0.5">
                            <User size={12} /> {nomeDipendente || "Dipendente Aziendale"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <BadgeStato stato={trasferta.stato} />
                    <ChevronRight size={16} style={{ color: 'var(--colore-testo-mutato)' }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
            {/* Date + durata */}
            <div className="flex items-center gap-2 text-xs text-[var(--colore-testo-secondario)] mb-3">
                <Calendar size={13} />
                <span>{inizio} → {fine}</span>
                <span className="ml-auto font-medium text-[var(--colore-primario-luce)]">
                    {giorniDiff} {giorniDiff === 1 ? 'giorno' : 'giorni'}
                </span>
            </div>
            {/* Motivo */}
            {trasferta.motivo && (
                <p className="text-xs text-[var(--colore-testo-mutato)] line-clamp-2 italic leading-relaxed border-t pt-3"
                    style={{ borderColor: 'var(--colore-bordo)' }}>
                    "{trasferta.motivo}"
                </p>
            )}
        </div>
    );
}

// ─── Pannello dettaglio (slide-in a destra) ───────────────────────────────
function PannelloDettaglio({ trasferta, nomeDipendente, onClose }) {
    if (!trasferta) return null;
    const inizio = trasferta.data_inizio?.substring(0, 10);
    const fine = trasferta.data_fine?.substring(0, 10);
    return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            {/* Pannello */}
            <div
                className="relative z-10 w-full max-w-md bg-[var(--colore-sfondo-card)] h-full shadow-2xl flex flex-col p-8 gap-6 overflow-y-auto animate-slide-in-right"
                onClick={e => e.stopPropagation()}
                style={{ animationDuration: '0.25s' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: '#1e3a8a15' }}>
                            <Plane size={20} style={{ color: 'var(--colore-primario)' }} />
                        </div>
                        <h2 className="text-xl font-bold text-[var(--colore-testo-principale)]">
                            Dettaglio Viaggio
                        </h2>
                    </div>
                    <button onClick={onClose}
                        className="p-2 rounded-lg hover-tema transition-colors"
                        style={{ color: 'var(--colore-testo-mutato)' }}>
                        <X size={20} />
                    </button>
                </div>
                {/* Destinazione + stato */}
                <div>
                    <h3 className="text-2xl font-bold text-[var(--colore-testo-principale)] flex items-center gap-2 mb-2">
                        <MapPin size={22} style={{ color: 'var(--colore-secondario)' }} />
                        {trasferta.destinazione}
                    </h3>
                    <BadgeStato stato={trasferta.stato} />
                </div>
                {/* Date */}
                <div className="p-4 rounded-xl border" style={{ background: 'var(--colore-sfondo-alt)', borderColor: 'var(--colore-bordo)' }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1"
                        style={{ color: 'var(--colore-primario)' }}>
                        <Calendar size={13} /> Periodo
                    </p>
                    <div className="flex justify-between text-sm font-medium" style={{ color: "var(--colore-testo-secondario)" }}>
                        <span>Dal: <b>{inizio}</b></span>
                        <span>Al: <b>{fine}</b></span>
                    </div>
                </div>
                {/* Richiedente */}
                <div className="p-4 rounded-xl border bg-[var(--colore-sfondo-alt)]"
                    style={{ borderColor: 'var(--colore-bordo)' }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-1 text-[var(--colore-testo-mutato)]">
                        Dipendente in Missione
                    </p>
                    <p className="text-sm font-semibold text-[var(--colore-testo-principale)]">
                        {nomeDipendente || "Dipendente Aziendale"}
                    </p>
                </div>
                {/* Motivo */}
                {trasferta.motivo && (
                    <div className="p-4 rounded-xl border bg-[var(--colore-sfondo-alt)]"
                        style={{ borderColor: 'var(--colore-bordo)' }}>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1 text-[var(--colore-testo-mutato)]">
                            Motivo
                        </p>
                        <p className="text-sm italic text-[var(--colore-testo-secondario)] leading-relaxed">
                            "{trasferta.motivo}"
                        </p>
                    </div>
                )}
                <button onClick={onClose}
                    className="mt-auto text-sm font-semibold transition-colors py-2.5 rounded-xl"
                    style={{ color: 'var(--colore-primario-luce)' }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                    Chiudi dettagli
                </button>
            </div>
        </div>
    );
}

// ─── Pagina principale (Trasformata in Named Export) ───────────────────────
export function ListaViaggi() {
    // 🔥 FIX 2: Iniettiamo utenti e fetchUtenti dal nostro store globale reale
    const { trasferte, utenti, isLoading, error, fetchTrasferte, fetchUtenti } = useStore();
    const [search, setSearch] = useState('');
    const [filtroStato, setFiltroStato] = useState('tutti');
    const [dataInizio, setDataInizio] = useState('');
    const [dataFine, setDataFine] = useState('');
    const [showFiltri, setShowFiltri] = useState(false);
    const [selezionato, setSelezionato] = useState(null);

    useEffect(() => {
        fetchTrasferte();
        fetchUtenti(); // Tiriamo giù l'anagrafica per mappare i nomi
    }, [fetchTrasferte, fetchUtenti]);

    // ✨ Trova il nome associato alla trasferta selezionata per il pannello laterale
    const nomeSelezionato = useMemo(() => {
        if (!selezionato || !utenti) return '';
        const u = utenti.find(user => user.id === selezionato.id_utente);
        return u ? u.nome_completo : '';
    }, [selezionato, utenti]);

    // ── Filtri applicati ──────────────────────────────────────────────────
    const viaggiFiltrati = useMemo(() => {
        return trasferte.filter(t => {
            // Risaliamo al nome del dipendente per abilitare la ricerca testuale anche sul suo nome!
            const d = utenti?.find(user => user.id === t.id_utente);
            const nomeDipendente = d ? d.nome_completo?.toLowerCase() : '';

            const matchSearch = !search ||
                t.destinazione?.toLowerCase().includes(search.toLowerCase()) ||
                nomeDipendente.includes(search.toLowerCase()) ||
                t.motivo?.toLowerCase().includes(search.toLowerCase());

            const matchStato = filtroStato === 'tutti' || t.stato === filtroStato;

            // 🔥 FIX 3: Pulizia dei timestamp ISO per evitare bug strutturali nel confronto date
            const tInizio = t.data_inizio?.substring(0, 10);
            const tFine = t.data_fine?.substring(0, 10);

            const matchDataInizio = !dataInizio || tFine >= dataInizio;
            const matchDataFine = !dataFine || tInizio <= dataFine;

            return matchSearch && matchStato && matchDataInizio && matchDataFine;
        });
    }, [trasferte, utenti, search, filtroStato, dataInizio, dataFine]);

    const resetFiltri = () => {
        setSearch(''); setFiltroStato('tutti');
        setDataInizio(''); setDataFine('');
    };
    const filtriAttivi = search || filtroStato !== 'tutti' || dataInizio || dataFine;

    // ── Paginazione ───────────────────────────────────────────────────────
    const { paginaCorrente, totalePagine, elementiPagina, vaiAPagina } = usePaginazione(viaggiFiltrati, 10);

    // ── Stat mini ─────────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        totali: trasferte.length,
        approvate: trasferte.filter(t => t.stato === 'approvata').length,
        inAttesa: trasferte.filter(t => t.stato === 'in_attesa').length,
        rifiutate: trasferte.filter(t => t.stato === 'rifiutata').length,
    }), [trasferte]);

    if (isLoading) return (
        <div className="flex-1 flex items-center justify-center min-h-screen"
            style={{ background: 'var(--colore-sfondo-pagina)' }}>
            <div className="text-center">
                <Plane size={40} className="mx-auto mb-3 animate-pulse" style={{ color: 'var(--colore-primario-luce)' }} />
                <p style={{ color: 'var(--colore-testo-secondario)' }}>Caricamento viaggi...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex-1 flex items-center justify-center min-h-screen"
            style={{ background: 'var(--colore-sfondo-pagina)' }}>
            <p style={{ color: 'var(--colore-pericolo)' }}>❌ {error}</p>
        </div>
    );

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen"
            style={{ background: 'var(--colore-sfondo-pagina)', fontFamily: 'var(--font-principale)' }}>
            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: '#1e3a8a15' }}>
                    <Plane size={22} style={{ color: 'var(--colore-primario)' }} />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold"
                        style={{ color: 'var(--colore-testo-principale)' }}>
                        Lista Viaggi
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--colore-testo-mutato)' }}>
                        {trasferte.length} trasferte totali · {viaggiFiltrati.length} visualizzate
                    </p>
                </div>
            </div>
            {/* ── Stat cards ──────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Totali', value: stats.totali, color: 'var(--colore-primario-luce)', bg: '#3b82f620' },
                    { label: 'Approvate', value: stats.approvate, color: 'var(--colore-successo)', bg: '#10b98120' },
                    { label: 'In attesa', value: stats.inAttesa, color: 'var(--colore-avviso)', bg: '#f59e0b20' },
                    { label: 'Rifiutate', value: stats.rifiutate, color: 'var(--colore-pericolo)', bg: '#ef444420' },
                ].map((s, i) => (
                    <div key={i}
                        className="p-4 rounded-2xl border"
                        style={{ background: 'var(--colore-sfondo-card)', borderColor: 'var(--colore-bordo)' }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase"
                                style={{ color: 'var(--colore-testo-mutato)' }}>
                                {s.label}
                            </span>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: s.bg }}>
                                <Plane size={15} style={{ color: s.color }} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold" style={{ color: 'var(--colore-testo-principale)' }}>
                            {s.value}
                        </p>
                    </div>
                ))}
            </div>
            {/* ── Barra ricerca + filtri ───────────────────────────────── */}
            <div className="p-4 rounded-2xl border mb-6 flex flex-col gap-3"
                style={{ background: 'var(--colore-sfondo-card)', borderColor: 'var(--colore-bordo)' }}>
                <div className="flex gap-3 flex-wrap">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: 'var(--colore-testo-mutato)' }} />
                        <input
                            type="text"
                            placeholder="Cerca destinazione, richiedente, motivo..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                            style={{
                                borderColor: 'var(--colore-bordo)',
                                background: 'var(--colore-sfondo-alt)',
                                color: 'var(--colore-testo-principale)',
                                fontFamily: 'var(--font-principale)',
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--colore-bordo-focus)'}
                            onBlur={e => e.target.style.borderColor = 'var(--colore-bordo)'}
                        />
                    </div>
                    {/* Toggle filtri avanzati */}
                    <button
                        onClick={() => setShowFiltri(v => !v)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
                        style={{
                            borderColor: showFiltri ? 'var(--colore-primario-luce)' : 'var(--colore-bordo)',
                            background: showFiltri ? 'color-mix(in srgb, var(--colore-primario) 15%, transparent)' : 'var(--colore-sfondo-alt)',
                            color: showFiltri ? 'var(--colore-primario-luce)' : 'var(--colore-testo-secondario)',
                        }}
                    >
                        <SlidersHorizontal size={16} />
                        Filtri {filtriAttivi && <span className="w-2 h-2 rounded-full bg-[var(--colore-primario-luce)] ml-1" />}
                    </button>
                    {/* Reset */}
                    {filtriAttivi && (
                        <button
                            onClick={resetFiltri}
                            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all"
                            style={{ borderColor: 'var(--colore-bordo)', color: 'var(--colore-pericolo)', background: 'var(--colore-pericolo-sfondo)' }}
                        >
                            <X size={14} /> Reset
                        </button>
                    )}
                </div>
                {/* Filtri avanzati espansi */}
                {showFiltri && (
                    <div className="flex flex-wrap gap-4 pt-3 border-t"
                        style={{ borderColor: 'var(--colore-bordo)' }}>
                        {/* Stato */}
                        <div className="flex flex-col gap-1 min-w-[160px]">
                            <label className="text-xs font-semibold uppercase tracking-wide"
                                style={{ color: 'var(--colore-testo-mutato)' }}>
                                Stato
                            </label>
                            <select
                                value={filtroStato}
                                onChange={e => setFiltroStato(e.target.value)}
                                className="px-3 py-2 rounded-xl border text-sm outline-none"
                                style={{
                                    borderColor: 'var(--colore-bordo)',
                                    background: 'var(--colore-sfondo-alt)',
                                    color: 'var(--colore-testo-principale)',
                                    fontFamily: 'var(--font-principale)',
                                }}
                            >
                                <option value="tutti">Tutti</option>
                                <option value="in_attesa">In attesa</option>
                                <option value="approvata">Approvata</option>
                                <option value="rifiutata">Rifiutata</option>
                            </select>
                        </div>
                        {/* Data inizio */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1"
                                style={{ color: 'var(--colore-testo-mutato)' }}>
                                <Filter size={11} /> Da data
                            </label>
                            <input
                                type="date"
                                value={dataInizio}
                                onChange={e => setDataInizio(e.target.value)}
                                className="px-3 py-2 rounded-xl border text-sm outline-none"
                                style={{
                                    borderColor: 'var(--colore-bordo)',
                                    background: 'var(--colore-sfondo-alt)',
                                    color: 'var(--colore-testo-principale)',
                                    fontFamily: 'var(--font-principale)',
                                }}
                            />
                        </div>
                        {/* Data fine */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1"
                                style={{ color: 'var(--colore-testo-mutato)' }}>
                                <Filter size={11} /> A data
                            </label>
                            <input
                                type="date"
                                value={dataFine}
                                onChange={e => setDataFine(e.target.value)}
                                min={dataInizio}
                                className="px-3 py-2 rounded-xl border text-sm outline-none"
                                style={{
                                    borderColor: 'var(--colore-bordo)',
                                    background: 'var(--colore-sfondo-alt)',
                                    color: 'var(--colore-testo-principale)',
                                    fontFamily: 'var(--font-principale)',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            {/* ── Griglia cards ────────────────────────────────────────── */}
            {viaggiFiltrati.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: '#1e3a8a08' }}>
                        <Plane size={32} style={{ color: 'var(--colore-testo-mutato)' }} />
                    </div>
                    <p className="text-lg font-semibold" style={{ color: 'var(--colore-testo-secondario)' }}>
                        Nessun viaggio trovato
                    </p>
                    <p className="text-sm" style={{ color: 'var(--colore-testo-mutato)' }}>
                        Prova a modificare i filtri di ricerca
                    </p>
                    {filtriAttivi && (
                        <button onClick={resetFiltri}
                            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                            style={{ background: 'var(--colore-primario-luce)', color: '#fff' }}>
                            Rimuovi filtri
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {elementiPagina.map(t => {
                        const dipendente = utenti?.find(user => user.id === t.id_utente);
                        return (
                            <ViaggioCard
                                key={t.id}
                                trasferta={t}
                                nomeDipendente={dipendente ? dipendente.nome_completo : ''}
                                onClick={() => setSelezionato(t)}
                            />
                        );
                    })}
                </div>
            )}
            <ControlliPaginazione
                paginaCorrente={paginaCorrente}
                totalePagine={totalePagine}
                vaiAPagina={vaiAPagina}
                totaleElementi={viaggiFiltrati.length}
                righePerPagina={10}
            />
            {/* ── Pannello dettaglio ───────────────────────────────────── */}
            <PannelloDettaglio
                trasferta={selezionato}
                nomeDipendente={nomeSelezionato}
                onClose={() => setSelezionato(null)}
            />
        </div>
    );
}