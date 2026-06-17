import { TrendingUp, Globe, Bot, ArrowRight } from 'lucide-react';
import video from '../assets/img/video.mp4'

export default function Homepage() {
    return (
        // colore sfondo pagina, occupa almeno il 100% dell'altezza schermo 
        <div className="bg-[#FFFDF9] min-h-screen text-gray-800 font-sans">

            {/* Larghezza massima blocco 1280px (7xl) 
            mx auto -> centra il blocco in mezzo alla pagina quando
            lo schermo è più grande di 1280px 
            px -> applica padding a destra e sinistra
            pt -> padding top
            pb padding bottom
            Sugli schermi piccoli va tutto su una sola colonna
            Su schermi grandi lo schermo sii divide in due colonne
            items center -> allinea il testo a sinistra e il video a destra */}
            <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Testi sinistra */}
                <div className="space-y-6">
                    {/* tracking widest -> lettere spaziate */}
                    <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm sm:text-base">
                        ENTERPRISE SOLUTION 2026
                    </span>
                    <h1 className="text-5xl font-light uppercase text-gray-900 tracking-widest font-sans">
                        Business <br /> Travel
                    </h1>
                    {/* text-lg sm:text-xl -> dimensione testo schermi piccoli e grandi 
                    max-w-md -> larghezza massima testo 
                    leading-relaxed -> altezza interlinea */}
                    <p className="text-lg sm:text-xl text-gray-600 max-w-md leading-relaxed">
                        L'ecosistema intelligente per la gestione delle trasferte aziendali e delle note spese.
                    </p>
                    {/* Linea indaco */}
                    <div className="h-1 w-full bg-indigo-600 rounded-full"></div>
                </div>

                {/* Video a destra */}
                <div className="flex justify-center md:justify-end">
                    {/* bg-white p-4 -> sfondo bianco + padding interna 16px
                    max-w-md w-full -> card non supererà i 448px di larghezza si stringerà su schermi piccoli */}
                    <div className="bg-white p-4 rounded-3xl shadow-xl shadow-gray-300 max-w-md w-full border border-gray-50 transform hover:scale-[1.02] transition-transform duration-300">
                        <video
                            src={video}
                            className="rounded-2xl w-full h-80 object-cover bg-gray-100"
                            autoPlay
                            loop
                            muted
                            // Non permette agli schermi piccoli di aprire il video a tutto schermo
                            playsInline
                        />
                    </div>
                </div>
            </header>

            {/* MARKET OPPORTUNITY */}
            <section className="bg-[#FFFDF9] py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4 mb-12">
                    <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
                    {/* tracking-wide -> aumenta spazio tra le lettere */}
                    <h2 className="text-3xl font-serif font-bold tracking-wide text-indigo-500 uppercase">
                        Market Opportunity
                    </h2>
                </div>

                {/* Griglia 3 card*/}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-300 border border-gray-50 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-shadow">
                        <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-400">
                            <TrendingUp className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-indigo-500">€1.5 Trillion</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Spesa globale per viaggi d'affari prevista per il 2026.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-300 border border-gray-50 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-shadow">
                        <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-400">
                            <Globe className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-indigo-500">Italy Leader</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            L'Italia è il mercato con il CAGR più alto in Europa per la crescita dei servizi di Business Travel.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-300 border border-gray-50 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-shadow">
                        <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-400">
                            <Bot className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-indigo-500">75% Automation</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Delle aziende sta migrando verso sistemi automatizzati per ridurre il carico amministrativo.
                        </p>
                    </div>

                </div>

                {/* Bottone */}
                <div className="flex justify-center pt-8">
                    <a
                        href="#gestionale"
                        className="group flex items-center space-x-4 bg-indigo-600 text-white text-xl font-semibold px-12 py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    >
                        <span>Vai al Gestionale</span>
                        <ArrowRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

            </section>
        </div>
    );
}