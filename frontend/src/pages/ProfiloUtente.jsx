import React, { useEffect } from "react";
import { UserCircle, Mail, Shield, MapPin, Plane, Compass, Award } from "lucide-react";
import { useStore } from "../store/store"; // 🔥 AGGANCIO ALLO STORE REALE

export function ProfiloUtente() {
    // LEGGiamo l'utente reale loggato nella sessione attuale
    const utente = JSON.parse(localStorage.getItem('utente') || 'null');

    // PRENDIAMO lo stato e le funzioni dal nostro Store globale
    const { trasferte, fetchTrasferte, isLoading } = useStore();

    // Carichiamo le trasferte dal server non appena la pagina si apre
    useEffect(() => {
        fetchTrasferte();
    }, [fetchTrasferte]);

    // prendo i viaggi dell'utente corrente e li ordino dal più recente al più vecchio
    //se l'utente non è loggato, trasferteUtente sarà un array vuoto.
    const trasferteUtente = utente
        ? trasferte
         // scorro la lista di tutte le trasferte e filtro solo quelle che contiene i viaggi dell'utente logato
            .filter(t => t.id_utente === utente.id)
            .sort((a, b) => {
                // controlla se il viaggio ha una data valida, altrimenti assegna una data molto vecchia (new Date(0)) per posizionarlo alla fine della lista
                const dataA = a.data_inizio ? new Date(a.data_inizio) : new Date(0);
                const dataB = b.data_inizio ? new Date(b.data_inizio) : new Date(0);
                // ordino la data in maniera decrescente, quindi i viaggi più recenti appaiono prima.
                // se il risultato della sottrazione è positivo, l'elemento viene spostato prima; se è negativo, viene spostato dopo.
                return dataB - dataA;
            })
        : [];

    // RAGGRUPPAMENTO PER REGIONE / DESTINAZIONE (Dati reali dal DB)
    // creo oggetto per contare quante volte l'utente ha visitato ogni regione. Se la regione non è specificata, assegna "Non specificata".
    const regioniVisitate = {};
    // forEach prende la lista dei viaggi dell'utente e per ogni viaggio esegue la funzione che conta le visite per regione.
    trasferteUtente.forEach((trasferta) => {
         //cerca se nella trasferta esiste la regione, altrimenti prendi la destinazione, altrimenti assegna "Non specificata"
        const nomeLuogo = trasferta.regione || trasferta.destinazione || "Non specificata";
        //controlla se la regione è già presente nell'oggetto regioniVisitate, se non lo è, inizializza il contatore a 0. Poi incrementa il contatore per quella regione.
        if (!regioniVisitate[nomeLuogo]) {
            regioniVisitate[nomeLuogo] = 0;
        }
        regioniVisitate[nomeLuogo]++;
    });
    //object.entries prende l'oggetto regioniVisitate e lo trasforma in un array di coppie chiave-valore, dove ogni coppia rappresenta una regione e il numero di viaggi effettuati in quella regione.
    const regioni = Object.entries(regioniVisitate);

    // Immagini placeholder premium per le card
    const immaginiPlaceholder = [
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80"
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-[var(--colore-testo-mutato)]">Sincronizzazione profilo in corso... ⏳</div>;
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-[var(--colore-sfondo-card)] min-h-screen antialiased text-[var(--colore-testo-principale)]" style={{ fontFamily: 'var(--font-principale)' }}>
            {/* CONTAINER CENTRALIZZATO */}
            {/* max-w-7xl: limita la larghezza massima del contenitore a 1280px, centrato orizzontalmente con mx-auto. */}
            {/* space-y-10: crea uno spazio verticale di 40px tra gli elementi figli del contenitore (card, contattori, regioni). */}
            <div className="max-w-7xl mx-auto space-y-10">

                {/* 1. CARD UTENTE (Sfrutta il Blu Notte, il Blu Brillante e l'Ottanio per un gradiente magnetico) */}
                {/* con relative rendo il contenitore della card un riferimento per gli elementi assoluti al suo interno, come l'alone di luce dinamico.
                 group permette di applicare stili agli elementi figli quando si passa con il mouse sopra. */}
                 {/* max-w-3xl impedisce alla card di diventare troppo larga; mx-auto centra la card su schermi piccoli;sm:mx-0: si allinea a sinistra su schermi grandi */}
                <div className="relative group max-w-3xl mx-auto sm:mx-0">
                    {/* ombra posizionata sotto la card reale. si posiziona in modo assoluto rispetto al pare;inset-1 applica un margine negativo di 4px su tutti i lati(significa che è leggermente più grande della card) 
                    creo un gradiente da sinstra verso destra con bg from...to; arrotondo gli angoli con rounder e applico sfocatura con blur-lg che trasforma il gradiente in un alone;
                    inizialmente opacità al 20% e poi 40%quando si passa con il mouse*/}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--colore-primario-luce)] to-[var(--colore-secondario-luce)] rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition duration-300"></div>

                    {/* Corpo della Card */}
                    {/* creo gradiente diagonale con 3 colori con bg...via...to; spazio interno di 32px con p-8;
                    quando l'utente passa con il mouse, la card si ingrandisce dell'1% con scale-[1.01] e dura mezzo secondo*/}
                    <div className="relative bg-gradient-to-br from-[var(--colore-primario-scuro)] via-[var(--colore-primario)] to-[var(--colore-secondario)] rounded-3xl p-8 shadow-xl border border-white/10 transition-all duration-500 hover:scale-[1.01] text-white">
                        {/* su smartphone l'avatar e i testi sono impilati in verticale con flex-col mentre da schermi più grandi(sm)si dispongono in orizzontale
                        centro gli elemnti e imposto una distanza di 32px tra avatar e testi; su mobile testo centrato mentre su dextop allineato a sinistra */}
                        <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                            {/* Avatar animato */}
                            {/* con shrink-0 blocco le dimensioni dell'avatar per evitare che si riduca quando la card si restringe su schermi piccoli. */}
                            <div className="relative flex items-center justify-center shrink-0">
                                {/* rounder-full rende l'avatar circolare, eggermente sbiancato (bg-white/10) e sfocato (blur-md), posizionato dietro l'avatar. 
                                Usa la classe nativa animate-pulse per dare l'impressione che pulsa */}
                                <div className="absolute inset-0 bg-white/10 rounded-full blur-md animate-pulse"></div>
                                {/* anello esterno colorato dell'avatar grande 96x96px e padding di 3px (p-[3px]); bg gradiente to...form... mette il gradiente del bordo dall'angolo in basso sx a quello in alto dx;
                                quando si fa hover sul avatar, l'anello ruota di 12 gradi */}
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-white to-[var(--colore-primario-luce)] p-[3px] shadow-md transform transition-transform duration-700 group-hover:rotate-12">
                                    {/* cerchio nfinale dell'avatar con sfondo scuro e icona utente bianca al centro. siccome il cerchio precedente aveva un padding di 3px, questo div si blocca a 3px dal bordo*/}
                                    <div className="w-full h-full bg-[var(--colore-primario-scuro)] rounded-full flex items-center justify-center text-white">
                                        <UserCircle size={60} />
                                    </div>
                                </div>
                            </div>

                             {/* Info Utente */}
                            {/* contenitore delle info utente. flex-grow: Dice a questo blocco di espandersi e occupare tutto lo spazio orizzontale rimasto libero dopo che l'avatar si è posizionato a sinistra.
                             space-y-3: Applica un margine verticale costante di 12px tra la riga del nome e la riga dell'email, tenendole separate in modo ordinato.*/}
                            <div className="flex-grow space-y-3">
                                {/* nome +badge ruolo su mobile sono uno sopra l'altro con flex-col mentre su schermi grandi sono affiancati sulla stessa linea con sm:flex-row 
                                gap-3 mantiene distanza fissa di 12px tra nome e badge*/}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-3">
                                    {/* text-3xl dimensione del titolo di circa 30px; tracking-tight: Riduce leggermente lo spazio tra le lettere rendendole visibilmente più compatte
                                     text-white m-0: Colora il testo di bianco puro per farlo risaltare sul fondo scuro*/}
                                    <h1 className="text-3xl font-bold tracking-tight text-white m-0" style={{ fontWeight: 'var(--peso-bold)' }}>
                                        {utente?.nome_completo || "Viaggiatore Aziendale"}
                                    </h1>
                                    {/* Badge Ruolo usando l'opacità bianca*/}
                                    {/* inline-flex items-center gap-1.5: Allinea l'icona dello scudo (<Shield />) e il testo del ruolo sulla stessa riga, distanziandoli di 6px (gap-1.5). 
                                    text-xs uppercase tracking-wide: Testo molto piccolo, tutto in maiuscolo e con le lettere leggermente più spaziate (tracking-wide).bg-white/15: sfondo bianco puro ma con un'opacità al 15%.*/}
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wide bg-white/15 text-white border border-white/20 shadow-sm" style={{ fontWeight: 'var(--peso-semibold)' }}>
                                        <Shield size={12} />
                                        {utente?.ruolo || "user"}
                                    </span>
                                </div>
                                {/* riga email con icona mail */}
                                {/* flex items-center justify-center sm:justify-start gap-2.5: Allinea l'icona e l'indirizzo mail sulla stessa riga, centrati su schermi piccoli e allineati a sinistra su schermi grandi, con uno spazio di 10px tra loro (gap-2.5).
                                text-white/80: Colore del testo bianco con opacità all'80%. text-sm: Imposta la dimensione del testo a circa 14px
                                hover:text-white transition-colors duration-300: Quando l'utente passa il mouse sopra questa riga, il colore del testo cambia gradualmente a bianco puro in 300 millisecondi.Su desktop, sm:mx-0 annulla il centraggio e lo spinge a sinistra. */}
                                <div className="flex items-center justify-center sm:justify-start gap-2.5 text-white/80 text-sm hover:text-white transition-colors duration-300 w-fit mx-auto sm:mx-0">
                                    <Mail size={16} className="text-[var(--colore-secondario-luce)]" />
                                    {/* tracking-wide: aumenta leggermente lo spazio tra le lettere. */}
                                    <span className="tracking-wide" style={{ fontWeight: 'var(--peso-medio)' }}>{utente?.email || "nessuna-email@azienda.com"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTATORI DASHBOARD  */}
                {/* attivo la modalità grid layout con grid-cols-1 per schermi piccoli (1 colonna) e md:grid-cols-3 per schermi medi e più grandi (3 colonne). gap-6 crea uno spazio di 24px tra le card. */} 
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* CARD: VIAGGI TOTALI */}
                    {/* bg:colore bianco background. con border border... creo una linea grigio chiaro; flex items-center justify-between: Dispone i due macro-blocchi interni (i testi a sinistra e l'icona a destra) sulla stessa linea. items-center li allinea perfettamente al centro in verticale, mentre justify-between li spinge ai due estremi opposti della card
                     group: Identifica la card come "capogruppo", permettendo ai testi e all'icona interni di reagire all'unisono quando l'utente fa hover sulla card. */}
                    <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-primario-luce)] transition-all duration-300 flex items-center justify-between group">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0" style={{ fontWeight: 'var(--peso-bold)' }}>Trasferte Totali</p>
                            <h3 className="text-4xl mt-2 text-[var(--colore-primario-scuro)] m-0 tracking-tight group-hover:text-[var(--colore-primario-luce)] transition-colors duration-300" style={{ fontWeight: 'var(--peso-bold)' }}>{trasferteUtente.length}</h3>
                        </div>
                        <div className="p-3 bg-[var(--colore-sfondo-alt)] rounded-xl text-[var(--colore-primario)] group-hover:scale-110 group-hover:bg-[var(--colore-bordo-focus)]/30 transition-all duration-300">
                            <Plane size={24} />
                        </div>
                    </div>

                    <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-secondario)] transition-all duration-300 flex items-center justify-between group">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0" style={{ fontWeight: 'var(--peso-bold)' }}>Copertura Territoriale</p>
                            <h3 className="text-4xl mt-2 text-[var(--colore-primario-scuro)] m-0 tracking-tight group-hover:text-[var(--colore-secondario)] transition-colors duration-300" style={{ fontWeight: 'var(--peso-bold)' }}>{regioni.length}</h3>
                        </div>
                        <div className="p-3 bg-[var(--colore-info-sfondo)] rounded-xl text-[var(--colore-secondario)] group-hover:scale-110 group-hover:bg-[var(--colore-secondario-luce)]/20 transition-all duration-300">
                            <Compass size={24} />
                        </div>
                    </div>

                    <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-accento)] transition-all duration-300 flex items-center justify-between group">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0" style={{ fontWeight: 'var(--peso-bold)' }}>Ultima Trasferta</p>
                            <h3 className="text-xl mt-3 text-[var(--colore-testo-principale)] truncate max-w-[180px] m-0 group-hover:text-[var(--colore-accento)] transition-colors duration-300" style={{ fontWeight: 'var(--peso-semibold)' }}>
                                {trasferteUtente[0]?.destinazione || "-"}
                            </h3>
                        </div>
                        <div className="p-3 bg-[var(--colore-avviso-sfondo)] rounded-xl text-[var(--colore-accento)] group-hover:scale-110 transition-all duration-300">
                            <Award size={24} />
                        </div>
                    </div>
                </div>

                {/* RIEPILOGO REALE ESPLORAZIONI */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-1 bg-gradient-to-b from-[var(--colore-primario)] to-[var(--colore-secondario)] rounded-full"></div>
                        <h2 className="text-2xl tracking-tight text-[var(--colore-primario-scuro)] m-0" style={{ fontWeight: 'var(--peso-bold)' }}>
                            Panoramica Territoriale
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {regioni.map(([nomeLuogo, numeroViaggi], index) => {
                            const urlImmagine = immaginiPlaceholder[index % immaginiPlaceholder.length];

                            return (
                                <div key={nomeLuogo} className="group relative bg-[var(--colore-sfondo-card)] rounded-2xl overflow-hidden border border-[var(--colore-bordo)] shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out">
                                    <div className="h-44 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--colore-sfondo-card)] via-transparent to-transparent z-10" />
                                        <img src={urlImmagine} alt={nomeLuogo} className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out filter contrast-[1.02]" />
                                        <div className="absolute top-4 left-4 z-20 p-2 bg-[var(--colore-sfondo-card)]/90 backdrop-blur-md rounded-xl text-[var(--colore-secondario)] border border-[var(--colore-bordo)] shadow-sm group-hover:bg-[var(--colore-secondario)] group-hover:text-white group-hover:border-[var(--colore-secondario)] transition-all duration-300">
                                            <MapPin size={18} />
                                        </div>
                                    </div>

                                    <div className="p-5 relative z-20 bg-[var(--colore-sfondo-card)]">
                                        <h3 className="text-[var(--colore-testo-principale)] text-lg m-0 mb-4 tracking-tight group-hover:text-[var(--colore-primario-luce)] transition-colors duration-300" style={{ fontWeight: 'var(--peso-bold)' }}>
                                            {nomeLuogo}
                                        </h3>

                                        <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--colore-bordo)]">
                                            <span className="text-[var(--colore-testo-secondario)] font-medium tracking-wide flex items-center gap-1.5">
                                                <Plane size={14} className="text-[var(--colore-testo-mutato)] group-hover:translate-x-1 transition-transform duration-300" />
                                                Trasferte Effettuate
                                            </span>
                                            <span className="text-sm px-3 py-1 rounded-lg border text-[var(--colore-secondario)] bg-[var(--colore-info-sfondo)] border-[var(--colore-info)]/20 group-hover:bg-[var(--colore-secondario)] group-hover:text-white group-hover:border-[var(--colore-secondario)] transition-all duration-300 shadow-sm" style={{ fontWeight: 'var(--peso-bold)' }}>
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