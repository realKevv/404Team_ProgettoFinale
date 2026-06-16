import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import { List } from 'lucide-react';

export function TrasferteTable({ trasferte }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1e3a8a15" }}>
                    <List size={18} style={{ color: "var(--colore-primario)" }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: "var(--colore-testo-principale)" }}>
                    Le tue richieste
                </h2>
            </div>

            <TableContainer
                component={Paper}
                className="rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg"
                style={{
                    backgroundColor: "var(--colore-sfondo-card)",
                    borderColor: "var(--colore-bordo)",
                    boxShadow: "none"
                }}
                elevation={0}
            >
                <Table aria-label="tabella trasferte">
                    <TableHead>
                        <TableRow style={{ backgroundColor: "var(--colore-sfondo-alt)" }}>
                            {["Destinazione", "Inizio", "Fine", "Tipo Rimborso", "Stato"].map((header) => (
                                <TableCell
                                    key={header}
                                    style={{
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        color: "var(--colore-testo-mutato)",
                                        borderBottom: `1px solid var(--colore-bordo)`,
                                        padding: "12px 16px"
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {trasferte.map((row) => (
                            <TableRow
                                key={row.id}
                                hover
                                sx={{
                                    '&:hover': { backgroundColor: 'var(--colore-sfondo-alt)' },
                                    transition: 'background-color 0.15s ease',
                                    '& td': { borderBottom: '1px solid var(--colore-bordo)' }
                                }}
                            >
                                <TableCell style={{ fontWeight: 600, color: "var(--colore-testo-principale)", padding: "14px 16px", fontSize: "0.875rem" }}>
                                    {row.destinazione}
                                </TableCell>
                                {/* Sincronizzato con data_inizio del DB */}
                                <TableCell style={{ color: "var(--colore-testo-secondario)", padding: "14px 16px", fontSize: "0.875rem" }}>
                                    {row.data_inizio ? row.data_inizio.substring(0, 10) : ''}
                                </TableCell>
                                {/* Sincronizzato con data_fine del DB */}
                                <TableCell style={{ color: "var(--colore-testo-secondario)", padding: "14px 16px", fontSize: "0.875rem" }}>
                                    {row.data_fine ? row.data_fine.substring(0, 10) : ''}
                                </TableCell>
                                {/* Sincronizzato con motivo del DB (sostituisce il rimborso che non esiste nella tabella trasferte) */}
                                <TableCell style={{ color: "var(--colore-testo-secondario)", padding: "14px 16px", fontSize: "0.875rem", maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {row.motivo}
                                </TableCell>
                                <TableCell style={{ padding: "14px 16px" }}>
                                    {/* Gestione degli stati del DB: 'approvata', 'in_attesa', 'rifiutata' */}
                                    <span
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize border"
                                        style={
                                            row.stato === 'approvata'
                                                ? { backgroundColor: "var(--colore-successo-sfondo)", color: "var(--colore-successo)", borderColor: "var(--colore-successo)" }
                                                : row.stato === 'rifiutata'
                                                    ? { backgroundColor: "var(--colore-pericolo-sfondo)", color: "var(--colore-pericolo)", borderColor: "var(--colore-pericolo)" }
                                                    : { backgroundColor: "var(--colore-avviso-sfondo)", color: "var(--colore-avviso)", borderColor: "var(--colore-avviso)" }
                                        }
                                    >
                                        {row.stato ? row.stato.replace('_', ' ') : 'in attesa'}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}