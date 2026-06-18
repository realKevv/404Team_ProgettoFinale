import React, { useState, useEffect } from "react";
import {
  UserMinus,
  Search,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  Users,
} from "lucide-react";
import { useStore } from "../store/store";

export function RimuoviUtente() {
  // 1. ESTRAZIONE DALLO STORE
  const { utenti, fetchUtenti, deleteUtente } = useStore();

  // 2. CONTROLLO SICUREZZA LATO CLIENT
  const utenteCorrente = JSON.parse(localStorage.getItem("utente") || "{}");
  const isAdmin = utenteCorrente?.ruolo === "admin";

  // 3. STATI LOCALI
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [deletingId, setDeletingId] = useState(null); // ID in corso di eliminazione
  const [confirmId, setConfirmId] = useState(null);   // ID in attesa di conferma

  // 4. CARICA UTENTI AL MONTAGGIO
  useEffect(() => {
    if (isAdmin) fetchUtenti();
  }, [isAdmin]);

  // 5. FILTRA UTENTI PER RICERCA
  const utentiFiltrati = utenti.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.nome_completo?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.ruolo?.toLowerCase().includes(q)
    );
  });

  // 6. ELIMINAZIONE UTENTE
  const handleDelete = async (id, nome) => {
    setDeletingId(id);
    setStatus({ type: null, message: "" });
    try {
      await deleteUtente(id);
      setStatus({ type: "success", message: `Utente "${nome}" eliminato con successo.` });
      setConfirmId(null);
    } catch (err) {
      setStatus({ type: "error", message: err?.message || "Errore durante l'eliminazione." });
    } finally {
      setDeletingId(null);
    }
  };

  // 7. GUARDIA ACCESSO
  if (!isAdmin) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen flex items-center justify-center bg-[var(--colore-sfondo-pagina)]">
        <div className="max-w-md w-full p-6 text-center rounded-2xl border border-[var(--colore-pericolo)] bg-[var(--colore-pericolo-sfondo)] text-[var(--colore-pericolo)] animate-fade-in">
          <AlertCircle className="mx-auto mb-3" size={40} />
          <h2 className="text-xl font-bold mb-1">Accesso Negato</h2>
          <p className="text-sm opacity-90">Questa sezione è riservata esclusivamente agli amministratori del sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen font-[var(--font-principale)] bg-[var(--colore-sfondo-pagina)] text-[var(--colore-testo-principale)]">

      {/* HEADER */}
      <div className="page-header flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#7f1d1d20]">
          <UserMinus size={22} className="text-[var(--colore-pericolo)]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestione Personale</h1>
          <p className="text-sm text-[var(--colore-testo-mutato)]">Cerca e rimuovi un profilo dipendente dal database aziendale</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* BARRA DI RICERCA */}
        <div className="relative group p-6 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] shadow-md">
          <div className="border-b pb-4 mb-5" style={{ borderColor: "var(--colore-bordo)" }}>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users size={18} className="text-[var(--colore-primario)]" />
              Cerca Dipendente da Rimuovere
            </h2>
          </div>

          {/* Messaggio di stato */}
          {status.type && (
            <div className={`p-4 mb-5 rounded-xl border flex items-start gap-3 animate-fade-in ${
              status.type === "success"
                ? "bg-[var(--colore-successo-sfondo)] border-[var(--colore-successo)] text-[var(--colore-successo)]"
                : "bg-[var(--colore-pericolo-sfondo)] border-[var(--colore-pericolo)] text-[var(--colore-pericolo)]"
            }`}>
              {status.type === "success"
                ? <CheckCircle size={20} className="shrink-0" />
                : <AlertCircle size={20} className="shrink-0" />}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          {/* Input di ricerca */}
          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--colore-testo-secondario)]" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca per nome, email o ruolo..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-[var(--colore-sfondo-card)] border border-[var(--colore-bordo)] rounded-xl focus:outline-none focus:border-[var(--colore-primario-luce)] focus:ring-2 focus:ring-[var(--colore-primario-luce)]/20 transition-all text-[var(--colore-testo-principale)]"
            />
          </div>

          {/* LISTA UTENTI */}
          <div className="flex flex-col gap-3">
            {utentiFiltrati.length === 0 ? (
              <p className="text-center text-sm text-[var(--colore-testo-mutato)] py-6">
                {search ? "Nessun utente trovato per questa ricerca." : "Nessun utente disponibile."}
              </p>
            ) : (
              utentiFiltrati.map((u) => {
                const isSelf = u.id === utenteCorrente?.id;
                const isConfirming = confirmId === u.id;
                const isDeleting = deletingId === u.id;

                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 ${
                      isConfirming
                        ? "border-[var(--colore-pericolo)] bg-[var(--colore-pericolo-sfondo)]"
                        : "border-[var(--colore-bordo)] bg-[var(--colore-sfondo-alt)] hover:border-[var(--colore-bordo)]"
                    }`}
                  >
                    {/* Avatar e dati utente */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase shrink-0"
                        style={{ backgroundColor: u.ruolo === "admin" ? "var(--colore-avvertimento)" : "var(--colore-primario)" }}>
                        {u.nome_completo?.charAt(0) || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{u.nome_completo}</p>
                        <p className="text-xs text-[var(--colore-testo-mutato)] truncate">{u.email}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                        u.ruolo === "admin"
                          ? "bg-[var(--colore-avvertimento-sfondo)] text-[var(--colore-avvertimento)]"
                          : "bg-[var(--colore-primario-sfondo)] text-[var(--colore-primario)]"
                      }`}>
                        {u.ruolo === "admin" ? <Shield size={10} /> : <User size={10} />}
                        {u.ruolo}
                      </span>
                    </div>

                    {/* Azioni */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isSelf ? (
                        <span className="text-xs text-[var(--colore-testo-mutato)] italic">Account corrente</span>
                      ) : isConfirming ? (
                        <>
                          <button
                            onClick={() => setConfirmId(null)}
                            disabled={isDeleting}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--colore-bordo)] text-[var(--colore-testo-principale)] hover:bg-[var(--colore-sfondo-alt)] transition-all disabled:opacity-60"
                          >
                            Annulla
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, u.nome_completo)}
                            disabled={isDeleting}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--colore-pericolo)] text-white hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isDeleting
                              ? <><Loader2 size={12} className="animate-spin" /> Eliminando...</>
                              : <><Trash2 size={12} /> Conferma</>
                            }
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmId(u.id)}
                          className="p-2 rounded-lg text-[var(--colore-pericolo)] hover:bg-[var(--colore-pericolo-sfondo)] transition-all"
                          title={`Elimina ${u.nome_completo}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RimuoviUtente;
