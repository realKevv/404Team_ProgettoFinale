import { ArrowRight, Plane, Receipt, Shield, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import video from '../assets/img/video.mp4';

export default function Homepage() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen overflow-hidden font-[var(--font-principale)]">

            {/* ===== VIDEO BACKGROUND ===== */}
            <video
                src={video}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
            />
            {/* Overlay gradiente scuro */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-indigo-950/60" />

            {/* ===== NAVBAR LANDING ===== */}
            <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 animate-fade-in">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                        <Plane size={20} className="text-white" />
                    </div>
                    <span className="text-white text-lg font-semibold tracking-wide">Business Travel</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hidden sm:block text-white/70 hover:text-white text-sm font-medium transition-colors"
                    >
                        Gestionale
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-gray-900 hover:bg-white/90 transition-all duration-200 shadow-lg shadow-white/10"
                    >
                        Accedi
                    </button>
                </div>
            </nav>

            {/* ===== HERO CONTENT ===== */}
            <div className="hero-section relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-24 lg:pt-32 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Testi */}
                <div className="space-y-8">
                    <div className="animate-fade-in-up stagger-1">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse-slow 2s infinite' }} />
                            Enterprise Solution 2026
                        </span>
                    </div>

                    <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-light uppercase text-white tracking-widest leading-tight animate-fade-in-up stagger-2">
                        Business <br />
                        <span className="font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                            Travel
                        </span>
                    </h1>

                    <p className="hero-subtitle text-lg sm:text-xl text-white/60 max-w-lg leading-relaxed animate-fade-in-up stagger-3">
                        L'ecosistema intelligente per la gestione delle trasferte aziendali e delle note spese. Tutto in un unico gestionale.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 animate-fade-in-up stagger-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-white text-gray-900 hover:bg-white/90 transition-all duration-300 shadow-xl shadow-white/10"
                        >
                            Vai al Gestionale
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            className="px-7 py-3.5 rounded-xl text-sm font-semibold text-white border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                        >
                            Scopri di più
                        </button>
                    </div>
                </div>

                {/* Card features a destra */}
                <div className="flex flex-col gap-4 animate-slide-in-right stagger-3">
                    {[
                        { icon: Plane, title: "Gestione Trasferte", desc: "Crea e monitora le trasferte del tuo team in tempo reale.", color: "#3b82f6" },
                        { icon: Receipt, title: "Note Spese Smart", desc: "Upload scontrini, categorizzazione automatica e rimborsi veloci.", color: "#10b981" },
                        { icon: Shield, title: "Travel Policy", desc: "Controllo automatico dei massimali per ogni categoria di spesa.", color: "#f59e0b" }
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="group p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                            style={{ animationDelay: `${0.4 + i * 0.15}s` }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${feature.color}20` }}
                                >
                                    <feature.icon size={20} style={{ color: feature.color }} />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                                    <p className="text-white/50 text-xs leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== Scroll indicator ===== */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2" style={{ animation: 'float 3s ease-in-out infinite' }}>
                <span className="text-white/30 text-xs uppercase tracking-widest">Scorri</span>
                <ChevronDown size={18} className="text-white/30" />
            </div>
        </div>
    );
}