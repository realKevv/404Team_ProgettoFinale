import React, { useState, useEffect } from "react";
// Importiamo le icone per l'interfaccia. 'Lucide-react' è ottima perché le icone sono leggere e personalizzabili
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
// Importiamo lo store globale (Zustand) per accedere ai dati condivisi in tutta l'app
import { useStore } from "../store/store";

export function RimuoviUtente() {
  
  // ESTRAZIONE DALLO STORE
  // 'utenti': l'array completo degli utenti nel database
  // 'fetchUtenti': funzione per scaricare gli utenti dal server
  // 'deleteUtente': funzione per eliminare fisicamente un utente
  const { utenti, fetchUtenti, deleteUtente } = useStore();

  // CONTROLLO SICUREZZA LATO CLIENT
  const utenteCorrente = JSON.parse(sessionStorage.getItem("utente") || "{}");
  const isAdmin = utenteCorrente?.ruolo === "admin";

  // STATI LOCALI DEL COMPONENTE
  const [search, setSearch] = useState(""); // Testo digitato nella barra di ricerca
  const [status, setStatus] = useState({ type: null, message: "" }); // Gestione banner (successo/errore)
  
  // DOPPIA CONFERMA:
  // Invece del popup del browser (alert), gestiamo tutto nell'interfaccia:
  const [confirmId, setConfirmId] = useState(null);   // Quale utente stiamo per confermare di voler eliminare
  const [deletingId, setDeletingId] = useState(null); // Per quale utente sta girando la rotellina di caricamento

  // CARICAMENTO DATI AL MONTAGGIO
  // useEffect scatta appena la pagina viene caricata. Se l'utente è admin, scarica la lista aggiornata.
  useEffect(() => {
    if (isAdmin) fetchUtenti();
  }, [isAdmin]);

  // MOTORE DI RICERCA INTERNO
  // Filtriamo la lista utenti IN TEMPO REALE mentre l'utente digita
  const utentiFiltrati = utenti.filter((u) => {
    const q = search.toLowerCase(); // Trasformiamo tutto in minuscolo per una ricerca "case-insensitive"
    return (
      // Cerca corrispondenze nel nome, nell'email o nel ruolo
      u.nome_completo?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.ruolo?.toLowerCase().includes(q)
    );
  });

  // FUNZIONE DI ELIMINAZIONE DEFINITIVA
  // ==========================================
  const handleDelete = async (id, nome) => {
    setDeletingId(id); // Attiva lo spinner di caricamento solo sul bottone di QUESTO specifico utente
    setStatus({ type: null, message: "" }); // Resetta vecchi messaggi
    
    try {
      await deleteUtente(id); // Chiamata al server/database
      
      // Se va a buon fine:
      setStatus({ type: "success", message: `Utente "${nome}" eliminato con successo.` });
      setConfirmId(null); // Chiude la modale/interfaccia di conferma

      // Fai sparire il banner di successo dopo 4 secondi
      setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 4000);

    } catch (err) {
      // Se c'è un errore (es. server offline):
      setStatus({ type: "error", message: err?.message || "Errore durante l'eliminazione." });

      // Fai sparire il banner di errore dopo 4 secondi
      setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 4000);

    } finally {
      setDeletingId(null); // Spegne lo spinner di caricamento in ogni caso
    }
  };

  // GUARDIA: SCHERMATA ACCESSO NEGATO
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

  // INTERFACCIA PRINCIPALE ADMIN
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen font-[var(--font-principale)] bg-[var(--colore-sfondo-pagina)] text-[var(--colore-testo-principale)]">

      {/* HEADER DELLA PAGINA */}
      <div className="page-header flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#7f1d1d20]">
          <UserMinus size={22} className="text-[var(--colore-pericolo)]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestione Personale</h1>
          <p className="text-sm text-[var(--colore-testo-mutato)]">Cerca e rimuovi un profilo dipendente dal database aziendale</p>
        </div>
      </div>

      {/* CONTENITORE PRINCIPALE DELLA SCHEDA */}
      {/* space-y-6: distanzia automaticamente tutti i figli diretti di questo div di 24px l'uno dall'altro */}
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="relative group p-6 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] shadow-md">
          
          {/* Titolo interno alla card */}
          <div className="border-b pb-4 mb-5" style={{ borderColor: "var(--colore-bordo)" }}>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users size={18} className="text-[var(--colore-primario)]" />
              Cerca Dipendente da Rimuovere
            </h2>
          </div>

          {/* BANNER DINAMICO (Successo / Errore) */}
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

          {/* BARRA DI RICERCA */}
          <div className="relative mb-5">
            {/* L'icona è in posizione assoluta (absolute) rispetto al div contenitore, così "galleggia" sopra l'input */}
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--colore-testo-secondario)]" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca per nome, email o ruolo..."
              // pl-11: Padding Left di 44px per evitare che il testo finisca sotto l'icona della lente d'ingrandimento
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-[var(--colore-sfondo-card)] border border-[var(--colore-bordo)] rounded-xl focus:outline-none focus:border-[var(--colore-primario-luce)] focus:ring-2 focus:ring-[var(--colore-primario-luce)]/20 transition-all text-[var(--colore-testo-principale)]"
            />
          </div>

          {/* LISTA DEGLI UTENTI FILTRATI */}
          <div className="flex flex-col gap-3">
            {/* Controllo: la ricerca ha prodotto risultati? */}
            {utentiFiltrati.length === 0 ? (
              <p className="text-center text-sm text-[var(--colore-testo-mutato)] py-6">
                {search ? "Nessun utente trovato per questa ricerca." : "Nessun utente disponibile."}
              </p>
            ) : (
              // Se ci sono risultati, li cicliamo uno per uno per generare le righe
              utentiFiltrati.map((u) => {
                // Controlli per l'interfaccia condizionale:
                const isSelf = u.id === utenteCorrente?.id;   // Questo utente sono "io"? (Non posso eliminarmi da solo)
                const isConfirming = confirmId === u.id;      // Ho cliccato "cestino" su questo utente e attende conferma?
                const isDeleting = deletingId === u.id;       // L'eliminazione è in corso in questo preciso istante?

                return (
                  // Il colore di sfondo e il bordo della riga cambiano se l'utente è "in fase di conferma eliminazione"
                  <div
                    key={u.id}
                    className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 ${
                      isConfirming
                        ? "border-[var(--colore-pericolo)] bg-[var(--colore-pericolo-sfondo)]" // Stile ROSSO allarme
                        : "border-[var(--colore-bordo)] bg-[var(--colore-sfondo-alt)] hover:border-[var(--colore-bordo)]" // Stile NORMALE
                    }`}
                  >
                    {/* ZONA SINISTRA: Avatar e Dati Utente */}
                    {/* min-w-0: FONDAMENTALE in flexbox per permettere al testo interno di usare la classe 'truncate' senza sfondare il layout */}
                    <div className="flex items-center gap-3 min-w-0">
                      
                      {/* Avatar Circolare */}
                      {/* shrink-0: Impedisce all'avatar di diventare ovale o rimpicciolirsi se c'è poco spazio sullo schermo */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase shrink-0"
                        style={{ backgroundColor: u.ruolo === "admin" ? "var(--colore-avvertimento)" : "var(--colore-primario)" }}>
                        {/* Prende la prima lettera del nome, se non c'è mette un "?" */}
                        {u.nome_completo?.charAt(0) || "?"}
                      </div>

                      {/* Nome ed Email */}
                      <div className="min-w-0">
                        {/* truncate: Se il nome è lunghissimo, lo taglia aggiungendo i "..." (es. "Mario Rossi di..." ) */}
                        <p className="text-sm font-semibold truncate">{u.nome_completo}</p>
                        <p className="text-xs text-[var(--colore-testo-mutato)] truncate">{u.email}</p>
                      </div>

                      {/* Etichetta (Badge) del Ruolo */}
                      <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                        u.ruolo === "admin"
                          ? "bg-[var(--colore-avvertimento-sfondo)] text-[var(--colore-avvertimento)]" // Giallo se admin
                          : "bg-[var(--colore-primario-sfondo)] text-[var(--colore-primario)]" // Blu se user
                      }`}>
                        {u.ruolo === "admin" ? <Shield size={10} /> : <User size={10} />}
                        {u.ruolo}
                      </span>
                    </div>

                    {/* ZONA DESTRA: Bottoni d'Azione */}
                    <div className="flex items-center gap-2 shrink-0">
                      
                      {/* CASO 1: È il mio stesso account -> Nascondo i bottoni e mostro una scritta */}
                      {isSelf ? (
                        <span className="text-xs text-[var(--colore-testo-mutato)] italic">Account corrente</span>
                      
                      // CASO 2: Ho cliccato il cestino -> Mostro i bottoni "Annulla" e "Conferma" 
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
                            {/* Se sto elaborando l'eliminazione mostro la rotellina, altrimenti l'icona del cestino */}
                            {isDeleting
                              ? <><Loader2 size={12} className="animate-spin" /> Eliminando...</>
                              : <><Trash2 size={12} /> Conferma</>
                            }
                          </button>
                        </>

                      // CASO 3: Stato normale -> Mostro solo l'icona del cestino classica
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