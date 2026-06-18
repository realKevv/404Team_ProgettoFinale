import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2, Bot, X, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AiChatBox() {

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messaggi, setMessaggi] = useState([
        { sender: 'ai', text: "Ciao! Sono l'assistente IA.\n\nChiedimi pure chi è in trasferta oggi o i dettagli dei tuoi viaggi." }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Leggiamo token e utente dal localStorage (come fa tutto il resto del progetto)
    const token = localStorage.getItem('token');
    const utente = JSON.parse(localStorage.getItem('utente') || '{}');
    const ruoloUtente = utente?.ruolo || "user";

    const handleInviaMessaggio = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const testoUtente = input;
        const nuoviMessaggi = [...messaggi, { sender: 'user', text: testoUtente }];
        setMessaggi(nuoviMessaggi);
        setInput("");
        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/ai/chat",
                { message: testoUtente },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessaggi([...nuoviMessaggi, { sender: 'ai', text: response.data.response }]);

        } catch (error) {
            console.error("Errore IA:", error);
            setMessaggi([...nuoviMessaggi, { sender: 'ai', text: "Ops, il server IA sembra spento o c'è un errore!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Tasto per aprire/chiudere */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-4 rounded-full transition-transform hover:scale-110 flex items-center justify-center text-white"
                    style={{
                        backgroundColor: 'var(--colore-primario)',
                        boxShadow: 'var(--ombra-profonda)'
                    }}
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Finestra della Chat */}
            {isOpen && (
                <div
                    className="flex flex-col h-[28rem] w-full max-w-[90vw] sm:w-80 border rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                        backgroundColor: 'var(--colore-sfondo-card)',
                        borderColor: 'var(--colore-bordo)',
                        boxShadow: 'var(--ombra-profonda)'
                    }}
                >
                    {/* Header Chat */}
                    <div
                        className="text-white p-4 font-bold flex items-center justify-between gap-2"
                        style={{ backgroundColor: 'var(--colore-primario)' }}
                    >
                        <div className="flex items-center gap-2 text-sm">
                            <Bot size={20} />
                            Assistente IA
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] bg-black/20 px-2 py-1 rounded-full uppercase tracking-wider">
                                {ruoloUtente}
                            </span>
                            <button onClick={() => setIsOpen(false)} className="text-white hover:opacity-80 transition-opacity">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Area Messaggi */}
                    <div
                        className="flex-1 p-4 overflow-y-auto flex flex-col gap-3"
                        style={{ backgroundColor: 'var(--colore-sfondo-alt)' }}
                    >
                        {messaggi.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-xl max-w-[90%] text-sm ${msg.sender === 'user'
                                    ? 'text-white self-end rounded-br-none'
                                    : 'border self-start rounded-bl-none shadow-sm'
                                    }`}
                                style={
                                    msg.sender === 'user'
                                        ? { backgroundColor: 'var(--colore-primario)' }
                                        : {
                                            backgroundColor: 'var(--colore-sfondo-card)',
                                            color: 'var(--colore-testo-principale)',
                                            borderColor: 'var(--colore-bordo)'
                                        }
                                }
                            >
                                {/* 4. QUI AVVIENE LA MAGIA DEL MARKDOWN */}
                                {msg.sender === 'user' ? (
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                ) : (
                                    <div className="[&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mb-1 [&>strong]:font-semibold">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Animazione di caricamento */}
                        {isLoading && (
                            <div
                                className="border self-start p-3 rounded-xl rounded-bl-none shadow-sm flex gap-2 items-center text-sm"
                                style={{
                                    backgroundColor: 'var(--colore-sfondo-card)',
                                    color: 'var(--colore-testo-secondario)',
                                    borderColor: 'var(--colore-bordo)'
                                }}
                            >
                                <Loader2 size={16} className="animate-spin" />
                                <span>Sto pensando...</span>
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <div
                        className="p-3 border-t"
                        style={{
                            backgroundColor: 'var(--colore-sfondo-card)',
                            borderColor: 'var(--colore-bordo)'
                        }}
                    >
                        <form onSubmit={handleInviaMessaggio} className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Chiedimi sui viaggi..."
                                className="flex-1 p-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all"
                                style={{
                                    backgroundColor: 'var(--colore-sfondo-pagina)',
                                    borderColor: 'var(--colore-bordo)',
                                    color: 'var(--colore-testo-principale)'
                                }}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="text-white p-2.5 rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center"
                                style={{ backgroundColor: 'var(--colore-primario)' }}
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}