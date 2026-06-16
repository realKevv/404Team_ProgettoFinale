import { TrendingUp, Globe, Bot, ArrowRight } from 'lucide-react';
import video from '../assets/img/video.mp4'

export default function Homepage() {
    return (
        <div className="bg-[#FFFDF9] min-h-screen text-gray-800 font-sans selection:bg-indigo-100">

            {/* 1. HERO SECTION (La parte alta dello screenshot) */}
            <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Testi a sinistra */}
                <div className="space-y-6">
                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-sm sm:text-base">
                        ENTERPRISE SOLUTION 2026
                    </span>
                    <h1 className="text-5xl font-light uppercase text-gray-900 tracking-widest font-sans">
                        Business <br /> Travel
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-md leading-relaxed">
                        L'ecosistema intelligente per la gestione delle trasferte aziendali e delle note spese.
                    </p>
                    {/* Linea verde decorativa */}
                    <div className="h-1 w-20 bg-emerald-400 rounded-full"></div>

                </div>

                {/* Immagine a destra con effetto card arrotondata */}
                <div className="flex justify-center md:justify-end">
                    <div className="bg-white p-4 rounded-3xl shadow-xl shadow-gray-100 max-w-md w-full border border-gray-50 transform hover:scale-[1.02] transition-transform duration-300">
                        <video
                            src={video}
                            className="rounded-2xl w-full h-80 object-cover bg-gray-100"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                </div>
            </header>

        </div>
    );
}