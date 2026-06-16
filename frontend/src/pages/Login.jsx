
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

import "../GlobalCSS.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // qui inserire collegamento al backend
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            navigate("/dashboard");
        }, 1200);
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

                {/*mt-6:Margine superiore di 24px;text-xl:Dimensione del font extralarge (circa 20px); max-w-md:Larghezza massima del testo limitata a circa 500px;*/}
                <p className="mt-6 text-xl max-w-md"
                    style={{ color: "var(--colore-testo-secondario)" }}
                >
                    Gestione intelligente delle trasferte aziendali,
                    delle note spese e dei rimborsi.
                </p>

            </div>

            {/* LOGIN CARD */}

            <div
                //w-full:la card occupa tutta la larghezza; lg:max-w-xl su schermi grandi diventa più larga
                //p-10:padding 40px; lg:p-12 su schermi grandi padding 48px; rounded-2xl:bordi molto arotondati
                //border-2: bordo spesso 2px; transition-all: qualsiasi cambiamento diventa animato
                //duration-300: durata animazione in ms; hover:scale-[1.02]:ingrandisce la card del 2% quando ci si passa sopra con il mouse
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
                {/* mb-6:margine inferiore di 24px serve a separarlo dal titolo del form */}
                <div className="flex justify-center mb-6">

                    <div
                        //px-5:padding orizzontale che allarga il badge;py-2:padding verticale
                        //text-sm:testo piccolo
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
                {/* text-3xl dimensione del testo molto grande; mb-2:margine inferiore 8px che separa il titolo dal paragrafo sotto*/}
                <h2 className="text-3xl font-bold text-center mb-2"
                    style={{ color: "var(--colore-primario)" }}
                >
                    Accedi
                </h2>
                {/* mb-8:margine inferiore di 32px serve a separare il paragrafo dal form*/}
                <p className="text-center mb-8"
                    style={{ color: "var(--colore-testo-secondario)" }}
                >
                    Inserisci le tue credenziali aziendali
                </p>

                {/* FORM */}
                {/* quando premi login, viene eseguita la funzione che collega con il beckend */}
                {/*space-y-5:è una classe di Tailwind che crea uno spazio di 20px tra gli elementi figli del form*/}
                <form onSubmit={handleLogin} className="space-y-5">

                    {/* EMAIL */}
                    {/* relative:serve a posizionare la mail in modo assoluto */}
                    <div className="relative">
                        {/* icona in posizione libera rispetto al relative */}
                        <Mail size={18}
                            // distanza dal bordo sinistro e dall'alto di circa 12px
                            //text-slate-400:colore grigio chiaro, colora l'icona in maniera non troppo invasiva
                            className="absolute left-3 top-3 text-slate-400"
                        />

                        <input type="email"
                            //collego allo stato email
                            value={email}
                            //ogni volta che si scrive qualcosa, aggiorna la variabile e-mail
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email aziendale"
                            //w-full:la casella occupa tutta la larghezza;
                            //pl-10:padding sinistra di 40px serve a non far toccare l'icona con il testo;
                            //py-3:padding verticale di 12px; //rounded-lg:bordi arrotondati; 
                            // outline:none:rimuove il bordo blu che appare quando si clicca sulla casella;
                            //focus:shadow-md:quando clicco sulla casella appare un'ombra leggera
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
                            style={{ borderColor: "var(--colore-info)" }} />

                    </div>

                    {/* Bottone */}
                    <button type="submit"

                        disabled={loading}
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
                        "
                        style={{ backgroundColor: "var(--colore-primario)" }}
                    >

                        {/* se loading è true mostra loading, se è false mostra il bottone */}
                        {/* animate-pulse: il testo lampeggia leggermente */}
                        {loading ? (
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