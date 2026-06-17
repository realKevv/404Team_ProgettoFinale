import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import { Users, Building2, Plane, X, Calendar, FileText, Info } from 'lucide-react';
import { useStore } from '../store/store'; // 🔥 Verifica che il percorso sia coerente con il tuo store

export function DipendentiPage() {
    const { utenti, trasferte, isLoading, fetchUtenti, fetchTrasferte } = useStore();

    // 🔥 STATO PER L'UTENTE SELEZIONATO
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUtenti();
        fetchTrasferte();
    }, [fetchUtenti, fetchTrasferte]);

    // 🧠 INCROCIAMO I DATI: Aggiungiamo anche data_inizio e motivo!
    const dipendentiConStato = utenti.map(utente => {
        const trasfertaAttiva = trasferte.find(
            t => t.id_utente === utente.id && t.stato === 'approvata'
        );

        return {
            ...utente,
            inTrasferta: !!trasfertaAttiva,
            destinazione: trasfertaAttiva ? trasfertaAttiva.destinazione : 'Sede Centrale',
            inizio: trasfertaAttiva ? trasfertaAttiva.data_inizio.substring(0, 10) : '-',
            ritorno: trasfertaAttiva ? trasfertaAttiva.data_fine.substring(0, 10) : '-',
            motivo: trasfertaAttiva ? trasfertaAttiva.motivo : 'Nessuna trasferta attiva per questo dipendente.'
        };
    });

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
                    <p className="text-sm text-[var(--colore-testo-mutato)]">Clicca su un collega per vedere i dettagli della sua trasferta</p>
                </div>
            </div>

            {/* 🔥 GRIGLIA DINAMICA: Se c'è un utente selezionato si divide in 2/3 e 1/3 */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">

                {/* COLONNA TABELLA */}
                <div className={selectedUser ? "xl:col-span-2 transition-all duration-300" : "xl:col-span-3 transition-all duration-300"}>
                    <TableContainer
                        component={Paper}
                        className="rounded-2xl overflow-hidden border bg-[var(--colore-sfondo-card)]"
                        elevation={0}
                        style={{ borderColor: "var(--colore-bordo)", boxShadow: "none" }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: "var(--colore-sfondo-alt)" }}>
                                    {["Dipendente", "Ruolo", "Status", "Posizione corrente"].map((header, i) => (
                                        <TableCell key={i} style={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", color: "var(--colore-testo-mutato)", padding: "12px 16px" }}>
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {dipendentiConStato.map((dipendente) => {
                                    const isSelected = selectedUser?.id === dipendente.id;
                                    return (
                                        <TableRow
                                            key={dipendente.id}
                                            hover
                                            onClick={() => setSelectedUser(dipendente)} // 🔥 CLICCABILE!
                                            className="cursor-pointer"
                                            sx={{
                                                '& td': { borderBottom: '1px solid var(--colore-bordo)' },
                                                backgroundColor: isSelected ? 'rgba(30, 58, 138, 0.04) !important' : 'inherit'
                                            }}
                                        >
                                            {/* NOME */}
                                            <TableCell style={{ padding: "14px 16px" }}>
                                                <div className="font-semibold text-[var(--colore-testo-principale)]">{dipendente.nome_completo}</div>
                                                <div className="text-xs text-[var(--colore-testo-mutato)]">{dipendente.email}</div>
                                            </TableCell>

                                            {/* RUOLO */}
                                            <TableCell style={{ padding: "14px 16px", textTransform: "capitalize", color: "var(--colore-testo-secondario)" }}>
                                                {dipendente.ruolo}
                                            </TableCell>

                                            {/* STATUS */}
                                            <TableCell style={{ padding: "14px 16px" }}>
                                                {dipendente.inTrasferta ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                                                        <Plane size={12} /> In Trasferta
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                                        <Building2 size={12} /> In Ufficio
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* POSIZIONE */}
                                            <TableCell style={{ padding: "14px 16px", color: "var(--colore-testo-principale)", fontWeight: 500 }}>
                                                {dipendente.destinazione}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {/* 🔥 COLONNA DETTAGLI COMPONENTE (Appare solo se selezioni qualcuno) */}
                {selectedUser && (
                    <div className="xl:col-span-1 p-6 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] shadow-md flex flex-col gap-5 animate-fade-in">

                        {/* Header Pannello */}
                        <div className="flex justify-between items-start border-b pb-4" style={{ borderColor: "var(--colore-bordo)" }}>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1e3a8a10]">
                                    <Info size={18} className="text-[var(--colore-primario)]" />
                                </div>
                                <h2 className="text-lg font-bold text-[var(--colore-testo-principale)]">Dettagli Collega</h2>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-1 rounded-lg hover:bg-gray-100 text-[var(--colore-testo-mutato)] transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Anagrafica */}
                        <div>
                            <h3 className="text-xl font-bold text-[var(--colore-testo-principale)]">{selectedUser.nome_completo}</h3>
                            <p className="text-sm text-[var(--colore-testo-mutato)]">{selectedUser.email}</p>
                            <p className="text-xs uppercase font-bold mt-1 tracking-wider text-[var(--colore-primario)]">{selectedUser.ruolo}</p>
                        </div>

                        {/* Info Tempistiche (Solo se è in trasferta) */}
                        {selectedUser.inTrasferta ? (
                            <>
                                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wide text-blue-700 flex items-center gap-1">
                                        <Calendar size={14} /> Periodo Viaggio
                                    </span>
                                    <div className="text-sm font-medium text-slate-700 flex justify-between">
                                        <span>Partenza: <b>{selectedUser.inizio}</b></span>
                                        <span>Rientro: <b>{selectedUser.ritorno}</b></span>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-gray-50 border border-[var(--colore-bordo)] flex flex-col gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wide text-[var(--colore-testo-mutato)] flex items-center gap-1">
                                        <FileText size={14} /> Motivo della Trasferta
                                    </span>
                                    <p className="text-sm text-[var(--colore-testo-secondario)] leading-relaxed italic">
                                        "{selectedUser.motivo}"
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="p-4 rounded-xl bg-gray-50 text-center border border-dashed border-[var(--colore-bordo)] text-[var(--colore-testo-mutato)] text-sm">
                                <Building2 size={24} className="mx-auto mb-2 text-gray-400" />
                                Il dipendente lavora regolarmente presso la Sede Centrale.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}