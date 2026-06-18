// Importiamo React e gli Hook fondamentali per gestire lo stato locale e i cicli di vita dei componenti
import React, { useState, useEffect } from "react";
// Importiamo le icone da Lucide React per rappresentare l'utente, i contatori e i dettagli geometrici delle mete
import {
  UserCircle,
  Mail,
  Shield,
  MapPin,
  Plane,
  Compass,
  Award,
  Search,
  Building2,
  Globe,
  Milestone,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
} from "lucide-react";
// Importiamo l'hook del global store centralizzato per connettere la pagina ai dati reali dell'applicazione
import { useStore } from "../store/store";
// Importiamo l'hook personalizzato del tema per gestire la modalità chiara/scura
import { useTheme } from "../context/ThemeContext";

// Esportiamo la pagina del Profilo Utente come Named Export per renderla importabile nel Router principale
export function ProfiloUtente() {
  // Leggiamo l'utente reale loggato nella sessione attuale decodificando la stringa JSON salvata nel browser
  const utente = JSON.parse(localStorage.getItem("utente") || "null");

  // Prendiamo lo stato delle trasferte, la funzione di scaricamento (fetch) e lo stato di caricamento dallo Store globale
  const { trasferte, fetchTrasferte, isLoading } = useStore();

  // Estraiamo lo stato del tema e la funzione per alternarlo dall'hook globale useTheme
  const { isDark, toggleTema } = useTheme();

  // NUOVI STATI LOCALI:
  // Stato di tipo stringa per memorizzare in tempo reale i caratteri digitati dall'utente nella barra di ricerca
  const [ricerca, setRicerca] = useState("");
  // Stato booleano per controllare se espandere la griglia e mostrare tutte le card o limitarle a 4
  const [mostraTutti, setMostraTutti] = useState(false);

  // Carichiamo le trasferte dal server non appena la pagina si apre (al mount del componente)
  useEffect(() => {
    fetchTrasferte();
  }, [fetchTrasferte]); // Includiamo fetchTrasferte nelle dipendenze per garantire la stabilità dell'effetto

  // Prendo i viaggi dell'utente corrente e li ordino dal più recente al più vecchio. Se l'utente non è loggato, sarà un array vuoto.
  const trasferteUtente = utente
    ? trasferte
        // Scorro la lista di tutte le trasferte e filtro solo quelle che contengono l'id dell'utente loggato
        .filter((t) => t.id_utente === utente.id)
        .sort((a, b) => {
          // Controlla se il viaggio ha una data valida, altrimenti assegna una data molto vecchia (new Date(0) = 1970) per posizionarlo in fondo
          const dataA = a.data_inizio ? new Date(a.data_inizio) : new Date(0);
          const dataB = b.data_inizio ? new Date(b.data_inizio) : new Date(0);
          // Ordino la data in maniera decrescente, quindi i viaggi più recenti appaiono prima.
          // Se il risultato della sottrazione è positivo, l'elemento viene spostato prima; se è negativo, viene spostato dopo.
          return dataB - dataA;
        })
    : [];

  // RAGGRUPPAMENTO, CASE-INSENSITIVITY E NORMALIZZAZIONE DELLE DESTINAZIONI (Dati reali dal DB)
  // Creo un oggetto vuoto per contare quante volte l'utente ha visitato ogni specifica destinazione
  const regioniVisitate = {};

  // Il forEach prende la lista dei viaggi dell'utente ed esegue la pulizia e il conteggio di ogni singola tappa
  trasferteUtente.forEach((trasferta) => {
    // Cerca se nella trasferta esiste la regione, altrimenti prendi la destinazione, altrimenti assegna "Non specificata"
    let nomeLuogo =
      trasferta.regione || trasferta.destinazione || "Non specificata";

    // SOLUZIONE ACCENTI, SPAZI E MAIUSCOLE:
    // Eliminiamo eventuali spazi vuoti digitati per errore all'inizio o alla fine del testo (es: "torino " diventa "torino")
    nomeLuogo = nomeLuogo.trim();
    if (nomeLuogo !== "Non specificata") {
      // Dividiamo la stringa in parole, trasformiamo la prima lettera in Maiuscola e le altre in Minuscolo, poi riuniamo tutto.
      // Questo sistema unifica istantaneamente "torino", "TORINO" e "toRiNo" sotto l'unica chiave corretta "Torino".
      nomeLuogo = nomeLuogo
        .split(/\s+/)
        .map(
          (parola) =>
            parola.charAt(0).toUpperCase() + parola.slice(1).toLowerCase(),
        )
        .join(" ");
    }

    // Controlla se la destinazione normalizzata è già presente nell'oggetto: se non c'è, inizializza il contatore a 0.
    if (!regioniVisitate[nomeLuogo]) {
      regioniVisitate[nomeLuogo] = 0;
    }
    // Incrementa di 1 il contatore dei viaggi per questa specifica città
    regioniVisitate[nomeLuogo]++;
  });

  // Object.entries prende l'oggetto regioniVisitate e lo trasforma in un array di coppie [chiave, valore] (es: [["Torino", 4], ["Milano", 2]])
  // Subito dopo ordiniamo l'array in base al numero di visite, così le mete più frequentate appariranno per prime nella pagina
  const regioni = Object.entries(regioniVisitate).sort((a, b) => b[1] - a[1]);

  // FILTRO DI RICERCA:
  // Filtriamo l'intero array delle destinazioni confrontando i testi in minuscolo per trovare corrispondenze parziali in tempo reale
  const regioniFiltrate = regioni.filter(([nomeLuogo]) =>
    nomeLuogo.toLowerCase().includes(ricerca.toLowerCase()),
  );

  // LIMITAZIONE CARD (PAGINAZIONE):
  // Definiamo una costante per mostrare inizialmente solo 4 card per evitare di affollare la dashboard se l'utente ha fatto 70 viaggi
  const LIMITE_INIZIALE = 4;
  // Se lo stato mostraTutti è attivo mostra l'intera lista filtrata, altrimenti taglia l'array estraendo solo i primi 4 elementi
  const regioniVisibili = mostraTutti
    ? regioniFiltrate
    : regioniFiltrate.slice(0, LIMITE_INIZIALE);

  // ARRAY DI ICONE PREMIUM:
  // Sostituiamo le immagini esterne con una collezione di icone geometriche eleganti e stabili che si alterneranno nelle card
  const iconeMete = [Building2, Globe, Milestone, Compass];

  // Early Return: Se lo store sta ancora parlando con il server, blocca il rendering e mostra lo stato di attesa
  if (isLoading) {
    return (
      <div className="p-8 text-center text-[var(--colore-testo-mutato)]">
        Sincronizzazione profilo in corso... ⏳
      </div>
    );
  }

  return (
    // Wrapper principale a tutto schermo con font ereditato dalle variabili globali e scorrimento verticale attivo
    <div
      className="flex-1 p-8 overflow-y-auto bg-[var(--colore-sfondo-alt)] min-h-screen antialiased text-[var(--colore-testo-principale)]"
      style={{ fontFamily: "var(--font-principale)" }}
    >
      {/* CONTAINER CENTRALIZZATO: Limita la larghezza massima a 1280px (max-w-7xl) e distanzia i blocchi di 40px (space-y-10) */}
      <div className="max-w-7xl mx-auto space-y-10">
        {/* INTERRUTTORE TEMA - Pulsante pulito posizionato in alto a destra */}
        <div className="flex justify-end">
          <button
            onClick={toggleTema}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-[var(--colore-sfondo-card)] border border-[var(--colore-bordo)] shadow-sm hover:bg-[var(--colore-sfondo-alt)] hover:border-[var(--colore-primario-luce)]/30 transition-all duration-300 text-[var(--colore-testo-principale)]"
          >
            {isDark ? (
              <>
                <Sun size={16} className="text-amber-500" />
                <span>Modalità Chiara</span>
              </>
            ) : (
              <>
                <Moon size={16} className="text-indigo-500" />
                <span>Modalità Scura</span>
              </>
            )}
          </button>
        </div>

        {/*CARD UTENTE MAGNETICA*/}
        {/* relative imposta il perimetro per gli effetti di luce assoluti; group permette ai figli di reagire all'hover della card */}
        <div className="relative group max-w-3xl mx-auto sm:mx-0">
          {/* Alone di luce soffuso posizionato dietro la card. Sfrutta un gradiente sfocato (blur-lg) che si accende al passaggio del mouse */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--colore-primario-luce)] to-[var(--colore-secondario-luce)] rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition duration-300"></div>

          {/* Corpo interno della card: genera un gradiente diagonale usando la palette aziendale (Blu Scuro -> Blu Notte -> Ottanio) */}
          <div className="relative bg-gradient-to-br from-[var(--colore-primario-scuro)] via-[var(--colore-primario)] to-[var(--colore-secondario)] rounded-3xl p-8 shadow-xl border border-white/10 transition-all duration-500 hover:scale-[1.01] text-white">
            {/* Disposizione flessibile: in colonna su mobile, affiancata in orizzontale (flex-row) da schermi medi in su */}
            <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
              {/* Blocco Avatar con effetto pulsante di profondità */}
              <div className="relative flex items-center justify-center shrink-0">
                {/* Cerchio di sfondo nativo animato con un leggero battito (animate-pulse) */}
                <div className="absolute inset-0 bg-white/10 rounded-full blur-md animate-pulse"></div>
                {/* Anello esterno dell'avatar con gradiente cromato. Ruota di 12 gradi (rotate-12) quando si fa hover sulla card */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-white to-[var(--colore-primario-luce)] p-[3px] shadow-md transform transition-transform duration-700 group-hover:rotate-12">
                  {/* Cerchio interno scuro che ospita l'icona dell'utente centrata */}
                  <div className="w-full h-full bg-[var(--colore-primario-scuro)] rounded-full flex items-center justify-center text-white">
                    <UserCircle size={60} />
                  </div>
                </div>
              </div>

              {/* Informazioni testuali del profilo utente */}
              <div className="flex-grow space-y-3">
                {/* Allineamento flessibile per Nome e Badge Amministrativo/User */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-3">
                  {/* Nome completo dell'utente stampato in grassetto compatto (tracking-tight) con stringa di salvataggio */}
                  <h1
                    className="text-3xl font-bold tracking-tight text-white m-0"
                    style={{ fontWeight: "var(--peso-bold)" }}
                  >
                    {utente?.nome_completo || "Viaggiatore Aziendale"}
                  </h1>
                  {/* Badge del Ruolo: usa uno sfondo bianco semitrasparente (bg-white/15) e lettere maiuscole spaziate */}
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wide bg-white/15 text-white border border-white/20 shadow-sm"
                    style={{ fontWeight: "var(--peso-semibold)" }}
                  >
                    <Shield size={12} />
                    {utente?.ruolo || "user"}
                  </span>
                </div>

                {/* Riga dell'indirizzo e-mail completa di icona della busta coordinata in colore ottanio luce */}
                <div className="flex items-center justify-center sm:justify-start gap-2.5 text-white/80 text-sm hover:text-white transition-colors duration-300 w-fit mx-auto sm:mx-0">
                  <Mail
                    size={16}
                    className="text-[var(--colore-secondario-luce)]"
                  />
                  <span
                    className="tracking-wide"
                    style={{ fontWeight: "var(--peso-medio)" }}
                  >
                    {utente?.email || "nessuna-email@azienda.com"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTATORI DASHBOARD (3 COLONNE RESPONSIVE) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD STATISTICA 1: TRASFERTE TOTALI */}
          <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-primario-luce)] transition-all duration-300 flex items-center justify-between group">
            <div>
              <p
                className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0"
                style={{ fontWeight: "var(--peso-bold)" }}
              >
                Trasferte Totali
              </p>
              {/* Stampa la lunghezza totale dell'array filtrato per scoprire quanti viaggi ha fatto l'utente */}
              <h3
                className="text-4xl mt-2 text-[var(--colore-primario-scuro)] m-0 tracking-tight group-hover:text-[var(--colore-primario-luce)] transition-colors duration-300"
                style={{ fontWeight: "var(--peso-bold)" }}
              >
                {trasferteUtente.length}
              </h3>
            </div>
            {/* Icona dell'aeroplano che si ingrandisce del 10% (scale-110) all'hover sulla card */}
            <div className="p-3 bg-[var(--colore-sfondo-alt)] rounded-xl text-[var(--colore-primario)] group-hover:scale-110 group-hover:bg-[var(--colore-bordo-focus)]/30 transition-all duration-300">
              <Plane size={24} />
            </div>
          </div>

          {/* CARD STATISTICA 2: METE ESPLORATE */}
          <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-secondario)] transition-all duration-300 flex items-center justify-between group">
            <div>
              <p
                className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0"
                style={{ fontWeight: "var(--peso-bold)" }}
              >
                Copertura Territoriale
              </p>
              {/* Conta quante chiavi univoche (città distinte) sono state generate nell'array delle regioni */}
              <h3
                className="text-4xl mt-2 text-[var(--colore-primario-scuro)] m-0 tracking-tight group-hover:text-[var(--colore-secondario)] transition-colors duration-300"
                style={{ fontWeight: "var(--peso-bold)" }}
              >
                {regioni.length}
              </h3>
            </div>
            <div className="p-3 bg-[var(--colore-info-sfondo)] rounded-xl text-[var(--colore-secondario)] group-hover:scale-110 group-hover:bg-[var(--colore-secondario-luce)]/20 transition-all duration-300">
              <Compass size={24} />
            </div>
          </div>

          {/* CARD STATISTICA 3: ULTIMA TRASFERTA EFFETTUATA */}
          <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-accento)] transition-all duration-300 flex items-center justify-between group">
            <div>
              <p
                className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0"
                style={{ fontWeight: "var(--peso-bold)" }}
              >
                Ultima Trasferta
              </p>
              {/* Legge l'elemento all'indice [0] (il più recente grazie al .sort di prima) e tronca il testo (truncate) se è troppo lungo */}
              <h3
                className="text-xl mt-3 text-[var(--colore-testo-principale)] truncate max-w-[180px] m-0 group-hover:text-[var(--colore-accento)] transition-colors duration-300"
                style={{ fontWeight: "var(--peso-semibold)" }}
              >
                {trasferteUtente[0]?.destinazione || "-"}
              </h3>
            </div>
            <div className="p-3 bg-[var(--colive-avviso-sfondo)] rounded-xl text-[var(--colore-accento)] group-hover:scale-110 transition-all duration-300">
              <Award size={24} />
            </div>
          </div>
        </div>

        {/*SEZIONE PANORAMICA TERRITORIALE (CARD CITTÀ & FILTRI) */}
        <div className="space-y-6">
          {/* Intestazione della sezione con titolo a sinistra e Barra di Ricerca a destra */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--colore-bordo)] pb-4">
            <div className="flex items-center gap-3">
              {/* Linea verticale estetica con gradiente sfumato */}
              <div className="h-6 w-1 bg-gradient-to-b from-[var(--colore-primario)] to-[var(--colore-secondario)] rounded-full"></div>
              <h2
                className="text-2xl tracking-tight text-[var(--colore-primario-scuro)] m-0"
                style={{ fontWeight: "var(--peso-bold)" }}
              >
                Panoramica Territoriale
              </h2>
            </div>

            {/* INPUT DI RICERCA REATTIVO */}
            <div className="relative w-full sm:w-64">
              {/* Icona della lente d'ingrandimento bloccata in posizione assoluta a sinistra dentro l'input */}
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--colore-testo-secondario)]"
                size={16}
              />
              <input
                type="text"
                placeholder="Cerca destinazione..."
                value={ricerca} // Aggancio dello stato locale della ricerca
                onChange={(e) => {
                  setRicerca(e.target.value);
                  setMostraTutti(true); // Se l'utente inizia a scrivere, espandiamo la lista per non nascondere i risultati cercati
                }}
                // Input stilizzato con padding sinistro aumentato (pl-9) per fare spazio alla lente d'ingrandimento
                className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--colore-sfondo-card)] border border-[var(--colore-bordo)] rounded-xl focus:outline-none focus:border-[var(--colore-primario-luce)] focus:ring-2 focus:ring-[var(--colore-primario-luce)]/20 transition-all text-[var(--colore-testo-principale)]"
              />
            </div>
          </div>

          {/* Rendering condizionale della griglia delle card città */}
          {regioniVisibili.length > 0 ? (
            // Se ci sono mete da mostrare, attiva la griglia responsive (1 colonna su mobile, 4 su desktop)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {regioniVisibili.map(([nomeLuogo, numeroViaggi], index) => {
                // Scegliamo dinamicamente un'icona dall'array usando l'operatore modulo (%) basandoci sull'indice del ciclo
                const IconaDinamica = iconeMete[index % iconeMete.length];

                return (
                  // Card della singola destinazione. Effetto hover avanzato: si solleva (-translate-y-1.5) e aumenta l'ombra
                  <div
                    key={nomeLuogo}
                    className="group relative bg-[var(--colore-sfondo-card)] rounded-2xl overflow-hidden border border-[var(--colore-bordo)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ease-out"
                  >
                    {/* HEADER GEOMETRICO (Sostituisce le vecchie immagini di Unsplash) */}
                    <div className="h-32 bg-gradient-to-br from-[var(--colore-sfondo-alt)] to-[var(--colore-bordo-focus)]/10 flex items-center justify-center relative border-b border-[var(--colore-bordo)] overflow-hidden">
                      {/* Cerchio di luce astratto sullo sfondo che reagisce quando si passa il mouse sulla card */}
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[var(--colore-primario-luce)]/5 rounded-full blur-xl group-hover:bg-[var(--colore-primario-luce)]/10 transition-all duration-500" />

                      {/* L'icona astratta della meta: all'hover diventa nitida, si ingrandisce e ruota di 6 gradi */}
                      <IconaDinamica
                        size={44}
                        className="text-[var(--colore-primario)]/30 group-hover:text-[var(--colore-primario)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out"
                      />

                      {/* Badge fisso con l'icona MapPin posizionato in alto a sinistra del box geometrico */}
                      <div className="absolute top-4 left-4 p-2 bg-[var(--colore-sfondo-card)] rounded-xl text-[var(--colore-secondario)] border border-[var(--colore-bordo)] shadow-sm group-hover:bg-[var(--colore-secondario)] group-hover:text-white group-hover:border-[var(--colore-secondario)] transition-all duration-300">
                        <MapPin size={16} />
                      </div>
                    </div>

                    {/* CORPO INFERIORE DELLA CARD (Dati e contatori) */}
                    <div className="p-5 bg-[var(--colore-sfondo-card)]">
                      {/* Nome della città stampato in grassetto. All'hover sulla card, il testo si tinge di blu brillante */}
                      <h3
                        className="text-[var(--colore-testo-principale)] text-lg m-0 mb-4 tracking-tight group-hover:text-[var(--colore-primario-luce)] transition-colors duration-300 truncate"
                        style={{ fontWeight: "var(--peso-bold)" }}
                      >
                        {nomeLuogo}
                      </h3>

                      {/* Sezione inferiore con la linea di divisione e il conteggio delle presenze effettive */}
                      <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--colore-bordo)]">
                        {/* Etichetta "Presenze" affiancata da una micro-icona dell'aereo che slitta leggermente a destra all'hover */}
                        <span className="text-[var(--colore-testo-secondario)] font-medium tracking-wide flex items-center gap-1.5">
                          <Plane
                            size={14}
                            className="text-[var(--colore-testo-mutato)] group-hover:translate-x-0.5 transition-transform duration-300"
                          />
                          Presenze
                        </span>
                        {/* Badge numerico: mostra il numero di viaggi e si colora interamente di ottanio quando si fa hover sulla card */}
                        <span
                          className="text-sm px-3 py-0.5 rounded-lg border text-[var(--colore-secondario)] bg-[var(--colore-info-sfondo)] border-[var(--colore-info)]/20 group-hover:bg-[var(--colore-secondario)] group-hover:text-white group-hover:border-[var(--colore-secondario)] transition-all duration-300 shadow-sm"
                          style={{ fontWeight: "var(--peso-bold)" }}
                        >
                          {numeroViaggi}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // EMPTY STATE: Se i filtri o la ricerca azzerano i risultati, mostra un box tratteggiato di avviso
            <div className="p-12 text-center bg-[var(--colore-sfondo-card)] rounded-2xl border border-dashed border-[var(--colore-bordo)] text-[var(--colore-testo-secondario)] text-sm">
              Nessuna meta trovata corrispondente a "{ricerca}"
            </div>
          )}

          {/* PULSANTE DI CONTROLLO "MOSTRA TUTTI" / "MOSTRA MENO" */}
          {/* Compare solo se l'array totale ha più di 4 elementi e l'utente NON sta usando la barra di ricerca */}
          {regioniFiltrate.length > LIMITE_INIZIALE && !ricerca && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setMostraTutti(!mostraTutti)} // Inverte lo stato booleano al click
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[var(--colore-primario)] bg-[var(--colore-sfondo-card)] border border-[var(--colore-bordo)] rounded-xl hover:bg-[var(--colore-sfondo-alt)] hover:border-[var(--colore-primario-luce)]/30 transition-all duration-300 shadow-sm"
              >
                {/* Se la lista è espansa mostra "Mostra meno" con la freccia in su, altrimenti mostra il numero totale rimasto escluso */}
                {mostraTutti ? (
                  <>
                    Mostra meno <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    Mostra tutti ({regioniFiltrate.length}){" "}
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Esportazione di default del componente per l'inizializzazione standard di React
export default ProfiloUtente;
