// =============================================================
// main.jsx - Punto di ingresso dell'applicazione React
// =============================================================
// Qui rendiamo l'app all'interno del div#root dell'HTML.
// ThemeProvider deve essere il più esterno possibile per garantire
// che il tema (chiaro/scuro) sia disponibile in TUTTA l'app.
// =============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./GlobalCSS.css";
import App from "./App.jsx";

// Importiamo il Provider del tema: avvolge tutta l'app e rende
// disponibile il contesto del tema (chiaro/scuro) a ogni componente.
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ThemeProvider è il più esterno: gestisce il tema globale */}
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
