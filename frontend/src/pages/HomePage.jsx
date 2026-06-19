import {
  ArrowRight,
  Plane,
  Receipt,
  Shield,
  ChevronDown,
  TrendingUp,
  Globe,
  Bot,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import video from "../assets/img/video.mp4";
import dashboardImg from "../assets/img/Dashboard.png";
import Footer from "../components/Footer";

export default function Homepage() {
  // Inizializzazione della funzione per reindirizzare l'utente
  const navigate = useNavigate();
  // Recuperiamo il token di sessione salvato nel browser al momento del login
  const token = localStorage.getItem("token");
  // Trasformiamo il token in un valore booleano (true/false).
  // Controlliamo anche che la stringa non sia "undefined"
  const isLoggedIn = !!token && token !== "undefined";

  return (
    /* - relative: fa da punto di riferimento per elementi interni posizionati in modo assoluto
      - min-h-screen: altezza minima pari al 100% dello schermo
      - overflow-y-auto: scorrimento verticale standard quando i contenuti superano lo schermo
      - font-[var(--font-principale)]: applica il font personalizzato definito nelle variabili CSS globali
      - bg-slate-50: imposta uno sfondo grigio chiarissimo di base
    */
    <div className="relative min-h-screen overflow-y-auto font-[var(--font-principale)] bg-[var(--colore-sfondo-pagina)] text-[var(--colore-testo-principale)]">
      {/* SEZIONE SUPERIORE CON VIDEO BACKGROUND */}
      {/* 
        - w-full: larghezza al 100% della pagina
        - flex flex-col justify-between: allinea verticalmente i blocchi interni
        - bg-gray-900: sfondo grigio scuro di default prima che si carichi il video
        - overflow-hidden: nasconde qualsiasi elemento che esce dai bordi di questa sezione
       */}
      <div className="relative w-full min-h-screen flex flex-col justify-between bg-gray-900 overflow-hidden">
        {/* BLOCCO VIDEO DI SFONDO 
            - absolute inset-0: contenitore che si sistema ai quattro angoli del padre
          - z-0: posiziona il blocco sullo strato più basso (sotto ai testi e ai pulsanti)
          - pointer-events-none: impedisce che i click del mouse colpiscano il video, permettendo di cliccare i testi sopra
        */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <video
            src={video}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            // Evita che su telefono il video si apra a tutto schermo nel player nativo
            playsInline
          />
          {/* OVERLAY SFUMATO SOPRA AL VIDEO 
           - bg-gradient-to-br: crea una sfumatura che va dall'alto a sinistra verso il basso a destra (Bottom Right)
            - from-black/80: parte da un nero con opacità all'80%
            - via-black/60: passa per un nero opacità 60% al centro
            - to-indigo-950/70: finisce con un viola scurissimo al 70%. 
            - Serve a scurire il video per far leggere i testi bianchi
          */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-indigo-950/70" />
        </div>

        {/* NAVBAR + TESTI + CARDS LATERALI 
        - relative z-10: blocco sopra lo strato del video (z-0) */}
        <div className="relative z-10 flex flex-col justify-between h-full min-h-screen">
          {/* NAVBAR 
            - flex items-center justify-between: logo a sinistra, bottoni a destra, allineati al centro verticalmente
            - px-6 sm:px-10 lg:px-16: margine interno sinistro/destro che aumenta in base allo schermo (cellulare, tablet, PC)
            - py-5: margine interno sopra e sotto di circa 20px
            - animate-fade-in: classe di animazione per far apparire la barra in dissolvenza all'avvio
          */}
          <nav className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 animate-fade-in">
            {/* LOGO AZIENDALE */}
            {/* 
                - flex items-center gap-3: allinea l'icona dell'aereo e il testo orizzontalmente con un gap di 12px */}
            <div className="flex items-center gap-3">
              {/* 
                - w-10 h-10 rounded-xl: quadratino di 40x40px con angoli molto arrotondati
                - bg-white/10: sfondo bianco semitrasparente (10% di opacità)
                - backdrop-blur-md: effetto vetro satinato (sfoca il video che si muove dietro)
                - border border-white/20: sottile bordo bianco semitrasparente */}
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <Plane size={20} className="text-white" />
              </div>
              {/* 
                - text-2xl font-light: testo grande con spessore molto sottile ed elegante
                - uppercase tracking-widest: tutto in maiuscolo e con le lettere molto spaziate tra loro */}
              <span className="text-2xl font-light uppercase text-white tracking-widest font-sans">
                Business Travel
              </span>
            </div>

            {/* PULSANTI LOGIN DINAMICI */}
            <div className="flex items-center gap-4">
              {!isLoggedIn ? (
                // Se l'utente NON è loggato mostra:
                // Tasto Gestionale (Invisibile su cellulare "hidden", visibile da tablet in poi "sm:block")
                <>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="hidden sm:block text-white/70 hover:text-white text-sm font-medium transition-colors"
                  >
                    Gestionale
                  </button>
                  {/* Tasto Accedi 
                    - bg-white text-gray-900: pulsante bianco con testo grigio scuro
                    - hover:bg-white/90: quando ci passi sopra il mouse, diventa leggermente trasparente al 90%
                    - shadow-lg shadow-white/10: aggiunge un'ombra morbida di colore bianco al 10% di opacità
                    - transition-all duration-200: rende fluido il cambio di colore durante l'hover (dura 200ms)
                   */}
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-gray-900 hover:bg-white/90 transition-all duration-200 shadow-lg shadow-white/10"
                  >
                    Accedi
                  </button>
                </>
              ) : (
                // Se l'utente è già loggato mostra solo questo bottone diretto:
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-gray-900 hover:bg-white/90 transition-all duration-200 shadow-lg shadow-white/10"
                >
                  Vai al Gestionale
                </button>
              )}
            </div>
          </nav>

          {/* CONTENUTO CENTRALE (Griglia a 2 colonne su PC, 1 colonna su Smartphone) 
            - max-w-7xl mx-auto: centra il blocco fissando una larghezza massima per schermi giganti
            - grid grid-cols-1 lg:grid-cols-2: 1 colonna di base (smartphone), 2 colonne separate da PC in poi (lg:)
            - gap-12 lg:gap-20: spazio tra le colonne (più ampio su PC)
            - my-auto: centra verticalmente l'intero blocco nello schermo rimasto libero
          */}
          <div className="hero-section max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center my-auto">
            {/* COLONNA SINISTRA: TESTI E TITOLI 
                space-y-8: distanzia automaticamente in verticale tutti i blocchi interni di circa 32px */}
            <div className="space-y-8">
              {/* Badge "Enterprise Solution 2026" */}
              <div className="animate-fade-in-up stagger-1">
                {/* inline-flex items-center: stringe il badge attorno al suo testo e allinea il pallino verde alle scritte  */}
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm">
                  {/* Pallino Verde Animato */}
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    style={{ animation: "pulse-slow 2s infinite" }}
                  />
                  Enterprise Solution 2026
                </span>
              </div>

              {/* Titolo principale con testo sfumato 
                - text-5xl sm:text-6xl lg:text-7xl: il testo cresce progressivamente in base al dispositivo
                - font-bold: rende la parola "Travel" in grassetto, mentre "Business" rimane "font-light" (leggero)
                - bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent: colora la parola "Travel" con una sfumatura che va dal bianco al blu chiaro (ritagliando lo sfondo e rendendo il testo trasparente)
              */}
              <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-light uppercase text-white tracking-widest leading-tight animate-fade-in-up stagger-2">
                Business <br />
                <span className="font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Travel
                </span>
              </h1>

              {/* Paragrafo sottotitolo 
              text-white/60: testo bianco opaco al 60% */}
              <p className="hero-subtitle text-lg sm:text-xl text-white/60 max-w-lg leading-relaxed animate-fade-in-up stagger-3">
                L'ecosistema intelligente per la gestione delle trasferte
                aziendali e delle note spese. Tutto in un unico gestionale.
              </p>

              {/* Pulsante vai al gestionale */}
              <div className="flex flex-wrap items-center gap-4 animate-fade-in-up stagger-4">
                {/* group: gruppo di animazione (influenza gli elementi interni al bottone) */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-white text-gray-900 hover:bg-white/90 transition-all duration-300 shadow-xl shadow-white/10"
                >
                  Vai al Gestionale
                  {/* Incona frecci animata */}
                  {/* group-hover:translate-x-1: quando l'utente passa il mouse su un punto del pulsante la freccia si sposta a destra di 4px */}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Card features a destra */}
            {/* flex flex-col gap-4: card messe in colonna distanziate di 16px l'una dall'altra */}
            <div className="flex flex-col gap-4 animate-slide-in-right stagger-3">
              {[
                {
                  icon: Plane,
                  title: "Gestione Trasferte",
                  desc: "Crea e monitora le trasferte del tuo team in tempo reale.",
                  color: "#2e67c5",
                },
                {
                  icon: Receipt,
                  title: "Note Spese Smart",
                  desc: "Upload scontrini, categorizzazione automatica e rimborsi veloci.",
                  color: "#0c8e63",
                },
                {
                  icon: Shield,
                  title: "Travel Policy",
                  desc: "Controllo automatico dei massimali per ogni categoria di spesa.",
                  color: "#f59e0b",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  // - bg-white/10 backdrop-blur-md: effetto vetro lucido sul video di sfondo
                  // - hover:bg-white/15 hover:border-white/35: quando passi sopra con il mouse la card si schiarisce e il bordo si nota di più
                  // - shadow-xl shadow-black/20: forte ombra nera morbida per staccare la card dallo sfondo in movimento
                  className="group p-5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/15 hover:border-white/35 transition-all duration-300 cursor-pointer shadow-xl shadow-black/20"
                  style={{ animationDelay: `${0.4 + i * 0.15}s` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icona della card 
                    shrink-0: impedisce all'icona di rimpicciolirsi o schiacciarsi se il testo a destra è molto lungo */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-white/20"
                      style={{ backgroundColor: `${feature.color}30` }}
                    >
                      <feature.icon
                        size={20}
                        style={{ color: feature.color }}
                      />
                    </div>
                    {/* Testi interni alla card */}
                    <div>
                      {/* drop-shadow-sm: aggiunge una piccola ombra sotto le lettere */}
                      <h3 className="text-white font-bold text-sm mb-1 tracking-wide drop-shadow-sm">
                        {feature.title}
                      </h3>
                      <p className="text-white/80 font-medium text-xs leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator 
          pb-8: rientro dal fondo della pagina per non toccare il bordo dello schermo*/}
          <div
            className="pb-8 flex flex-col items-center gap-2 z-10"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <span className="text-white/40 text-xs uppercase tracking-widest">
              Scorri
            </span>
            <ChevronDown size={18} className="text-white/40" />
          </div>
        </div>
      </div>

      {/* SEZIONE INFERIORE 
       py-24: grande spazio bianco sopra e sotto per dividere le sezioni*/}
      <div className="bg-[var(--colore-sfondo-pagina)] py-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          {/* GRIGLIA 3 CARD */}
          {/* md:grid-cols-3: scatta a 3 colonne dai tablet in poi (md:) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {/* Card 1 
            - bg-white: sfondo bianco 
              - hover:-translate-y-1: la card si solleva di 4px verso l'alto quando ci passi sopra il mouse
              - shadow-xl shadow-slate-200/50: ombra */}
            <div className="bg-[var(--colore-sfondo-card)] p-8 rounded-2xl border border-[var(--colore-bordo)] flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-all duration-300 shadow-xl">
              {/* Cerchietto Icona Azzurro */}
              <div className="p-4 bg-[var(--colore-sfondo-alt)] text-[var(--colore-primario)] rounded-2xl border border-[var(--colore-bordo)] shadow-sm">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[var(--colore-testo-principale)] tracking-wide">
                -25% Costi Operativi
              </h3>
              <p className="text-[var(--colore-testo-secondario)] text-sm leading-relaxed">
                Ottimizza il budget aziendale. Grazie al controllo automatizzato
                delle policy eviti sforamenti e riduci le spese di trasferta fin
                dal primo mese.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[var(--colore-sfondo-card)] p-8 rounded-2xl border border-[var(--colore-bordo)] flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <div className="p-4 bg-[var(--colore-sfondo-alt)] text-[var(--colore-primario-luce)] rounded-2xl border border-[var(--colore-bordo)] shadow-sm">
                <Globe className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[var(--colore-testo-principale)] tracking-wide">
                Tutto in un Unico Hub
              </h3>
              <p className="text-[var(--colore-testo-secondario)] text-sm leading-relaxed">
                Dì addio a fogli Excel e software frammentati. Gestisci
                itinerari, approvazioni e rimborsi in un click, ovunque si trovi
                il tuo team.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[var(--colore-sfondo-card)] p-8 rounded-2xl border border-[var(--colore-bordo)] flex flex-col items-center text-center space-y-4 hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <div className="p-4 bg-[var(--colore-sfondo-alt)] text-[var(--colore-secondario)] rounded-2xl border border-[var(--colore-bordo)] shadow-sm">
                <Bot className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[var(--colore-testo-principale)] tracking-wide">
                Zero Stress Burocratico
              </h3>
              <p className="text-[var(--colore-testo-secondario)] text-sm leading-relaxed">
                Rimborsi lampo con la digitalizzazione smart degli scontrini.
                Riduci del 70% il carico di lavoro amministrativo per dipendenti
                e contabilità.
              </p>
            </div>
          </div>

          {/* SEZIONE CHI SIAMO + PARAGRAFI AZIENDALI */}
          {/* border-t border-slate-200 pt-16: linea divisoria grigia e distanzia di 64px */}
          <div className="max-w-7xl mx-auto space-y-16 border-t border-[var(--colore-bordo)] pt-16">
            {/* max-w-3xl mx-auto: stringe il testo centralmente */}
            <div className="max-w-3xl mx-auto text-center space-y-6">
              {/* text-3xl sm:text-4xl font-extrabold: titolo grande e in grassetto */}
              <h2 className="text-3xl font-extrabold text-[var(--colore-testo-principale)] tracking-tight sm:text-4xl">
                Chi siamo e cosa facciamo
              </h2>
              {/* text-base sm:text-lg leading-relaxed: aumenta l'interlinea */}
              <p className="text-[var(--colore-testo-secondario)] text-base sm:text-lg leading-relaxed">
                Siamo nati con l'obiettivo di trasformare la gestione della
                mobilità aziendale da un labirinto burocratico a un processo
                fluido, transparent e privo di attriti. Crediamo che il tempo
                dei collaboratori sia la risorsa più preziosa di un'azienda: per
                questo abbiamo sviluppato una piattaforma intelligente capace di
                centralizzare la pianificazione dei viaggi, l'approvazione dei
                flussi e il monitoraggio dei budget in tempo reale, abbattendo
                le distanze tra l'amministrazione e chi viaggia per business.
              </p>
              <p className="text-[var(--colore-testo-secondario)] text-base sm:text-lg leading-relaxed">
                Attraverso algoritmi di categorizzazione automatica e sistemi
                avanzati per il controllo delle travel policy, aiutiamo le
                imprese a digitalizzare integralmente la gestione delle note
                spese e degli scontrini. Con la nostra soluzione cloud
                eliminiamo definitivamente la carta e gli errori manuali,
                garantendo la massima conformità fiscale e restituendo alle
                aziende il pieno controllo finanziario su ogni singola
                trasferta.
              </p>
            </div>

            {/* grid-cols-1 lg:grid-cols-2: griglia a due macro colonne (immagine a sinistra, spiegazione tecnica dei ruoli a destra) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-10 border-t border-[var(--colore-bordo)]">
              {/* COLONNA DI SINISTRA: SCREENSHOT DEL SOFTWARE (CON EFFETTO STICKY) */}
              <div className="sticky top-6 group">
                <div className="relative overflow-hidden rounded-2xl border border-[var(--colore-bordo)] shadow-2xl bg-[var(--colore-sfondo-card)] p-2 transition-all duration-300 group-hover:shadow-slate-800/10 group-hover:-translate-y-1">
                  <img
                    src={dashboardImg}
                    alt="Business Travel Dashboard Operativa"
                    className="w-full h-auto rounded-xl object-cover"
                  />
                  {/* ring-1 ring-inset ring-slate-900/10: crea un contorno interno */}
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-slate-900/10 pointer-events-none" />
                </div>
              </div>

              {/* Colonna Destra: Portal Overview e Funzionalità */}
              <div className="space-y-8">
                {/* Overview */}
                <div className="bg-[var(--colore-sfondo-card)] p-6 rounded-2xl border border-[var(--colore-bordo)] shadow-sm space-y-4">
                  <h3 className="text-xl font-bold text-[var(--colore-testo-principale)] flex items-center gap-2">
                    {/* Linea verticale a sinistra del titolo */}
                    <div className="w-2 h-6 bg-blue-600 rounded-full" />
                    Portal Overview
                  </h3>
                  <p className="text-[var(--colore-testo-secondario)] text-sm leading-relaxed font-medium">
                    Questo applicativo è un gestionale aziendale di livello
                    Enterprise progettato per digitalizzare, ottimizzare e
                    monitorare l'intero ciclo di vita delle trasferte dei
                    dipendenti e la gestione delle relative note spese.
                  </p>
                  <p className="text-[var(--colore-testo-secondario)] text-sm leading-relaxed">
                    Il sistema offre due interfacce e flussi di lavoro distinti
                    in base al ruolo dell'utente loggato (User o Admin),
                    garantendo massima sicurezza dei dati e flussi di
                    approvazione fluidi.
                  </p>
                </div>

                {/*Funzionalità Principali */}
                <div className="bg-[var(--colore-sfondo-card)] p-6 rounded-2xl border border-[var(--colore-bordo)] shadow-sm space-y-4">
                  <h3 className="text-xl font-bold text-[var(--colore-testo-principale)] flex items-center gap-2">
                    <div className="w-2 h-6 bg-emerald-600 rounded-full" />
                    Funzionalità Principali
                  </h3>
                  <p className="text-[var(--colore-testo-secondario)] text-sm leading-relaxed font-medium">
                    La piattaforma centralizza le attività quotidiane con moduli
                    intelligenti e dashboard personalizzate per ogni tipo di
                    utente.
                  </p>
                  <p className="text-[var(--colore-testo-secondario)] text-sm leading-relaxed">
                    I <strong>dipendenti</strong> hanno un'area privata per
                    pianificare i viaggi, caricare le ricevute online e
                    controllare i rimborsi.
                    <br />
                    Gli <strong>amministratori</strong>, invece, dispongono di
                    strumenti centralizzati per gestire le Travel Policies in
                    tempo reale, approvare le richieste in modo sicuro e
                    accedere a un archivio storico per il monitoraggio fiscale e
                    l'analisi dei dati.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
