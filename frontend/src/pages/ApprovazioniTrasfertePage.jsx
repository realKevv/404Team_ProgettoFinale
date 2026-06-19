import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/store';
import { CheckCircle, XCircle, Calendar, MapPin, User, FileText, Clock, Search, X, AlertCircle } from 'lucide-react'; // 🔥 Aggiunto AlertCircle
import { usePaginazione } from '../hooks/usePaginazione';
import { ControlliPaginazione } from '../components/ControlliPaginazione';

export function ApprovazioniTrasfertePage() {
    const { trasferte, utenti, fetchTrasferte, fetchUtenti, cambiaStatoTrasferta, isLoading } = useStore();

    // ─── Filtri ──────────────────────────────────────────────────────────────
    const [search, setSearch] = useState('');
    const [filtroRichiedente, setFiltroRichiedente] = useState('tutti');

    // 🔥 STATO PER L'ERRORE SERVER: cattura i fallimenti durante l'approvazione/rifiuto
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        fetchTrasferte();
        fetchUtenti();
    }, [fetchTrasferte, fetchUtenti]);

    const richiestePendenti = useMemo(() => {
        return trasferte
            .filter(t => t.stato === 'in_attesa')
            .filter(trip => {
                const dipendente = utenti?.find(u => u.id === trip.id_utente);
                const nomeDip = dipendente?.nome_completo?.toLowerCase() || '';
                const matchSearch = !search ||
                    trip.destinazione?.toLowerCase().includes(search.toLowerCase()) ||
                    trip.motivo?.toLowerCase().includes(search.toLowerCase()) ||
                    nomeDip.includes(search.toLowerCase());
                const matchRich = filtroRichiedente === 'tutti' || String(trip.id_utente) === filtroRichiedente;
                return matchSearch && matchRich;
            });
    }, [trasferte, utenti, search, filtroRichiedente]);

    const { paginaCorrente, totalePagine, elementiPagina, vaiAPagina } = usePaginazione(richiestePendenti, 10);

    // 🔥 NUOVA FUNZIONE: Gestisce il cambio di stato intercettando gli errori del backend
    const handleApprovazione = async (idTrasferta, stato) => {
        setServerError(null); // Resetta errori precedenti
        try {
            await cambiaStatoTrasferta(idTrasferta, stato);
        } catch (err) {
            // Se il server blocca l'approvazione, lo mostriamo all'admin!
            setServerError(err.message);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-[var(--colore-testo-mutato)]">Caricamento richieste in corso... ⏳</div>;

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen bg-[var(--colore-sfondo-pagina)] font-[var(--font-principale)]">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10">
                    <Clock size={22} className="text-amber-600" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--colore-testo-principale)]">Coda Approvazioni</h1>
                    <p className="text-sm text-[var(--colore-testo-mutato)]">Gestisci le richieste di viaggio in attesa</p>
                </div>
            </div>

            {/* Filtri */}
            <div className="p-4 rounded-2xl border mb-6 flex flex-wrap items-center gap-3"
                style={{ background: 'var(--colore-sfondo-card)', borderColor: 'var(--colore-bordo)' }}>
                <div className="relative flex-1 min-w-[180px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--colore-testo-mutato)' }} />
                    <input type="text" placeholder="Cerca destinazione, dipendente, motivo..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border text-sm outline-none"
                        style={{ borderColor: 'var(--colore-bordo)', background: 'var(--colore-sfondo-alt)', color: 'var(--colore-testo-principale)' }} />
                </div>
                <select value={filtroRichiedente} onChange={e => setFiltroRichiedente(e.target.value)}
                    className="px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ borderColor: 'var(--colore-bordo)', background: 'var(--colore-sfondo-alt)', color: 'var(--colore-testo-principale)' }}>
                    <option value="tutti">Tutti i richiedenti</option>
                    {utenti?.map(u => (
                        <option key={u.id} value={String(u.id)}>{u.nome_completo}</option>
                    ))}
                </select>
                {(search || filtroRichiedente !== 'tutti') && (
                    <button onClick={() => { setSearch(''); setFiltroRichiedente('tutti'); }}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium"
                        style={{ borderColor: 'var(--colore-bordo)', color: 'var(--colore-pericolo)', background: 'var(--colore-pericolo-sfondo)' }}>
                        <X size={12} /> Reset
                    </button>
                )}
                <span className="ml-auto text-xs font-medium px-3 py-1 rounded-full badge-warning">
                    {richiestePendenti.length} in attesa
                </span>
            </div>

            {/* 🔥 BANNER ERRORE SERVER: Appare sopra la lista se fallisce un'approvazione */}
            {serverError && (
                <div className="mb-6 p-3 rounded-xl flex items-start gap-2 animate-fade-in max-w-4xl badge-danger">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" style={{ color: "var(--colore-pericolo)" }} />
                    <p className="text-sm font-medium leading-tight">
                        {serverError}
                    </p>
                    <button onClick={() => setServerError(null)} className="ml-auto hover:opacity-80">
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="space-y-4 max-w-4xl">
                {richiestePendenti.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-[var(--colore-bordo)] rounded-2xl bg-[var(--colore-sfondo-card)] text-[var(--colore-testo-mutato)] italic">
                        {trasferte.filter(t => t.stato === 'in_attesa').length === 0
                            ? 'Tutto pulito! Nessuna richiesta in attesa. 🎉'
                            : 'Nessun risultato per i filtri selezionati.'}
                    </div>
                ) : (
                    <>
                        {elementiPagina.map((trip) => {
                            const dipendente = utenti?.find(u => u.id === trip.id_utente);
                            return (
                                <div key={trip.id} className="p-5 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--colore-testo-principale)]">
                                            <User size={16} className="text-[var(--colore-primario)]" />
                                            <span>{dipendente?.nome_completo || 'Dipendente sconosciuto'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-lg font-bold text-[var(--colore-testo-principale)]">
                                            <MapPin size={18} className="text-[var(--colore-secondario)]" />
                                            <h3>{trip.destinazione}</h3>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-[var(--colore-testo-mutato)]">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} /> Dal {trip.data_inizio.substring(0, 10)} al {trip.data_fine.substring(0, 10)}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-[var(--colore-sfondo-pagina)] rounded-xl border border-[var(--colore-bordo)] text-xs text-[var(--colore-testo-secondario)] italic flex items-start gap-1">
                                            <FileText size={14} className="mt-0.5 shrink-0" />
                                            <span>"{trip.motivo}"</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 md:self-center self-end">
                                        {/* 🔥 BOTTONI AGGIORNATI CON LA NUOVA FUNZIONE */}
                                        <button onClick={() => handleApprovazione(trip.id, 'approvata')} className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                                            <CheckCircle size={18} /> Approva
                                        </button>
                                        <button onClick={() => handleApprovazione(trip.id, 'rifiutata')} className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                                            <XCircle size={18} /> Rifiuta
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        <ControlliPaginazione paginaCorrente={paginaCorrente} totalePagine={totalePagine} vaiAPagina={vaiAPagina} totaleElementi={richiestePendenti.length} righePerPagina={10} />
                    </>
                )}
            </div>
        </div>
    );
}