import { UserCircle, Mail, Shield, MapPin, Plane, Compass, Award } from "lucide-react";
import { mockUtenti, mockTrasferte } from "../mockData";

export function ProfiloUtente({ utenteSessione }) {
    // controlla se c'è un utente loggato, altrimenti prende il primo utente di test dal file mockData.
    const utente = utenteSessione || mockUtenti.find(u => u.id === 1 || u.id === "1");

    // prendo i viaggi dell'utente corrente e li ordino dal più recente al più vecchio
    //se l'utente non è loggato, trasferteUtente sarà un array vuoto.
    const trasferteUtente = utente
        ? mockTrasferte
        // scorro la lista di tutte le trasferte e filtro solo quelle che contiene i viaggi dell'utente logato
            .filter(t => t.id_utente === utente.id)
            .sort((a, b) => {
                const dataA = a.data_inizio ? new Date(a.data_inizio) : new Date(0);
                const dataB = b.data_inizio ? new Date(b.data_inizio) : new Date(0);
                return dataB - dataA; 
            })
        : [];

    // 3. RAGGRUPPAMENTO PER REGIONE
    const regioniVisitate = {};
    trasferteUtente.forEach((trasferta) => {
        const nomeLuogo = trasferta.regione || trasferta.destinazione || "Non specificata";
        if (!regioniVisitate[nomeLuogo]) {
            regioniVisitate[nomeLuogo] = 0;
        }
        regioniVisitate[nomeLuogo]++;
    });

    const regioni = Object.entries(regioniVisitate);

    // Immagini premium da Unsplash per le card delle regioni
    const immaginiPlaceholder = [
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80", 
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80", 
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", 
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80"  
    ];

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-[var(--colore-sfondo-card)] min-h-screen antialiased text-[var(--colore-testo-principale)]" style={{ fontFamily: 'var(--font-principale)' }}>
            
            {/* CONTAINER CENTRALIZZATO */}
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* 1. CARD UTENTE PREMIUM (Sfrutta il Blu Notte, il Blu Brillante e l'Ottanio per un gradiente magnetico) */}
                <div className="relative group max-w-3xl mx-auto sm:mx-0">
                    {/* Alone di luce dinamico basato sul tuo colore primario luce */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--colore-primario-luce)] to-[var(--colore-secondario-luce)] rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition duration-300"></div>
                    
                    {/* Corpo della Card */}
                    <div className="relative bg-gradient-to-br from-[var(--colore-primario-scuro)] via-[var(--colore-primario)] to-[var(--colore-secondario)] rounded-3xl p-8 shadow-xl border border-white/10 transition-all duration-500 hover:scale-[1.01] text-white">
                        <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                            
                            {/* Avatar animato */}
                            <div className="relative flex items-center justify-center shrink-0">
                                <div className="absolute inset-0 bg-white/10 rounded-full blur-md animate-pulse"></div>
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-white to-[var(--colore-primario-luce)] p-[3px] shadow-md transform transition-transform duration-700 group-hover:rotate-12">
                                    <div className="w-full h-full bg-[var(--colore-primario-scuro)] rounded-full flex items-center justify-center text-white">
                                        <UserCircle size={60} />
                                    </div>
                                </div>
                            </div>

                            {/* Info Utente */}
                            <div className="flex-grow space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-3">
                                    <h1 className="text-3xl font-bold tracking-tight text-white m-0" style={{ fontWeight: 'var(--peso-bold)' }}>
                                        {utente?.nome_completo || "Corporate Traveler"}
                                    </h1>
                                    
                                    {/* Badge Ruolo usando l'opacità bianca per non spezzare il gradiente */}
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wide bg-white/15 text-white border border-white/20 shadow-sm" style={{ fontWeight: 'var(--peso-semibold)' }}>
                                        <Shield size={12} />
                                        {utente?.ruolo || "user"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-center sm:justify-start gap-2.5 text-white/80 text-sm hover:text-white transition-colors duration-300 w-fit mx-auto sm:mx-0">
                                    <Mail size={16} className="text-[var(--colore-secondario-luce)]" />
                                    <span className="tracking-wide" style={{ fontWeight: 'var(--peso-medio)' }}>{utente?.email || "nessuna-email@azienda.com"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTATORI DASHBOARD (Utilizzano i colori di sfondo dei feedback/stati per variare con eleganza) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* CARD: VIAGGI TOTALI */}
                    <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-primario-luce)] transition-all duration-300 flex items-center justify-between group">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0" style={{ fontWeight: 'var(--peso-bold)' }}>Viaggi Totali</p>
                            <h3 className="text-4xl mt-2 text-[var(--colore-primario-scuro)] m-0 tracking-tight group-hover:text-[var(--colore-primario-luce)] transition-colors duration-300" style={{ fontWeight: 'var(--peso-bold)' }}>{trasferteUtente.length}</h3>
                        </div>
                        <div className="p-3 bg-[var(--colore-sfondo-alt)] rounded-xl text-[var(--colore-primario)] group-hover:scale-110 group-hover:bg-[var(--colore-bordo-focus)]/30 transition-all duration-300">
                            <Plane size={24} />
                        </div>
                    </div>

                    {/* CARD: REGIONI ESPLORATE */}
                    <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-secondario)] transition-all duration-300 flex items-center justify-between group">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0" style={{ fontWeight: 'var(--peso-bold)' }}>Regioni Esplorate</p>
                            <h3 className="text-4xl mt-2 text-[var(--colore-primario-scuro)] m-0 tracking-tight group-hover:text-[var(--colore-secondario)] transition-colors duration-300" style={{ fontWeight: 'var(--peso-bold)' }}>{regioni.length}</h3>
                        </div>
                        <div className="p-3 bg-[var(--colore-info-sfondo)] rounded-xl text-[var(--colore-secondario)] group-hover:scale-110 group-hover:bg-[var(--colore-secondario-luce)]/20 transition-all duration-300">
                            <Compass size={24} />
                        </div>
                    </div>

                    {/* CARD: ULTIMA META */}
                    <div className="bg-[var(--colore-sfondo-card)] rounded-2xl p-6 border border-[var(--colore-bordo)] shadow-md hover:border-[var(--colore-accento)] transition-all duration-300 flex items-center justify-between group">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[var(--colore-testo-secondario)] m-0" style={{ fontWeight: 'var(--peso-bold)' }}>Ultima Meta</p>
                            <h3 className="text-xl mt-3 text-[var(--colore-testo-principale)] truncate max-w-[180px] m-0 group-hover:text-[var(--colore-accento)] transition-colors duration-300" style={{ fontWeight: 'var(--peso-semibold)' }}>
                                {trasferteUtente[0]?.destinazione || "-"}
                            </h3>
                        </div>
                        <div className="p-3 bg-[var(--colore-avviso-sfondo)] rounded-xl text-[var(--colore-accento)] group-hover:scale-110 transition-all duration-300">
                            <Award size={24} />
                        </div>
                    </div>
                </div>

                {/* SEZIONE CARD REGIONI SPAZIALI */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-1 bg-gradient-to-b from-[var(--colore-primario)] to-[var(--colore-secondario)] rounded-full"></div>
                        <h2 className="text-2xl tracking-tight text-[var(--colore-primario-scuro)] m-0" style={{ fontWeight: 'var(--peso-bold)' }}>
                            Riepilogo Esplorazioni
                        </h2>
                    </div>

                    {/* GRIGLIA CARD REGIONI (White/Spaziale con Variabili) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {regioni.map(([nomeLuogo, numeroViaggi], index) => {
                            const urlImmagine = immaginiPlaceholder[index % immaginiPlaceholder.length];

                            return (
                                <div 
                                    key={nomeLuogo} 
                                    className="group relative bg-[var(--colore-sfondo-card)] rounded-2xl overflow-hidden border border-[var(--colore-bordo)] shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out"
                                >
                                    {/* IMMAGINE CON ANIMAZIONE ZOOM SPAZIALE */}
                                    <div className="h-44 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--colore-sfondo-card)] via-transparent to-transparent z-10" />
                                        <img 
                                            src={urlImmagine} 
                                            alt={nomeLuogo}
                                            className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out filter contrast-[1.02]" 
                                        />
                                        
                                        {/* Pin Geografico Fluttuante */}
                                        <div className="absolute top-4 left-4 z-20 p-2 bg-[var(--colore-sfondo-card)]/90 backdrop-blur-md rounded-xl text-[var(--colore-secondario)] border border-[var(--colore-bordo)] shadow-sm group-hover:bg-[var(--colore-secondario)] group-hover:text-white group-hover:border-[var(--colore-secondario)] transition-all duration-300">
                                            <MapPin size={18} />
                                        </div>
                                    </div>
                                    
                                    {/* CONTENUTO CARD */}
                                    <div className="p-5 relative z-20 bg-[var(--colore-sfondo-card)]">
                                        <h3 className="text-[var(--colore-testo-principale)] text-lg m-0 mb-4 tracking-tight group-hover:text-[var(--colore-primario-luce)] transition-colors duration-300" style={{ fontWeight: 'var(--peso-bold)' }}>
                                            {nomeLuogo}
                                        </h3>

                                        {/* FOOTER CARD CON CONTATORE INTERATTIVO */}
                                        <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--colore-bordo)]">
                                            <span className="text-[var(--colore-testo-secondario)] font-medium tracking-wide flex items-center gap-1.5">
                                                <Plane size={14} className="text-[var(--colore-testo-mutato)] group-hover:translate-x-1 transition-transform duration-300" /> 
                                                Trasferte fatte
                                            </span>
                                            
                                            {/* Contatore che cambia colore con l'hover sulla card */}
                                            <span 
                                                className="text-sm px-3 py-1 rounded-lg border text-[var(--colore-secondario)] bg-[var(--colore-info-sfondo)] border-[var(--colore-info)]/20 group-hover:bg-[var(--colore-secondario)] group-hover:text-white group-hover:border-[var(--colore-secondario)] transition-all duration-300 shadow-sm"
                                                style={{ fontWeight: 'var(--peso-bold)' }}
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