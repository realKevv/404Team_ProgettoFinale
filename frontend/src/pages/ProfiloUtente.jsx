// =============================================================================
// ProfiloUtente.jsx - Pagina del Profilo Utente
// =============================================================================
// Mostra le informazioni dell'utente loggato, le sue statistiche di viaggio,
// la copertura territoriale e le impostazioni personali (inclusa la modalità
// scura con switch animato).
// =============================================================================

import React, { useEffect } from "react";
import {
  UserCircle,
  Mail,
  Shield,
  MapPin,
  Plane,
  Compass,
  Award,
  Sun,
  Moon,
} from "lucide-react";
import { useStore } from "../store/store"; // Store globale per le trasferte
import { useTheme } from "../context/ThemeContext"; // Contesto del tema chiaro/scuro

export function ProfiloUtente() {
  // -----------------------------------------------------------------------
  // DATI UTENTE - Leggiamo l'utente dalla sessione salvata nel localStorage
  // -----------------------------------------------------------------------
  const utente = JSON.parse(localStorage.getItem("utente") || "null");

  // -----------------------------------------------------------------------
  // STORE GLOBALE - Trasferte e funzione di caricamento
  // -----------------------------------------------------------------------
  const { trasferte, fetchTrasferte, isLoading } = useStore();

  // -----------------------------------------------------------------------
  // TEMA - Hook personalizzato che espone: isDark, toggleTema, tema
  // -----------------------------------------------------------------------
  // isDark: booleano vero se la dark mode è attiva
  // toggleTema: funzione che alterna tra chiaro e scuro
  const { isDark, toggleTema } = useTheme();

  // Carichiamo le trasferte dal server non appena la pagina si apre
  useEffect(() => {
    fetchTrasferte();
  }, [fetchTrasferte]);

  // -----------------------------------------------------------------------
  // TRASFERTE UTENTE - Filtro e ordinamento per data decrescente
  // -----------------------------------------------------------------------
  // Scorro la lista di tutte le trasferte e filtro solo quelle dell'utente loggato.
  // Se l'utente non è loggato, trasferteUtente sarà un array vuoto.
  const trasferteUtente = utente
    ? trasferte
        .filter((t) => t.id_utente === utente.id)
        .sort((a, b) => {
          // controlla se il viaggio ha una data valida, altrimenti assegna
          // una data molto vecchia (new Date(0)) per posizionarlo alla fine
          const dataA = a.data_inizio ? new Date(a.data_inizio) : new Date(0);
          const dataB = b.data_inizio ? new Date(b.data_inizio) : new Date(0);
          // ordino in maniera decrescente: i viaggi più recenti appaiono prima
          return dataB - dataA;
        })
    : [];

  // -----------------------------------------------------------------------
  // REGIONI VISITATE - Raggruppiamo per destinazione/regione (dati reali)
  // -----------------------------------------------------------------------
  // Creo un oggetto per contare quante volte l'utente ha visitato ogni regione.
  const regioniVisitate = {};

  // forEach prende la lista dei viaggi e per ogni viaggio conta le visite per regione
  trasferteUtente.forEach((trasferta) => {
    // Se esiste la regione, usala; altrimenti la destinazione; altrimenti "Non specificata"
    const nomeLuogo =
      trasferta.regione || trasferta.destinazione || "Non specificata";
    // Inizializza il contatore se è la prima volta che vediamo questa regione
    if (!regioniVisitate[nomeLuogo]) {
      regioniVisitate[nomeLuogo] = 0;
    }
    // Incrementa il contatore delle visite per quella regione
    regioniVisitate[nomeLuogo]++;
  });

  // Trasforma l'oggetto in un array di coppie [nome, conteggio] per il rendering
  const regioni = Object.entries(regioniVisitate);

  // -----------------------------------------------------------------------
  // IMMAGINI PLACEHOLDER - Usate nelle card delle destinazioni
  // -----------------------------------------------------------------------
  const immaginiPlaceholder = [
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
  ];

  // -----------------------------------------------------------------------
  // SCHERMATA DI CARICAMENTO
  // -----------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="p-8 text-center text-[var(--colore-testo-mutato)]">
        Sincronizzazione profilo in corso... ⏳
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // RENDER PRINCIPALE
  // -----------------------------------------------------------------------
  return (
    <div
      className="flex-1 p-8 overflow-y-auto bg-[var(--colore-sfondo-pagina)] min-h-screen antialiased text-[var(--colore-testo-principale)]"
      style={{ fontFamily: "var(--font-principale)" }}
    >
      {/* CONTAINER CENTRALIZZATO
                max-w-7xl: limita la larghezza massima del contenitore a 1280px, centrato con mx-auto
                space-y-10: crea uno spazio verticale di 40px tra gli elementi figli */}
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ============================================================
                    1. CARD UTENTE - Gradiente magnetico blu-notte / ottanio
                    ============================================================ */}
        {/* relative: rende il contenitore riferimento per gli elementi assoluti (alone di luce)
                    group: permette di applicare stili agli elementi figli su hover
                    max-w-3xl: impedisce alla card di diventare troppo larga */}
        <div className="relative group max-w-3xl mx-auto sm:mx-0">
          {/* Alone luminoso sotto la card (pseudo-ombra colorata)
                        inset-1: leggermente più grande della card; opacity bassa, aumenta su hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--colore-primario-luce)] to-[var(--colore-secondario-luce)] rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition duration-300"></div>

          {/* Corpo della Card - gradiente diagonale a 3 colori
                        hover:scale: ingrandisce dell'1% al passaggio del mouse */}
          <div className="relative bg-gradient-to-br from-[var(--colore-primario-scuro)] via-[var(--colore-primario)] to-[var(--colore-secondario)] rounded-3xl p-8 shadow-xl border border-white/10 transition-all duration-500 hover:scale-[1.01] text-white">
            {/* Layout: verticale su mobile, orizzontale su schermi grandi */}
            <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
              {/* --- Avatar animato --- */}
              {/* shrink-0: blocca le dimensioni dell'avatar per non ridursi su schermi piccoli */}
              <div className="relative flex items-center justify-center shrink-0">
                {/* Alone pulsante dietro l'avatar */}
                <div className="absolute inset-0 bg-white/10 rounded-full blur-md animate-pulse"></div>
                {/* Anello esterno del cerchio avatar con gradiente e rotazione su hover */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-white to-[var(--colore-primario-luce)] p-[3px] shadow-md transform transition-transform duration-700 group-hover:rotate-12">
                  {/* Cerchio interno con sfondo scuro e icona utente */}
                  <div className="w-full h-full bg-[var(--colore-primario-scuro)] rounded-full flex items-center justify-center text-white">
                    <UserCircle size={60} />
                  </div>
                </div>
              </div>

              {/* --- Info Utente (nome, ruolo, email) --- */}
              {/* flex-grow: espande per occupare tutto lo spazio rimasto accanto all'avatar */}
              <div className="flex-grow space-y-3">
                {/* Riga: Nome + Badge ruolo */}
                {/* flex-col su mobile, flex-row su desktop con gap fisso */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-3">
                  {/* Nome utente: testo grande, compatto, bianco */}
                  <h1
                    className="text-3xl font-bold tracking-tight text-white m-0"
                    style={{ fontWeight: "var(--peso-bold)" }}
                  >
                    {utente?.nome_completo || "Viaggiatore Aziendale"}
                  </h1>

                  {/* Badge ruolo: piccolo, maiuscolo, sfondo semi-trasparente bianco */}
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wide bg-white/15 text-white border border-white/20 shadow-sm"
                    style={{ fontWeight: "var(--peso-semibold)" }}
                  >
                    <Shield size={12} />
                    {utente?.ruolo || "user"}
                  </span>
                </div>

                {/* Riga email con icona */}
                {/* Centrata su mobile, allineata a sinistra su desktop */}
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

        {/* ============================================================
                    2. CONTATORI DASHBOARD - 3 card con statistiche principali
                    ============================================================ */}
        {/* Grid a 1 colonna su mobile, 3 colonne su schermi medi e grandi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- Card: Trasferte Totali --- */}
          {/* group: permette animazioni sincronizzate su hover su icona e numero */}
          <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-primario-luce)] transition-all duration-300 flex items-center justify-between group">
            <div>
              {/* Etichetta piccola in maiuscolo */}
              <p
                className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0"
                style={{ fontWeight: "var(--peso-bold)" }}
              >
                Trasferte Totali
              </p>
              {/* Numero grande che cambia colore su hover */}
              <h3
                className="text-4xl mt-2 text-[var(--colore-primario-scuro)] m-0 tracking-tight group-hover:text-[var(--colore-primario-luce)] transition-colors duration-300"
                style={{ fontWeight: "var(--peso-bold)" }}
              >
                {trasferteUtente.length}
              </h3>
            </div>
            {/* Icona che si ingrandisce al hover */}
            <div className="p-3 bg-[var(--colore-sfondo-alt)] rounded-xl text-[var(--colore-primario)] group-hover:scale-110 group-hover:bg-[var(--colore-bordo-focus)]/30 transition-all duration-300">
              <Plane size={24} />
            </div>
          </div>

          {/* --- Card: Copertura Territoriale --- */}
          <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-secondario)] transition-all duration-300 flex items-center justify-between group">
            <div>
              <p
                className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0"
                style={{ fontWeight: "var(--peso-bold)" }}
              >
                Copertura Territoriale
              </p>
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

          {/* --- Card: Ultima Trasferta --- */}
          <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-accento)] transition-all duration-300 flex items-center justify-between group">
            <div>
              <p
                className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0"
                style={{ fontWeight: "var(--peso-bold)" }}
              >
                Ultima Trasferta
              </p>
              <h3
                className="text-xl mt-3 text-[var(--colore-testo-principale)] truncate max-w-[180px] m-0 group-hover:text-[var(--colore-accento)] transition-colors duration-300"
                style={{ fontWeight: "var(--peso-semibold)" }}
              >
                {trasferteUtente[0]?.destinazione || "-"}
              </h3>
            </div>
            <div className="p-3 bg-[var(--colore-avviso-sfondo)] rounded-xl text-[var(--colore-accento)] group-hover:scale-110 transition-all duration-300">
              <Award size={24} />
            </div>
          </div>
        </div>

        {/* ============================================================
                    3. IMPOSTAZIONI PERSONALI - Include lo switch dark mode
                    ============================================================ */}
        <div className="space-y-6">
          {/* Intestazione sezione con barra verticale colorata */}
          <div className="flex items-center gap-3">
            {/* Barra decorativa verticale con gradiente primario→secondario */}
            <div className="h-6 w-1 bg-gradient-to-b from-[var(--colore-primario)] to-[var(--colore-secondario)] rounded-full"></div>
            <h2
              className="text-2xl tracking-tight text-[var(--colore-primario-scuro)] m-0"
              style={{ fontWeight: "var(--peso-bold)" }}
            >
              Impostazioni
            </h2>
          </div>

          {/* --- CARD SWITCH DARK MODE ---
                        Usa la classe .tema-sezione definita in GlobalCSS.css
                        Layout: icona + testi a sinistra, toggle switch a destra */}
          <div className="tema-sezione">
            {/* PARTE SINISTRA: icona + testi descrittivi */}
            <div className="tema-sezione-info">
              {/* Icona che cambia tra ☀️ (chiaro) e 🌙 (scuro) con transizione */}
              <div className="tema-sezione-icona">
                {/* Usiamo i componenti Lucide: Sun per chiaro, Moon per scuro
                                    La transizione tra icone avviene grazie al re-render di React */}
                {isDark ? (
                  <Moon
                    size={20}
                    className="text-[var(--colore-primario-luce)]"
                  />
                ) : (
                  <Sun size={20} className="text-[var(--colore-accento)]" />
                )}
              </div>

              {/* Testi: titolo e descrizione della funzione */}
              <div className="tema-sezione-testi">
                <p className="tema-sezione-titolo">Modalità Scura</p>
                <p className="tema-sezione-descrizione">
                  {/* Il testo cambia in base allo stato corrente del tema */}
                  {isDark
                    ? "Tema scuro attivo — ottimizzato per ambienti con poca luce"
                    : "Attiva il tema scuro per ridurre l'affaticamento visivo"}
                </p>
              </div>
            </div>

            {/* PARTE DESTRA: lo switch animato
                            Struttura: <label> > <input type="checkbox"> + <span slider>
                            La label racchiude l'input così cliccando ovunque sulla pillola
                            si togola il checkbox (e quindi il tema). */}
            <label
              className="tema-switch"
              /* Accessibilità: etichetta per screen reader */
              aria-label="Attiva o disattiva la modalità scura"
              title={
                isDark
                  ? "Clicca per passare al tema chiaro"
                  : "Clicca per passare al tema scuro"
              }
            >
              {/* Input checkbox nascosto (opacità 0) - è la vera logica del toggle
                                checked: sincronizzato con lo stato isDark del contesto
                                onChange: chiama toggleTema() ad ogni cambio */}
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTema}
                id="dark-mode-switch" /* id unico per accessibilità */
              />

              {/* La pillola visiva: lo stile è tutto in GlobalCSS.css
                                Il ::before (cerchio) si sposta con CSS quando input è :checked */}
              <span className="tema-switch-slider"></span>
            </label>
          </div>
        </div>

        {/* ============================================================
                    4. PANORAMICA TERRITORIALE - Card delle destinazioni visitate
                    ============================================================ */}
        <div className="space-y-6">
          {/* Intestazione sezione */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-gradient-to-b from-[var(--colore-primario)] to-[var(--colore-secondario)] rounded-full"></div>
            <h2
              className="text-2xl tracking-tight text-[var(--colore-primario-scuro)] m-0"
              style={{ fontWeight: "var(--peso-bold)" }}
            >
              Panoramica Territoriale
            </h2>
          </div>

          {/* Grid adattiva: 1 col mobile → 2 col tablet → 4 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {regioni.map(([nomeLuogo, numeroViaggi], index) => {
              // Assegna un'immagine ciclicamente dalle placeholder disponibili
              const urlImmagine =
                immaginiPlaceholder[index % immaginiPlaceholder.length];

              return (
                /* Card destinazione: si alza su hover e aumenta l'ombra */
                <div
                  key={nomeLuogo}
                  className="group relative bg-[var(--colore-sfondo-card)] rounded-2xl overflow-hidden border border-[var(--colore-bordo)] shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out"
                >
                  {/* Immagine di copertina della destinazione */}
                  <div className="h-44 overflow-hidden relative">
                    {/* Gradiente sovrapposto: dissolvenza verso il basso per leggibilità del testo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--colore-sfondo-card)] via-transparent to-transparent z-10" />
                    {/* Immagine: si ingrandisce leggermente su hover per effetto zoom */}
                    <img
                      src={urlImmagine}
                      alt={nomeLuogo}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out filter contrast-[1.02]"
                    />
                    {/* Pin di localizzazione sovrapposto all'immagine */}
                    <div className="absolute top-4 left-4 z-20 p-2 bg-[var(--colore-sfondo-card)]/90 backdrop-blur-md rounded-xl text-[var(--colore-secondario)] border border-[var(--colore-bordo)] shadow-sm group-hover:bg-[var(--colore-secondario)] group-hover:text-white group-hover:border-[var(--colore-secondario)] transition-all duration-300">
                      <MapPin size={18} />
                    </div>
                  </div>

                  {/* Info della destinazione: nome e conteggio viaggi */}
                  <div className="p-5 relative z-20 bg-[var(--colore-sfondo-card)]">
                    {/* Nome destinazione: cambia colore su hover */}
                    <h3
                      className="text-[var(--colore-testo-principale)] text-lg m-0 mb-4 tracking-tight group-hover:text-[var(--colore-primario-luce)] transition-colors duration-300"
                      style={{ fontWeight: "var(--peso-bold)" }}
                    >
                      {nomeLuogo}
                    </h3>

                    {/* Riga inferiore: etichetta + badge conteggio */}
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--colore-bordo)]">
                      {/* Etichetta sinistra con icona aereo */}
                      <span className="text-[var(--colore-testo-secondario)] font-medium tracking-wide flex items-center gap-1.5">
                        <Plane
                          size={14}
                          className="text-[var(--colore-testo-mutato)] group-hover:translate-x-1 transition-transform duration-300"
                        />
                        Trasferte Effettuate
                      </span>
                      {/* Badge con numero: diventa colorato su hover */}
                      <span
                        className="text-sm px-3 py-1 rounded-lg border text-[var(--colore-secondario)] bg-[var(--colore-info-sfondo)] border-[var(--colore-info)]/20 group-hover:bg-[var(--colore-secondario)] group-hover:text-white group-hover:border-[var(--colore-secondario)] transition-all duration-300 shadow-sm"
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
        </div>
      </div>
    </div>
  );
}

export default ProfiloUtente;
