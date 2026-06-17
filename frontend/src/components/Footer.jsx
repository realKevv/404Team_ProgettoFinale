import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoPng from '../assets/img/logo.png';

export default function Footer() {
    return (
        <footer
            /* Sfondo impostato a bg-gray-200 per grigio più deciso e visibile 
            relative z-10 -> posizionamento sull'asse z, copre elementi
            fissi o assoluti presenti sullo sfondo */
            className="bg-gray-200 border-t w-full mt-auto relative z-10"
            style={{ borderColor: 'var(--colore-bordo)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* dispositivi mobile layout in verticale (flex-col). 
                Dai dispositivi desktop in su (md:), il layout passa in orizzontale */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* ── Sinistra: Logo e Brand ── */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
                            <img
                                src={logoPng}
                                alt="Business Travel logo"
                                className="h-8 w-8 rounded-xl object-cover shadow-sm
                                           transition-transform duration-200 group-hover:scale-105"
                            />
                            <span
                                className="text-lg font-light uppercase tracking-widest font-sans"
                                style={{ color: 'var(--colore-primario-scuro)' }}
                            >
                                Business Travel
                            </span>
                        </Link>
                    </div>

                    {/* ── Centro: Contatti ── */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
                        <a
                            href="mailto:info@businesstravel.com"
                            /* testo scurito per contrasto sul grigio */
                            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
                            style={{ textDecoration: 'none' }}
                        >
                            <Mail size={16} className="text-gray-600" />
                            <span>info@businesstravel.com</span>
                        </a>
                    </div>

                    {/* ── Destra: Link GitHub del Team ── */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs mr-1 text-gray-600">Sviluppato da:</span>

                        {/* Sviluppatore 1 */}
                        <a
                            href="https://github.com/realKevv"
                            // Apre github in una nuova schenda del browser
                            target="_blank"
                            // Protegge l'applicazione da attacchi di tipo Tabnabbing 
                            // (impedisce alla nuova pagina aperta di accedere alla finestra di origine tramite l'oggetto JavaScript window.opener)
                            rel="noopener noreferrer"
                            title="GitHub Kevin"
                            /* hover impostato su bg-gray-300 per vederlo meglio sullo sfondo scuro */
                            className="p-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center text-gray-700 hover:text-black"
                        >
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>

                        {/* Sviluppatore 2 */}
                        <a
                            href="https://github.com/biancaandreeacioc"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub Bianca"
                            className="p-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center text-gray-700 hover:text-black"
                        >
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>

                        {/* Sviluppatore 3 */}
                        <a
                            href="https://github.com/AlexanderYepez-code"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub Alexander"
                            className="p-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center text-gray-700 hover:text-black"
                        >
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>

                        {/* Sviluppatore 4 */}
                        <a
                            href="https://github.com/mariacarlottaliberio"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub Carlotta"
                            className="p-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center text-gray-700 hover:text-black"
                        >
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>

                </div>

                {/* ── Linea inferiore per il Copyright ── */}
                <div
                    /* MODIFICATO: Scurito il testo del copyright a text-gray-600 */
                    className="border-t mt-6 pt-4 text-center text-xs text-gray-600"
                    style={{ borderColor: 'var(--colore-bordo)' }}
                >
                    {/* Estrae dinamicamente l'anno corrente 
                    il copyright risulterà sempre aggiornato automaticamente */}
                    <p>&copy; {new Date().getFullYear()} Business Travel. Tutti i diritti riservati.</p>
                </div>
            </div>
        </footer>
    );
}