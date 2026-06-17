import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import { List, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../../store/store';

// 🔥 Aggiunte onRowClick e selectedId
export function TrasferteTable({ trasferte, onRowClick, selectedId }) {
    const { cambiaStatoTrasferta } = useStore();

    // Leggi il ruolo dell'utente loggato per mostrare le colonne giuste
    const utenteCorrente = (() => {
        try { return JSON.parse(localStorage.getItem('utente') || '{}'); }
        catch (_) { return {}; }
    })();
    const isAdmin = utenteCorrente?.ruolo === 'admin';

    // Intestazioni dinamiche: admin vede Richiedente e Azioni
    const headers = isAdmin
        ? ['Richiedente', 'Destinazione', 'Inizio', 'Fine', 'Motivo', 'Stato', 'Azioni']
        : ['Destinazione', 'Inizio', 'Fine', 'Motivo', 'Stato'];

    const cellStyle = {
        color: 'var(--colore-testo-secondario)',
        padding: '14px 16px',
        fontSize: '0.875rem'
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#1e3a8a15' }}>
                    <List size={18} style={{ color: 'var(--colore-primario)' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--colore-testo-principale)' }}>
                    {isAdmin ? 'Gestione Richieste' : 'Le tue richieste'}
                </h2>
            </div>

            <TableContainer
                component={Paper}
                className="rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg"
                style={{
                    backgroundColor: 'var(--colore-sfondo-card)',
                    borderColor: 'var(--colore-bordo)',
                    boxShadow: 'none'
                }}
                elevation={0}
            >
                <Table aria-label="tabella trasferte">
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'var(--colore-sfondo-alt)' }}>
                            {headers.map((h) => (
                                <TableCell key={h} style={{
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: 'var(--colore-testo-mutato)',
                                    padding: '12px 16px'
                                }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {trasferte.map((row) => {
                            // 🔥 Controllo se questa è la riga che ho cliccato
                            const isSelected = selectedId === row.id;

                            return (
                                <TableRow
                                    key={row.id}
                                    hover
                                    onClick={() => onRowClick && onRowClick(row)} // 🔥 Se clicchi, avvisa la Dashboard
                                    className={onRowClick ? "cursor-pointer" : ""} // Mostra la manina
                                    sx={{
                                        '& td': { borderBottom: '1px solid var(--colore-bordo)' },
                                        backgroundColor: isSelected ? 'rgba(30, 58, 138, 0.04) !important' : 'inherit' // 🔥 Colore evidenziato
                                    }}
                                >
                                    {/* Richiedente — solo admin */}
                                    {isAdmin && (
                                        <TableCell style={{ ...cellStyle, fontWeight: 600, color: 'var(--colore-testo-principale)' }}>
                                            {row.richiedente || '—'}
                                        </TableCell>
                                    )}

                                    <TableCell style={{ ...cellStyle, fontWeight: 600, color: 'var(--colore-testo-principale)' }}>
                                        {row.destinazione}
                                    </TableCell>
                                    <TableCell style={cellStyle}>
                                        {row.data_inizio?.substring(0, 10)}
                                    </TableCell>
                                    <TableCell style={cellStyle}>
                                        {row.data_fine?.substring(0, 10)}
                                    </TableCell>

                                    {/* Motivo tagliato per non spaccare il layout (tanto si legge a destra) */}
                                    <TableCell style={{
                                        ...cellStyle,
                                        maxWidth: 160,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {row.motivo}
                                    </TableCell>

                                    <TableCell style={{ padding: '14px 16px' }}>
                                        <span
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize border"
                                            style={
                                                row.stato === 'approvata'
                                                    ? { backgroundColor: 'var(--colore-successo-sfondo)', color: 'var(--colore-successo)', borderColor: 'var(--colore-successo)' }
                                                    : row.stato === 'rifiutata'
                                                        ? { backgroundColor: 'var(--colore-pericolo-sfondo)', color: 'var(--colore-pericolo)', borderColor: 'var(--colore-pericolo)' }
                                                        : { backgroundColor: 'var(--colore-avviso-sfondo)', color: 'var(--colore-avviso)', borderColor: 'var(--colore-avviso)' }
                                            }
                                        >
                                            {row.stato?.replace('_', ' ')}
                                        </span>
                                    </TableCell>

                                    {/* Azioni — solo admin */}
                                    {isAdmin && (
                                        <TableCell style={{ padding: '14px 16px' }}>
                                            <div className="flex gap-2">
                                                <button
                                                    // 🔥 e.stopPropagation() evita che premendo Approva si apra anche il box dei dettagli
                                                    onClick={(e) => { e.stopPropagation(); cambiaStatoTrasferta(row.id, 'approvata'); }}
                                                    title="Approva"
                                                    className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); cambiaStatoTrasferta(row.id, 'rifiutata'); }}
                                                    title="Rifiuta"
                                                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}

                        {trasferte.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={headers.length}
                                    style={{
                                        textAlign: 'center',
                                        padding: '32px',
                                        color: 'var(--colore-testo-mutato)',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    Nessuna trasferta trovata.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}