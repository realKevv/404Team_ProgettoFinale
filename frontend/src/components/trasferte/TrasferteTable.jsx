import React, { useState, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import { List, Search, X, Trash2, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/store';
import { usePaginazione } from '../../hooks/usePaginazione';
import { ControlliPaginazione } from '../ControlliPaginazione';

export function TrasferteTable({ trasferte, onRowClick, selectedId }) {
    const utenteCorrente = (() => {
        try { return JSON.parse(localStorage.getItem('utente') || '{}'); }
        catch (_) { return {}; }
    })();
    const isAdmin = utenteCorrente?.ruolo === 'admin';
    const { deleteTrasferta } = useStore();


    /*stato del componente */
    const [serverError, setServerError] = useState(null);

    //  Modifica della funzione handleDelete
    const handleDelete = async (e, id) => {
        e.stopPropagation();
        setServerError(null); // Resetta errori precedenti
        if (window.confirm("Sei sicuro di voler eliminare questa trasferta?")) {
            try {
                await deleteTrasferta(id);
            } catch (err) {
                setServerError(err.message); // Salva il messaggio reale dal backend
            }
        }
    };
    // ─── Filtri ──────────────────────────────────────────────────────────────
    const [search, setSearch] = useState('');
    const [filtroStato, setFiltroStato] = useState('tutti');

    const trasferteFiltrate = useMemo(() => {
        return trasferte.filter(row => {
            const matchSearch = !search ||
                row.destinazione?.toLowerCase().includes(search.toLowerCase()) ||
                row.motivo?.toLowerCase().includes(search.toLowerCase()) ||
                row.richiedente?.toLowerCase().includes(search.toLowerCase());
            const matchStato = filtroStato === 'tutti' || row.stato === filtroStato;
            return matchSearch && matchStato;
        });
    }, [trasferte, search, filtroStato]);

    // ─── Paginazione ─────────────────────────────────────────────────────────
    const { paginaCorrente, totalePagine, elementiPagina, vaiAPagina } = usePaginazione(trasferteFiltrate, 10);

    const headers = isAdmin
        ? ['Richiedente', 'Destinazione', 'Inizio', 'Fine', 'Motivo', 'Stato', '']
        : ['Destinazione', 'Inizio', 'Fine', 'Motivo', 'Stato', ''];

    const cellStyle = { color: 'var(--colore-testo-secondario)', padding: '14px 16px', fontSize: '0.875rem' };

    return (
        <div className="flex flex-col gap-4">
            {serverError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm font-medium text-red-800 animate-fade-in">
                    <AlertCircle size={18} className="text-red-600 shrink-0" />
                    <span>{serverError}</span>
                    <button onClick={() => setServerError(null)} className="ml-auto text-red-400 hover:text-red-700">
                        <X size={16} />
                    </button>
                </div>
            )}
            {/* Header + filtri */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1e3a8a15' }}>
                        <List size={18} style={{ color: 'var(--colore-primario)' }} />
                    </div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--colore-testo-principale)' }}>
                        {isAdmin ? 'Gestione Richieste' : 'Le tue richieste'}
                    </h2>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Ricerca */}
                    <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--colore-testo-mutato)' }} />
                        <input
                            type="text"
                            placeholder="Cerca..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-8 pr-3 py-2 rounded-xl border text-xs outline-none"
                            style={{ borderColor: 'var(--colore-bordo)', background: 'var(--colore-sfondo-alt)', color: 'var(--colore-testo-principale)', width: 160 }}
                        />
                    </div>
                    {/* Filtro stato */}
                    <select
                        value={filtroStato}
                        onChange={e => setFiltroStato(e.target.value)}
                        className="px-3 py-2 rounded-xl border text-xs outline-none"
                        style={{ borderColor: 'var(--colore-bordo)', background: 'var(--colore-sfondo-alt)', color: 'var(--colore-testo-principale)' }}
                    >
                        <option value="tutti">Tutti gli stati</option>
                        <option value="in_attesa">In attesa</option>
                        <option value="approvata">Approvata</option>
                        <option value="rifiutata">Rifiutata</option>
                    </select>
                    {/* Reset */}
                    {(search || filtroStato !== 'tutti') && (
                        <button onClick={() => { setSearch(''); setFiltroStato('tutti'); }}
                            className="p-2 rounded-xl border text-xs font-medium flex items-center gap-1"
                            style={{ borderColor: 'var(--colore-bordo)', color: 'var(--colore-pericolo)', background: 'var(--colore-pericolo-sfondo)' }}>
                            <X size={12} /> Reset
                        </button>
                    )}
                </div>
            </div>

            <TableContainer component={Paper} className="rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: 'var(--colore-sfondo-card)', borderColor: 'var(--colore-bordo)', boxShadow: 'none' }} elevation={0}>
                <Table aria-label="tabella trasferte">
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'var(--colore-sfondo-alt)' }}>
                            {headers.map((h) => (
                                <TableCell key={h} style={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--colore-testo-mutato)', padding: '12px 16px' }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {elementiPagina.map((row) => {
                            const isSelected = selectedId === row.id;
                            return (
                                <TableRow key={row.id} hover onClick={() => onRowClick && onRowClick(row)}
                                    className={onRowClick ? 'cursor-pointer' : ''}
                                    sx={{ '& td': { borderBottom: '1px solid var(--colore-bordo)' }, backgroundColor: isSelected ? 'rgba(30, 58, 138, 0.04) !important' : 'inherit' }}>
                                    {isAdmin && (
                                        <TableCell style={{ ...cellStyle, fontWeight: 600, color: 'var(--colore-testo-principale)' }}>
                                            {row.richiedente || '—'}
                                        </TableCell>
                                    )}
                                    <TableCell style={{ ...cellStyle, fontWeight: 600, color: 'var(--colore-testo-principale)' }}>{row.destinazione}</TableCell>
                                    <TableCell style={cellStyle}>{row.data_inizio?.substring(0, 10)}</TableCell>
                                    <TableCell style={cellStyle}>{row.data_fine?.substring(0, 10)}</TableCell>
                                    <TableCell style={{ ...cellStyle, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.motivo}</TableCell>
                                    <TableCell style={{ padding: '14px 16px' }}>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize border"
                                            style={
                                                row.stato === 'approvata'
                                                    ? { backgroundColor: 'var(--colore-successo-sfondo)', color: 'var(--colore-successo)', borderColor: 'var(--colore-successo)' }
                                                    : row.stato === 'rifiutata'
                                                        ? { backgroundColor: 'var(--colore-pericolo-sfondo)', color: 'var(--colore-pericolo)', borderColor: 'var(--colore-pericolo)' }
                                                        : { backgroundColor: 'var(--colore-avviso-sfondo)', color: 'var(--colore-avviso)', borderColor: 'var(--colore-avviso)' }
                                            }>
                                            {row.stato?.replace('_', ' ')}
                                        </span>
                                    </TableCell>
                                    <TableCell style={{ padding: '14px 16px', width: '50px' }}>
                                        <button onClick={(e) => handleDelete(e, row.id)}
                                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {trasferteFiltrate.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={headers.length} style={{ textAlign: 'center', padding: '32px', color: 'var(--colore-testo-mutato)', fontStyle: 'italic' }}>
                                    {trasferte.length === 0 ? 'Nessuna trasferta trovata.' : 'Nessun risultato per i filtri selezionati.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ControlliPaginazione
                paginaCorrente={paginaCorrente}
                totalePagine={totalePagine}
                vaiAPagina={vaiAPagina}
                totaleElementi={trasferteFiltrate.length}
                righePerPagina={10}
            />
        </div>
    );
}