import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoPng from '../assets/img/logo.png';

export default function Footer() {
    return (
        <footer
            /* 
            - Sfondo bg-gray-200 grigio 
            - relative z-10 -> posizionamento sull'asse z, copre elementi
            fissi o assoluti presenti sullo sfondo 
            - border-t: Aggiunge un bordo sottile solo sul lato superiore
            - w-full: Forza il footer a estendersi per tutta la larghezza dello schermo
            - Spinge il footer sempre in fondo alla pagina */
            className="border-t w-full mt-auto relative z-10"
            style={{ backgroundColor: 'var(--colore-sfondo-card)', borderColor: 'var(--colore-bordo)' }}
        >
            {/* 
            - max-w-7xl mx-auto: Limita la larghezza massima
            - px-4 sm:px-6 lg:px-8: Padding orizzontale dinamico
            - py-8: Padding verticale
            */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* dispositivi mobile layout in verticale (flex-col). 
                Dai dispositivi desktop in su (md:), il layout passa in orizzontale */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Logo e Brand */}
                    <div className="flex items-center gap-3">
                        {/* 
                        - group: attiva l'effetto group-hover sui tag interni
                        */}
                        <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
                            <img
                                src={logoPng}
                                alt="Business Travel logo"
                                // h-8 w-8 rounded-xl object-cover shadow-sm: Rende l'immagine del logo quadrata
                                // angoli arrotondati e proporzioni definite
                                // transition-transform duration-200 group-hover:scale-105: Quando si passa il mouse sul logo, 
                                // l'immagine si ingrandisce
                                className="h-8 w-8 rounded-xl object-cover shadow-sm
                                           transition-transform duration-200 group-hover:scale-105"
                            />
                            {/* tracking-widest: Aumenta lo spazio tra le lettere del testo */}
                            <span
                                className="text-lg font-light uppercase tracking-widest font-sans"
                                style={{ color: 'var(--colore-primario-scuro)' }}
                            >
                                Business Travel
                            </span>
                        </Link>
                    </div>

                    {/* Contatti */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
                        <a
                            href="mailto:info@businesstravel.com"
                            className="flex items-center gap-2 text-[var(--colore-testo-secondario)] hover:text-[var(--colore-testo-principale)] transition-colors"
                            style={{ textDecoration: 'none' }}
                        >
                            <Mail size={16} style={{ color: 'var(--colore-testo-mutato)' }} />
                            <span>info@businesstravel.com</span>
                        </a>
                    </div>

                    {/* Link Social del Team */}
                    {/* items-center su mobile (centrato), md:items-end su desktop (allineato a destra) */}
                    <div className="flex flex-col gap-2 items-center md:items-end">
                        
                        {/* Riga GitHub */}
                        <div className="flex items-center gap-2">
                            {/* Etichetta larghezza minima (min-w) per le icone allineate con la riga sotto */}
                            <span className="text-xs mr-1 text-[var(--colore-testo-mutato)] min-w-[55px] text-right">GitHub:</span>

                            {/* Github Sviluppatore 1 */}
                            <a
                                href="https://github.com/realKevv"
                                // Apre il link in una nuova scheda
                                target="_blank"
                                // Parametro di sicurezza per i link esterni
                                rel="noopener noreferrer"
                                title="GitHub Kevin"
                                /* p-2 e rounded-xl creano l'area di interazione si colora di grigio (hover-tema) */
                                className="p-2 rounded-xl hover-tema transition-colors flex items-center justify-center text-[var(--colore-testo-secondario)] hover:text-[var(--colore-testo-principale)]"
                            >
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>

                            {/* Github Sviluppatore 2 */}
                            <a
                                href="https://github.com/biancaandreeacioc"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="GitHub Bianca"
                                className="p-2 rounded-xl hover-tema transition-colors flex items-center justify-center text-[var(--colore-testo-secondario)] hover:text-[var(--colore-testo-principale)]"
                            >
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>

                            {/* Github Sviluppatore 3 */}
                            <a
                                href="https://github.com/AlexanderYepez-code"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="GitHub Alexander"
                                className="p-2 rounded-xl hover-tema transition-colors flex items-center justify-center text-[var(--colore-testo-secondario)] hover:text-[var(--colore-testo-principale)]"
                            >
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>

                            {/* Github Sviluppatore 4 */}
                            <a
                                href="https://github.com/mariacarlottaliberio"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="GitHub Carlotta"
                                className="p-2 rounded-xl hover-tema transition-colors flex items-center justify-center text-[var(--colore-testo-secondario)] hover:text-[var(--colore-testo-principale)]"
                            >
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>

                        {/* Riga LinkedIn */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs mr-1 text-[var(--colore-testo-mutato)] min-w-[55px] text-right">LinkedIn:</span>

                            {/* LinkedIn Sviluppatore 1 */}
                            <a
                                href="https://www.linkedin.com/in/kevin-napoli-446b35314/"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="LinkedIn Kevin"
                                className="p-2 rounded-xl hover-tema transition-colors flex items-center justify-center text-[var(--colore-testo-secondario)] hover:text-[var(--colore-testo-principale)]"
                            >
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                </svg>
                            </a>

                            {/* LinkedIn Sviluppatore 2 */}
                            <a
                                href="https://www.linkedin.com/in/bianca-andreea-ciocoiu-a630663bb/"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="LinkedIn Bianca"
                                className="p-2 rounded-xl hover-tema transition-colors flex items-center justify-center text-[var(--colore-testo-secondario)] hover:text-[var(--colore-testo-principale)]"
                            >
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                </svg>
                            </a>

                            {/* LinkedIn Sviluppatore 3 */}
                            <a
                                href="https://www.linkedin.com/in/jose-alexander-yepez-mejia-960b263b2/"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="LinkedIn Alexander"
                                className="p-2 rounded-xl hover-tema transition-colors flex items-center justify-center text-[var(--colore-testo-secondario)] hover:text-[var(--colore-testo-principale)]"
                            >
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                </svg>
                            </a>

                            {/* LinkedIn Sviluppatore 4 */}
                            <a
                                href="https://www.linkedin.com/in/maria-carlotta-liberio-11242b235/"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="LinkedIn Carlotta"
                                className="p-2 rounded-xl hover-tema transition-colors flex items-center justify-center text-[var(--colore-testo-secondario)] hover:text-[var(--colore-testo-principale)]"
                            >
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Linea inferiore per il Copyright */}
                <div
                    /* 
                    - border-t linea orizzontale superiore
                    - text-xs imposta il font a 12px */
                    className="border-t mt-6 pt-4 text-center text-xs text-[var(--colore-testo-mutato)]"
                    style={{ borderColor: 'var(--colore-bordo)' }}
                >
                    {/* Generazione dell'anno corrente tramite costruttore Date */}
                    <p>&copy; {new Date().getFullYear()} Business Travel. Tutti i diritti riservati.</p>
                </div>
            </div>
        </footer>
    );
}