import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

// 🔥 IMPORTIAMO LO STORE ZUSTAND
import { useStore } from "../store/store";
import "../GlobalCSS.css";

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 🔥 Tiriamo fuori dal magazzino Zustand la funzione login e gli stati
    const { login, isLoading, error } = useStore();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Blocco di sicurezza: se mancano i dati non fa nulla
        if (!email || !password) return;

        try {
            // 🔥 Chiamata VERA al backend tramite Zustand
            await login(email, password);

            // Notifica App.jsx di aggiornare il suo stato (token/utente)
            if (onLoginSuccess) onLoginSuccess();

            // Se il login va a buon fine, ti spara dritto nella dashboard
            navigate("/dashboard");
        } catch (err) {
            console.error("Login fallito");
            // Non serve fare alert, Zustand ha già valorizzato la variabile 'error'
        }
    };

    return (
        <div
            //min-h-screen: altezza minima pagina uguale a quella dello schermo;
            //flex: attiva flexbox; //flex-col: elementi disposti in colonna su schermi piccoli;
            //lg:flex-row:su schermi grandi (lg) elementi disposti in riga;
            //items-center/lg:items-center:elementi centrati verticalmente; 
            //justify-center/lg:justify-start:elementi centrati orizzontalmente su piccoli schermi, allineati all'inizio su schermi grandi; 
            //px-6/lg:px-24:padding orizzontale di 24px su piccoli schermi e 96px su grandi schermi;
            //gap-16:spazio di 64px tra stritta e form
            className="
                min-h-screen
                flex
                flex-col
                lg:flex-row
                items-center
                lg:items-center
                justify-center
                lg:justify-start
                px-6
                lg:px-24
                gap-16
            "
            style={{ backgroundColor: "var(--colore-sfondo-pagina)" }}
        >

            {/* Titolo a sinistra */}
            {/* su schermi piccoli, nascondo il titolo con hidden e 
            lo mostro in colonna (flex-col) su schermi grandi(lg:flex-col)*/}
            <div className="hidden lg:flex flex-col">
                {/* font-extrabold mette testo molto spesso; leading-none non mette la spaziatura tra le righe*/}
                <h1 className="font-extrabold leading-none"
                    style={{ fontSize: "90px", color: "var(--colore-primario-scuro)" }}
                >
                    Business
                </h1>

                <h1 className="font-extrabold leading-none"
                    style={{
                        fontSize: "70px", color: "var(--colore-primario)"
                    }}
                >
                    Travel
                </h1>

                <p className="mt-6 text-xl max-w-md"
                    style={{ color: "var(--colore-testo-secondario)" }}
                >
                    Gestione intelligente delle trasferte aziendali,
                    delle note spese e dei rimborsi.
                </p>

            </div>

            {/* LOGIN CARD */}

            <div
                className="
                    w-full
                    max-w-md
                    lg:max-w-xl
                    p-10
                    lg:p-12
                    rounded-2xl
                    border-2
                    transition-all
                    duration-300
                    hover:scale-[1.02]
                "
                style={{
                    backgroundColor: "var(--colore-sfondo-card)",
                    borderColor: "var(--colore-info)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
                }}
            >

                {/* BADGE */}
                <div className="flex justify-center mb-6">
                    <div
                        className="
                            px-5
                            py-2
                            rounded-full
                            text-sm
                            font-semibold
                        "
                        style={{
                            backgroundColor: "var(--colore-info-sfondo)",
                            color: "var(--colore-info)"
                        }}
                    >
                        Business Travel Portal
                    </div>

                </div>
                {/* Titolo */}
                <h2 className="text-3xl font-bold text-center mb-2"
                    style={{ color: "var(--colore-primario)" }}
                >
                    Accedi
                </h2>
                <p className="text-center mb-8"
                    style={{ color: "var(--colore-testo-secondario)" }}
                >
                    Inserisci le tue credenziali aziendali
                </p>
                {/* 🔥 MESSAGGIO DI ERRORE DEL SERVER (Appare solo se si sbaglia password) */}
                {error && (
                    <div className="p-3 mb-6 text-sm text-center rounded-lg bg-red-50 text-red-600 border border-red-200">
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleLogin} className="space-y-5">
                    {/* EMAIL */}
                    <div className="relative">
                        <Mail size={18}
                            className="absolute left-3 top-3 text-slate-400"
                        />
                        <input type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email aziendale"
                            className="
                                w-full
                                pl-10
                                py-3
                                rounded-lg
                                border
                                outline-none
                                transition-all
                                focus:shadow-md
                            "
                            style={{
                                borderColor: "var(--colore-info)"
                            }}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <Lock size={18}
                            className="absolute left-3 top-3 text-slate-400"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="
                                w-full
                                pl-10
                                py-3
                                rounded-lg
                                border
                                outline-none
                                transition-all
                                focus:shadow-md
                            "
                            style={{
                                borderColor: "var(--colore-info)"
                            }}
                        />
                    </div>
                    {/* Bottone */}
                    <button type="submit"
                        disabled={isLoading}
                        className="
                            w-full
                            flex
                            items-center
                            justify-center
                            gap-2
                            py-3
                            rounded-lg
                            text-white
                            font-semibold
                            transition-all
                            hover:scale-[1.02]
                            disabled:opacity-70
                            disabled:cursor-not-allowed
                        "
                        style={{ backgroundColor: "var(--colore-primario)" }}
                    >
                        {isLoading ? (
                            <span className="animate-pulse">
                                Accesso in corso...
                            </span>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Login
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;