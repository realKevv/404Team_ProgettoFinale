import React, { useState } from "react";
// Importiamo le icone da lucide-react coerenti con il design system della dashboard
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
// Connessione allo store centralizzato di Zustand
import { useStore } from "../store/store";

export function AggiungiUtente() {
  // 1. EXTRAZIONE AZIONI DALLO STORE GLOBAL
  // Estraiamo la funzione addUtente che abbiamo appena aggiunto nello store globale
  const { addUtente } = useStore();
  
  // 2. CONTROLLO DI SICUREZZA LATO CLIENT
  // Recuperiamo i dati dell'utente loggato dal localStorage per verificare se ha i permessi
  const utenteCorrente = JSON.parse(localStorage.getItem("utente") || "{}");
  // Verifichiamo se il ruolo è esplicitamente "admin"
  const isAdmin = utenteCorrente?.ruolo === "admin";

  // 3. STATI LOCALI DEL COMPONENTE
  // Stato per raccogliere i dati inseriti nei campi del modulo (form)
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    password: "",
    ruolo: "user", // Valore di default iniziale come da specifiche aziendali
  });

  // Stati di supporto per gestire l'esperienza utente
  const [showPassword, setShowPassword] = useState(false); // Controlla la visibilità del testo della password
  const [isSubmitting, setIsSubmitting] = useState(false);   // Gestisce lo stato di caricamento durante l'invio
  const [status, setStatus] = useState({ type: null, message: "" }); // Gestisce i messaggi di successo o errore ('success' | 'error')

  // 4. GESTORE UNIVERSALE INPUT (HANDLERS)
  // Questa funzione si attiva ogni volta che l'utente scrive in un campo del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Aggiorna dinamicamente la proprietà corretta dentro l'oggetto formData
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. INVIO DEI DATI AL DATABASE (SUBMIT)
  // Questa funzione gestisce l'invio del form quando si clicca sul bottone
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impedisce il caricamento predefinito della pagina del browser
    setIsSubmitting(true); // Attiva lo spinner di caricamento sul bottone
    setStatus({ type: null, message: "" }); // Resetta eventuali messaggi di errore/successo precedenti

    // Validazione preventiva lato client: controlla che i campi non siano vuoti o composti da soli spazi
    if (!formData.nome_completo.trim() || !formData.email.trim() || !formData.password.trim()) {
      setStatus({ type: "error", message: "Tutti i campi sono obbligatori." });
      setIsSubmitting(false); // Spegne il caricamento
      return; // Interrompe l'esecuzione della funzione
    }

    try {
      // Invochiamo l'azione asincrona dello store Zustand passando l'oggetto con i dati
      await addUtente(formData);
      
      // Se l'operazione va a buon fine, mostriamo il messaggio di successo definitivo
      setStatus({ 
        type: "success", 
        message: `Utente "${formData.nome_completo}" creato con successo come ${formData.ruolo}!` 
      });
      
      // Resettiamo i campi del form per permettere l'inserimento di un nuovo dipendente
      setFormData({
        nome_completo: "",
        email: "",
        password: "",
        ruolo: "user",
      });
    } catch (err) {
      // Se il server restituisce un errore (es: Email duplicata), lo catturiamo e lo mostriamo
      setStatus({ 
        type: "error", 
        message: err?.message || "Errore durante la creazione dell'utente. Riprova." 
      });
    } finally {
      setIsSubmitting(false); // In ogni caso (successo o errore), spegniamo lo spinner di caricamento
    }
  };

  // 6. BLOCCO DI SICUREZZA (GUARDIA)
  // Se l'utente NON è un amministratore, interrompiamo il rendering normale e mostriamo la schermata di Accesso Negato
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

  // 7. RENDERING DELLA PAGINA PER GLI ADMIN
  return (
    <div className="add-user-page flex-1 p-4 sm:p-6 lg:p-8 min-h-screen font-[var(--font-principale)] bg-[var(--colore-sfondo-pagina)] text-[var(--colore-testo-principale)]">
      
      {/* HEADER DELLA PAGINA (Titolo principale e icona in stile Dashboard) */}
      <div className="page-header flex items-center gap-3 mb-8">
        {/* Contenitore icona con effetto vetro azzurrato */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1e3a8a15]">
          <UserPlus size={22} className="text-[var(--colore-primario)]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestione Personale</h1>
          <p className="text-sm text-[var(--colore-testo-mutato)]">Crea e registra un nuovo profilo dipendente nel database aziendale</p>
        </div>
      </div>

      {/* CONTENITORE CENTRALE DEL MODULO */}
      <div className="max-w-2xl mx-auto">
        {/* Card con ombra morbida ed effetto di sollevamento al passaggio del mouse (hover) */}
        <div className="relative group p-6 sm:p-8 rounded-2xl border bg-[var(--colore-sfondo-card)] border-[var(--colore-bordo)] shadow-md hover:shadow-lg transition-all duration-300">
          
          {/* Sotto-intestazione interna della card */}
          <div className="border-b pb-4 mb-6" style={{ borderColor: "var(--colore-bordo)" }}>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Shield size={18} className="text-[var(--colore-secondario)]" />
              Dati Identificativi Nuovo Account
            </h2>
          </div>

          {/* BANNER DINAMICO PER ERRORI O SUCCESSI */}
          {status.type && (
            <div className={`p-4 mb-6 rounded-xl border flex items-start gap-3 animate-fade-in ${
              status.type === "success" 
                ? "bg-[var(--colore-successo-sfondo)] border-[var(--colore-successo)] text-[var(--colore-successo)]" 
                : "bg-[var(--colore-pericolo-sfondo)] border-[var(--colore-pericolo)] text-[var(--colore-pericolo)]"
            }`}>
              {/* Mostra l'icona di spunta se successo, o di allerta se errore */}
              {status.type === "success" ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          {/* FORM DI INSERIMENTO DATI */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Campo: Nome Completo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[var(--colore-testo-mutato)]">Nome e Cognome</label>
              <div className="relative">
                {/* Icona posizionata all'interno del campo di testo */}
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--colore-testo-secondario)]" size={18} />
                <input
                  type="text"
                  name="nome_completo"
                  value={formData.nome_completo}
                  onChange={handleChange}
                  placeholder="es. Mario Rossi"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-[var(--colore-sfondo-card)] border border-[var(--colore-bordo)] rounded-xl focus:outline-none focus:border-[var(--colore-primario-luce)] focus:ring-2 focus:ring-[var(--colore-primario-luce)]/20 transition-all text-[var(--colore-testo-principale)] disabled:opacity-60"
                />
              </div>
            </div>

            {/* Campo: Email Aziendale */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[var(--colore-testo-mutato)]">Email Aziendale</label>
              <div className="relative">
                {/* Icona della busta delle lettere interna */}
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--colore-testo-secondario)]" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="es. mario.rossi@azienda.com"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-[var(--colore-sfondo-card)] border border-[var(--colore-bordo)] rounded-xl focus:outline-none focus:border-[var(--colore-primario-luce)] focus:ring-2 focus:ring-[var(--colore-primario-luce)]/20 transition-all text-[var(--colore-testo-principale)] disabled:opacity-60"
                />
              </div>
            </div>

            {/* Griglia a due colonne (affiancate su desktop, incolonnate su smartphone) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Campo: Password d'Accesso (Aggiornato: Definitiva decisa dall'admin) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[var(--colore-testo-mutato)]">
                  Password d'Accesso
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--colore-testo-secondario)]" size={18} />
                  <input
                    type={showPassword ? "text" : "password"} // Cambia tipo per mostrare o nascondere i caratteri
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Inserisci la password per l'utente"
                    disabled={isSubmitting}
                    className="w-full pl-11 pr-11 py-2.5 text-sm bg-[var(--colore-sfondo-card)] border border-[var(--colore-bordo)] rounded-xl focus:outline-none focus:border-[var(--colore-primario-luce)] focus:ring-2 focus:ring-[var(--colore-primario-luce)]/20 transition-all text-[var(--colore-testo-principale)] disabled:opacity-60"
                  />
                  {/* Bottone interattivo per mostrare/nascondere la password inserita */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--colore-testo-mutato)] hover:text-[var(--colore-testo-principale)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Campo: Menù a tendina Selezione Ruolo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-[var(--colore-testo-mutato)]">Ruolo Applicativo</label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--colore-testo-secondario)]" size={18} />
                  <select
                    name="ruolo"
                    value={formData.ruolo}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-[var(--colore-sfondo-card)] border border-[var(--colore-bordo)] rounded-xl focus:outline-none focus:border-[var(--colore-primario-luce)] focus:ring-2 focus:ring-[var(--colore-primario-luce)]/20 transition-all text-[var(--colore-testo-principale)] disabled:opacity-60 appearance-none cursor-pointer"
                  >
                    <option value="user">User (Dipendente standard)</option>
                    <option value="admin">Admin (HR / Responsabile)</option>
                  </select>
                  {/* Freccetta personalizzata per il menù a tendina (sovrascrive quella nativa brutta dei browser) */}
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--colore-testo-mutato)] text-xs">
                    ▼
                  </div>
                </div>
              </div>

            </div>

            {/* BOTTONE DI AZIONE E SOTTOMISSIONE (SUBMIT) */}
            <div className="pt-4 border-t" style={{ borderColor: "var(--colore-bordo)" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-[var(--colore-primario)] hover:bg-[var(--colore-primario-luce)] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {/* Mostra lo spinner animato se la richiesta è in corso, altrimenti mostra il testo normale */}
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Registrazione nel database...
                  </>
                ) : (
                  <>
                    Crea Nuovo Profilo
                    {/* Icona freccia che si sposta a destra di 0.5px in hover grazie alla classe group-hover */}
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AggiungiUtente;