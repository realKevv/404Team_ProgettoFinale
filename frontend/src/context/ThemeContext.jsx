// =============================================================================
// ThemeContext.jsx - Contesto Globale per la Gestione del Tema (Chiaro / Scuro)
// =============================================================================
// Questo file crea un "contesto" React che permette a qualsiasi componente
// dell'applicazione di sapere se la modalità scura è attiva e di cambiarla.
// Il valore viene salvato nel localStorage così viene ricordato anche dopo
// il refresh della pagina.
// =============================================================================

import React, { createContext, useContext, useState, useEffect } from "react";

// -----------------------------------------------------------------------
// 1. CREAZIONE DEL CONTESTO
// -----------------------------------------------------------------------
// createContext() crea un oggetto "contenitore" vuoto che fungerà da canale
// di comunicazione tra il Provider (che fornisce i dati) e i Consumer
// (i componenti che usano quei dati).
const ThemeContext = createContext(undefined);

// -----------------------------------------------------------------------
// 2. PROVIDER DEL TEMA
// -----------------------------------------------------------------------
// Questo componente avvolge tutta l'applicazione (vedi main.jsx o App.jsx).
// Chiunque sia "dentro" ThemeProvider can leggere e modificare il tema.
export function ThemeProvider({ children }) {
  // --- Inizializzazione dello stato ---
  // useState accetta una funzione "inizializzatore" (lazy init) che viene
  // eseguita solo al primo render. Qui leggiamo il tema salvato nel
  // localStorage: se l'utente ha già scelto "dark", ripartiamo da "dark",
  // altrimenti usiamo "light" come predefinito.
  const [tema, setTema] = useState(() => {
    // Leggi il valore salvato la volta precedente
    const temaSalvato = localStorage.getItem("tema-app");
    // Se esiste e vale "dark" usa dark, altrimenti "light"
    return temaSalvato === "dark" ? "dark" : "light";
  });

  // --- Applicazione del tema al documento ---
  // useEffect si esegue ogni volta che "tema" cambia.
  // Aggiunge o rimuove la classe "dark-mode" sull'elemento <html>
  // e salva la scelta nel localStorage per la prossima visita.
  useEffect(() => {
    const radice = document.documentElement; // elemento <html>
    if (tema === "dark") {
      // Aggiunge la classe: i selettori CSS ".dark-mode :root { ... }"
      // diventano attivi e sovrascrivono le variabili chiaro
      radice.classList.add("dark-mode");
    } else {
      // Rimuove la classe: tornano le variabili del tema chiaro (default)
      radice.classList.remove("dark-mode");
    }

    // Salviamo la scelta nel localStorage per ricordarla al prossimo refresh
    localStorage.setItem("tema-app", tema);
  }, [tema]); // <-- dipendenza: riesegui solo quando "tema" cambia

  // --- Funzione di toggle ---
  // Questa funzione alterna tra "light" e "dark" ogni volta che viene chiamata.
  // Usa la forma a funzione di setTema per basarsi sempre sul valore attuale.
  const toggleTema = () => {
    setTema((temaCorrente) => (temaCorrente === "light" ? "dark" : "light"));
  };

  // --- Valore esposto ai Consumer ---
  // Qualsiasi componente che usa useTheme() riceverà questo oggetto.
  const valoreContesto = {
    tema, // "light" oppure "dark"
    toggleTema, // funzione per cambiare tema
    isDark: tema === "dark", // booleano comodo: true se siamo in dark mode
  };

  return (
    // Il Provider "distribuisce" il valore a tutti i figli annidati
    <ThemeContext.Provider value={valoreContesto}>
      {children}
    </ThemeContext.Provider>
  );
}

// -----------------------------------------------------------------------
// 3. HOOK PERSONALIZZATO: useTheme()
// -----------------------------------------------------------------------
// Invece di usare useContext(ThemeContext) direttamente, esportiamo questo
// hook che aggiunge un controllo di sicurezza: se provi a usarlo fuori
// dal ThemeProvider, ricevi un errore chiaro invece di un undefined silenzioso.
export function useTheme() {
  const contesto = useContext(ThemeContext);
  // Controllo di sicurezza: assicura che l'hook sia usato all'interno del Provider
  if (contesto === undefined) {
    throw new Error(
      "useTheme deve essere usato all'interno di un ThemeProvider",
    );
  }
  return contesto;
}
