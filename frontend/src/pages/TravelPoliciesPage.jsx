import React, { useState, useEffect } from 'react';
import { ShieldAlert, Euro, Clock, Save, CheckCircle, Loader2 } from 'lucide-react';
import { useStore } from '../store/store';

// Esportiamo la pagina come Named Export per la gestione delle configurazioni dei massimali di spesa
export function TravelPoliciesPage() {
    // Estraiamo lo stato globale e le azioni dal nostro store centralizzato
    const { policies, fetchPolicies, updatePolicy, isLoading } = useStore();
    // Stato locale temporaneo: evita di inviare una richiesta al database ad ogni singolo carattere digitato dall'utente
    const [tempPolicies, setTempPolicies] = useState({});
    // Stato booleano per gestire il caricamento dell'azione di salvataggio (mostra spinner sul pulsante)
    const [salvataggioInCorso, setSalvataggioInCorso] = useState(false);
    // Stato booleano per mostrare il feedback visivo di successo ("Salvato!") dopo un salvataggio andato a buon fine
    const [salvato, setSalvato] = useState(false);

    // Primo useEffect: viene eseguito solo al mount (caricamento) del componente per scaricare le politiche dal server
    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]); // Includiamo fetchPolicies nelle dipendenze per sicurezza, stabilità e buone pratiche di React
    
    // Secondo useEffect: intercetta l'arrivo dei dati dallo store globale e popola lo stato locale temporaneo
    useEffect(() => {
        if (policies) setTempPolicies(policies);
    }, [policies]); // Si riattiva ogni volta che l'oggetto "policies" nello store globale cambia o viene scaricato

    // Funzione asincrona che si occupa di ciclare e salvare le modifiche effettuate dall'utente
    const handleSave = async () => {
        setSalvataggioInCorso(true); // Attiva lo spinner sul pulsante di salvataggio per bloccare click multipli accidentalii
        try {
            // Aggiorniamo ogni singola policy nel DB
            // Trasformiamo l'oggetto tempPolicies in una lista di coppie [categoria, valore]
            //object.entries(tempPolicies) restituisce un array di array, dove ogni sotto-array contiene la coppia chiave-valore dell'oggetto tempPolicies
            for (const [cat, val] of Object.entries(tempPolicies)) {
                // Eseguiamo la chiamata API/Store per aggiornare ogni singola categoria (es. Voli, Hotel) nel database
                await updatePolicy(cat, val);
            }
            setSalvato(true); // Attiva il messaggio di successo sul pulsante ("Salvato!")
            // Facciamo sparire la scritta di successo dopo 3 secondi per riportare il pulsante allo stato iniziale
            setTimeout(() => setSalvato(false), 3000);
        } catch (err) {
            // Gestione dell'errore elementare: blocca l'esecuzione e avvisa l'amministratore del fallimento di rete
            alert("Errore durante il salvataggio");
        } finally {
            setSalvataggioInCorso(false); // Spegne lo spinner sul pulsante, sia in caso di successo che di errore
        }
    };
    // Early Return: Se lo store sta ancora scaricando i dati iniziali, mostra uno spinner di caricamento a tutto schermo
    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" /></div>;
    // Rendering dell'interfaccia principale della pagina una volta che i dati sono pronti
    return (
        //p-8:padding interno di 32px,max-w-4xl: larghezza massima di 1024px, mx-auto: margine orizzontale automatico per centrare il contenitore
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-[var(--colore-testo-principale)]">🛡️ Configurazione Policies</h1>
            {/* Griglia responsive a singola colonna per incolonnare verticalmente i vari moduli delle policy */}
            <div className="grid grid-cols-1 gap-6">
                {/* Estraiamo le chiavi (i nomi delle categorie) dall'oggetto temporaneo e le cicliamo con .map() */}
                {Object.keys(tempPolicies).map((categoria) => (
                    // Card della singola policy: usa il tuo sfondo card bianco e il bordo grigio per linee di divisione sottili
                    <div key={categoria} className="p-4 rounded-xl border border-[var(--colore-bordo)] bg-[var(--colore-sfondo-card)] flex justify-between items-center">
                        {/* Nome della categoria formattato con la prima lettera maiuscola (capitalize) e testo in semibold */}
                        <span className="capitalize font-semibold">{categoria}</span>
                        {/* Gruppo di input allineato a destra che contiene il simbolo dell'euro e la casella di testo */}
                        <div className="flex items-center gap-2">
                            {/* Icona della valuta Euro posizionata subito prima del campo numerico */}
                            <Euro size={16} />
                            {/* Campo di input numerico per modificare il budget massimo consentito della policy */}
                            <input
                                type="number" // Forza la tastiera numerica su mobile e vieta l'inserimento di lettere
                                value={tempPolicies[categoria]} // Legge il valore in tempo reale dallo stato temporaneo locale
                                // All'evento di digitazione (onChange), aggiorna solo la specifica categoria mantenendo intatte le altre (...tempPolicies)
                                onChange={(e) => setTempPolicies({ ...tempPolicies, [categoria]: e.target.value })}
                                // Input stilizzato: larghezza fissa fissa (w-24), padding interno e il tuo colore del bordo globale
                                className="w-24 p-2 rounded-lg border border-[var(--colore-bordo)]"
                            />
                        </div>
                    </div>
                ))}
            </div>
                {/* Pulsante di salvataggio globale posizionato in fondo alla lista */}
            <button
                onClick={handleSave} // Associa la funzione asincrona di salvataggio al click del mouse
                disabled={salvataggioInCorso} // Disabilita e congela il pulsante durante la chiamata di rete per evitare salvataggi duplicati
                // Sfrutta il `--colore-primario` (Blu Notte) per lo sfondo, angoli arrotondati ed effetti di transizione opacity sull'hover
                className="mt-6 w-full py-3 bg-[var(--colore-primario)] text-white rounded-xl font-bold hover:opacity-90 transition-all flex justify-center gap-2"
            >
                {/* Operatore ternario per l'icona: se sta salvando mostra lo spinner che gira, altrimenti mostra l'icona del floppy disk */}
                {salvataggioInCorso ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {/* Operatore ternario per il testo: se lo stato salvato è true mostra "Salvato!", altrimenti mostra il testo standard */}
                {salvato ? "Salvato!" : "Salva Configurazione"}
            </button>
        </div>
    );
}