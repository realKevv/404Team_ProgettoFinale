import React, { useEffect, useState, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import { Users, Building2, Plane, X, Calendar, FileText, Info, Search } from 'lucide-react';
import { useStore } from '../store/store';
import { usePaginazione } from '../hooks/usePaginazione';
import { ControlliPaginazione } from '../components/ControlliPaginazione';

export function DipendentiPage() {
    const { utenti, trasferte, isLoading, fetchUtenti, fetchTrasferte } = useStore();
    const [selectedUser, setSelectedUser] = useState(null);

    // ─── Filtri ──────────────────────────────────────────────────────────────
    const [search, setSearch] = useState('');
    const [filtroStato, setFiltroStato] = useState('tutti'); // tutti | inTrasferta | inUfficio | futuroProgrammato

    useEffect(() => {
        fetchUtenti();
        fetchTrasferte();
    }, [fetchUtenti, fetchTrasferte]);

    const oggi = new Date().toISOString().split('T')[0];

    const dipendentiConStato = useMemo(() => utenti.map(utente => {
        const trasfertaAttuale = trasferte.find(t => {
            if (t.id_utente !== utente.id || t.stato !== 'approvata') return false;
            const inizio = t.data_inizio.substring(0, 10);
            const fine = t.data_fine.substring(0, 10);
            return oggi >= inizio && oggi <= fine;
        });
        const trasferteFuture = trasferte.filter(t => {
            if (t.id_utente !== utente.id || t.stato !== 'approvata') return false;
            return oggi < t.data_inizio.substring(0, 10);
        }).sort((a, b) => a.data_inizio.localeCompare(b.data_inizio));
        const trasfertaFutura = trasferteFuture[0];

        if (trasfertaAttuale) {
            return { ...utente, inTrasferta: true, statoKey: 'inTrasferta', statusMessaggio: 'In Trasferta', destinazione: trasfertaAttuale.destinazione, inizio: trasfertaAttuale.data_inizio.substring(0, 10), ritorno: trasfertaAttuale.data_fine.substring(0, 10), motivo: trasfertaAttuale.motivo };
        } else {
            return { ...utente, inTrasferta: false, statoKey: trasfertaFutura ? 'futuroProgrammato' : 'inUfficio', statusMessaggio: trasfertaFutura ? `Partirà il ${trasfertaFutura.data_inizio.substring(0, 10)}` : 'In Ufficio', destinazione: 'Sede Centrale', inizio: trasfertaFutura ? trasfertaFutura.data_inizio.substring(0, 10) : '-', ritorno: trasfertaFutura ? trasfertaFutura.data_fine.substring(0, 10) : '-', motivo: trasfertaFutura ? `Prossima destinazione: ${trasfertaFutura.destinazione} - ${trasfertaFutura.motivo}` : 'Nessuna trasferta in programma.' };
        }
    }), [utenti, trasferte, oggi]);

    const dipendentiFiltrati = useMemo(() => {
        return dipendentiConStato.filter(d => {
            const matchSearch = !search ||
                d.nome_completo?.toLowerCase().includes(search.toLowerCase()) ||
                d.email?.toLowerCase().includes(search.toLowerCase()) ||
                d.ruolo?.toLowerCase().includes(search.toLowerCase());
            const matchStato = filtroStato === 'tutti' || d.statoKey === filtroStato;
            return matchSearch && matchStato;
        });
    }, [dipendentiConStato, search, filtroStato]);

    const { paginaCorrente, totalePagine, elementiPagina, vaiAPagina } = usePaginazione(dipendentiFiltrati, 10);

    if (isLoading) return <div className="p-8 text-center text-[var(--colore-testo-secondario)]">Caricamento colleghi... ⏳</div>;

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen bg-[var(--colore-sfondo-pagina)] font-[var(--font-principale)]">
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1e3a8a15]">
                    <Users size={22} className="text-[var(--colore-primario)]" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--colore-testo-principale)]">Status Team</h1>
                    <p className="text-sm text-[var(--colore-testo-mutato)]">Monitoraggio presenze e viaggi in tempo reale</p>
                </div>
            </div>

            {/* FILTRI */}
            <div className="p-4 rounded-2xl border mb-6 flex flex-wrap items-center gap-3"
                style={{ background: 'var(--colore-sfondo-card)', borderColor: 'var(--colore-bordo)' }}>
                <div className="relative flex-1 min-w-[180px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--colore-testo-mutato)' }} />
                    <input type="text" placeholder="Cerca nome, email, ruolo..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border text-sm outline-none"
                        style={{ borderColor: 'var(--colore-bordo)', background: 'var(--colore-sfondo-alt)', color: 'var(--colore-testo-principale)' }} />
                </div>
                <select value={filtroStato} onChange={e => setFiltroStato(e.target.value)}
                    className="px-3 py-2 rounded-xl border text-sm outline-none"
                    style={{ borderColor: 'var(--colore-bordo)', background: 'var(--colore-sfondo-alt)', color: 'var(--colore-testo-principale)' }}>
                    <option value="tutti">Tutti gli stati</option>
                    <option value="inTrasferta">In Trasferta</option>
                    <option value="futuroProgrammato">Prossima partenza</option>
                    <option value="inUfficio">In Ufficio</option>
                </select>
                {(search || filtroStato !== 'tutti') && (
                    <button onClick={() => { setSearch(''); setFiltroStato('tutti'); }}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium"
                        style={{ borderColor: 'var(--colore-bordo)', color: 'var(--colore-pericolo)', background: 'var(--colore-pericolo-sfondo)' }}>
                        <X size={12} /> Reset
                    </button>
                )}
                <span className="ml-auto text-xs" style={{ color: 'var(--colore-testo-mutato)' }}>
                    {dipendentiFiltrati.length} di {dipendentiConStato.length} dipendenti
                </span>
            </div>

            {/* GRIGLIA DINAMICA */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
                <div className={(selectedUser ? 'xl:col-span-2' : 'xl:col-span-3') + ' min-w-0 w-full transition-all duration-300'}>
                    <TableContainer component={Paper} className="rounded-2xl overflow-hidden border bg-[var(--colore-sfondo-card)]"
                        elevation={0} style={{ borderColor: 'var(--colore-bordo)', boxShadow: 'none' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow style={{ backgroundColor: 'var(--colore-sfondo-alt)' }}>
                                    {['Dipendente', 'Ruolo', 'Status', 'Posizione corrente'].map((header, i) => (
                                        <TableCell key={i} style={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--colore-testo-mutato)', padding: '12px 16px' }}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {elementiPagina.map((dipendente) => {
                                    const isSelected = selectedUser?.id === dipendente.id;
                                    return (
                                        <TableRow key={dipendente.id} hover onClick={() => setSelectedUser(dipendente)} className="cursor-pointer"
                                            sx={{ '& td': { borderBottom: '1px solid var(--colore-bordo)' }, backgroundColor: isSelected ? 'rgba(30, 58, 138, 0.04) !important' : 'inherit' }}>
                                            <TableCell style={{ padding: '14px 16px' }}>
                                                <div className="font-semibold text-[var(--colore-testo-principale)]">{dipendente.nome_completo}</div>
                                                <div className="text-xs text-[var(--colore-testo-mutato)]">{dipendente.email}</div>
                                            </TableCell>
                                            <TableCell style={{ padding: '14px 16px', textTransform: 'capitalize', color: 'var(--colore-testo-secondario)' }}>{dipendente.ruolo}</TableCell>
                                            <TableCell style={{ padding: '14px 16px' }}>
                                                {dipendente.inTrasferta ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200"><Plane size={12} /> In Trasferta</span>
                                                ) : dipendente.statoKey === 'futuroProgrammato' ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200"><Calendar size={12} /> {dipendente.statusMessaggio}</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200"><Building2 size={12} /> In Ufficio</span>
                                                )}
                                            </TableCell>
                                            <TableCell style={{ padding: '14px 16px', color: 'var(--colore-testo-principale)', fontWeight: 500 }}>{dipendente.destinazione}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {dipendentiFiltrati.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--colore-testo-mutato)', fontStyle: 'italic' }}>
                                            Nessun dipendente trovato per i filtri selezionati.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <ControlliPaginazione paginaCorrente={paginaCorrente} totalePagine={totalePagine} vaiAPagina={vaiAPagina} totaleElementi={dipendentiFiltrati.length} righePerPagina={10} />
                </div>

                {/* PANNELLO DETTAGLI */}
                {selectedUser && (
                    <div className="xl:col-span-1 p-6 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] shadow-md flex flex-col gap-5 animate-fade-in">
                        <div className="flex justify-between items-start border-b pb-4" style={{ borderColor: 'var(--colore-bordo)' }}>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1e3a8a10]"><Info size={18} className="text-[var(--colore-primario)]" /></div>
                                <h2 className="text-lg font-bold text-[var(--colore-testo-principale)]">Dettagli Collega</h2>
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="p-1 rounded-lg hover:bg-gray-100 text-[var(--colore-testo-mutato)] transition-colors"><X size={18} /></button>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--colore-testo-principale)]">{selectedUser.nome_completo}</h3>
                            <p className="text-sm text-[var(--colore-testo-mutato)]">{selectedUser.email}</p>
                            <p className="text-xs uppercase font-bold mt-1 tracking-wider text-[var(--colore-primario)]">{selectedUser.ruolo}</p>
                        </div>
                        {selectedUser.inTrasferta || selectedUser.statoKey === 'futuroProgrammato' ? (
                            <>
                                <div className={`p-3.5 rounded-xl border flex flex-col gap-2 ${selectedUser.inTrasferta ? 'bg-blue-50/50 border-blue-100' : 'bg-amber-50/50 border-amber-100'}`}>
                                    <span className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${selectedUser.inTrasferta ? 'text-blue-700' : 'text-amber-700'}`}>
                                        <Calendar size={14} /> {selectedUser.inTrasferta ? 'Periodo Viaggio' : 'Prossima Partenza'}
                                    </span>
                                    <div className="text-sm font-medium text-slate-700 flex justify-between">
                                        <span>Partenza: <b>{selectedUser.inizio}</b></span>
                                        <span>Rientro: <b>{selectedUser.ritorno}</b></span>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-gray-50 border border-[var(--colore-bordo)] flex flex-col gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wide text-[var(--colore-testo-mutato)] flex items-center gap-1"><FileText size={14} /> Motivo del viaggio</span>
                                    <p className="text-sm text-[var(--colore-testo-secondario)] leading-relaxed italic">"{selectedUser.motivo}"</p>
                                </div>
                            </>
                        ) : (
                            <div className="p-4 rounded-xl bg-gray-50 text-center border border-dashed border-[var(--colore-bordo)] text-[var(--colore-testo-mutato)] text-sm">
                                <Building2 size={24} className="mx-auto mb-2 text-gray-400" />
                                Il dipendente non ha viaggi futuri programmati e si trova in Sede.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}