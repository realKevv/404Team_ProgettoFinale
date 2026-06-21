# Business Travel - Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Zustand-5.x-FF9900?style=for-the-badge" />
</div>

<p align="center">
  <em>L'interfaccia utente del gestionale Business Travel. Una Single Page Application React che permette ai dipendenti di gestire le proprie trasferte e note spese, e agli amministratori di supervisionare l'intero flusso aziendale.</em>
</p>

---

## Panoramica Funzionale

L'applicazione gestisce due ruoli distinti con interfacce e funzionalita' differenziate:

### Dipendente (User)

- Visualizzazione e richiesta di nuove trasferte personali
- Gestione delle note spese con upload scontrini/ricevute
- Storico dei viaggi effettuati
- Consultazione dello status del team (chi e' in sede, chi e' in trasferta)
- Accesso all'assistente IA per interrogare i propri dati di viaggio

### Amministratore (Admin)

- Dashboard con panoramica generale
- Lista completa di tutte le trasferte aziendali
- Approvazione e gestione delle richieste di trasferta in attesa
- Gestione dell'anagrafica dipendenti (creazione e rimozione account)
- Configurazione delle travel policies (massimali di spesa per categoria)
- Accesso all'assistente IA con visione globale e modello avanzato

---

## Struttura del Progetto

```
frontend/
├── src/
│   ├── main.jsx                    # Entry point React, setup BrowserRouter e store
│   ├── App.jsx                     # Routing principale, gestione autenticazione e layout
│   ├── App.css                     # Stili base del layout applicativo
│   ├── GlobalCSS.css               # Design system: variabili CSS, temi, componenti globali
│   ├── index.css                   # Reset e configurazione Tailwind
│   ├── mockData.js                 # Dati di esempio per sviluppo/test
│   │
│   ├── pages/
│   │   ├── HomePage.jsx            # Landing page pubblica
│   │   ├── Login.jsx               # Pagina di autenticazione
│   │   ├── Dashboard.jsx           # Dashboard principale post-login
│   │   ├── MieiViaggiPage.jsx      # Lista e gestione trasferte del dipendente
│   │   ├── NoteSpesePage.jsx       # Gestione note spese e upload scontrini
│   │   ├── StoricoViaggiPage.jsx   # Storico completo dei viaggi
│   │   ├── DipendentiPage.jsx      # Status e lista del team
│   │   ├── ProfiloUtente.jsx       # Profilo e dati personali
│   │   ├── ApprovazioniTrasfertePage.jsx # (Admin) Approvazione richieste
│   │   ├── ListaViaggi.jsx         # (Admin) Tutte le trasferte aziendali
│   │   ├── TravelPoliciesPage.jsx  # (Admin) Gestione massimali di spesa
│   │   ├── AggiungiUtente.jsx      # (Admin) Creazione nuovo utente
│   │   └── RimuoviUtente.jsx       # (Admin) Eliminazione utente
│   │
│   ├── components/
│   │   ├── Navbar.jsx              # Barra di navigazione superiore
│   │   ├── Sidebar.jsx             # Menu laterale con navigazione per ruolo
│   │   ├── Footer.jsx              # Footer applicativo
│   │   ├── AiChatBox.jsx           # Widget chat IA flottante
│   │   ├── ControlliPaginazione.jsx # Componente paginazione riutilizzabile
│   │   └── trasferte/
│   │       ├── TrasferteForm.jsx   # Form creazione/modifica trasferta
│   │       ├── TrasferteTable.jsx  # Tabella trasferte con azioni
│   │       ├── ColleaguesTracker.jsx # Tracker status colleghi
│   │       └── TrackingBoard.jsx   # Board visualizzazione team
│   │
│   ├── context/
│   │   ├── AuthContext.js          # Context per dati autenticazione
│   │   └── ThemeContext.jsx        # Context per gestione tema (light/dark)
│   │
│   ├── store/
│   │   └── store.js                # Store Zustand per stato globale applicativo
│   │
│   ├── services/
│   │   └── api.js                  # Istanza Axios configurata per le chiamate API
│   │
│   └── assets/                     # Immagini e risorse statiche
│
├── index.html                      # Template HTML principale
├── vite.config.js                  # Configurazione Vite
├── eslint.config.js                # Configurazione ESLint
├── Dockerfile                      # Containerizzazione
└── package.json
```

---

## Routing e Navigazione

Il routing e' gestito da `react-router-dom` v7. Il componente `App.jsx` applica un sistema di guardie lato client che separa i percorsi pubblici da quelli autenticati.

| Percorso                    | Accesso       | Componente                    |
|-----------------------------|---------------|-------------------------------|
| /                           | Pubblico      | HomePage                      |
| /login                      | Pubblico      | Login                         |
| /dashboard                  | Autenticato   | Dashboard                     |
| /viaggi                     | Autenticato   | MieiViaggiPage                |
| /rimborsi                   | Autenticato   | NoteSpesePage                 |
| /viaggi/storico             | Autenticato   | StoricoViaggiPage             |
| /dipendenti                 | Autenticato   | DipendentiPage                |
| /profilo                    | Autenticato   | ProfiloUtente                 |
| /admin/approvazioni         | Autenticato   | ApprovazioniTrasfertePage     |
| /admin/trasferte            | Autenticato   | ListaViaggi                   |
| /admin/policies             | Autenticato   | TravelPoliciesPage            |
| /admin/nuovo-utente         | Autenticato   | AggiungiUtente                |
| /admin/rimuovi-utente       | Autenticato   | RimuoviUtente                 |

La restrizione per ruolo sulle rotte admin e' applicata anche lato backend. Il frontend nasconde i link non pertinenti al ruolo dell'utente tramite la Sidebar.

---

## Autenticazione

Il flusso di autenticazione e' gestito interamente lato client senza librerie esterne specifiche per l'auth:

1. Il componente `Login.jsx` invia le credenziali al backend (`POST /api/auth/login`).
2. Il backend risponde con il token JWT e i dati dell'utente.
3. `App.jsx` memorizza token e dati utente in `sessionStorage` (chiavi `token` e `utente`).
4. Ad ogni ricaricamento, i dati vengono letti da `sessionStorage` tramite le funzioni helper `readToken()` e `readUtente()`.
5. Al logout, `sessionStorage` viene svuotato e lo stato React azzerato, forzando il redirect alla pagina di login.

Il token viene allegato alle richieste HTTP verso il backend Express tramite Axios (nell'header `Authorization: Bearer`) e verso il backend IA nello stesso modo.

---

## Componente AiChatBox

Il componente `AiChatBox.jsx` e' un widget di chat flottante sempre visibile nelle pagine protette (posizionato in basso a destra con `position: fixed`).

- Legge il token e il ruolo dell'utente da `sessionStorage` al momento dell'invio.
- Invia i messaggi direttamente al microservizio `backend-ai` (`POST http://localhost:8000/api/ai/chat`).
- Riceve le risposte in formato Markdown e le renderizza tramite `react-markdown` con il plugin `remark-gfm` per supportare tabelle, grassetti e liste.
- Il ruolo corrente viene mostrato nell'header della chat come badge (user / admin).

---

## Gestione del Tema

Il sistema di temi e' implementato tramite `ThemeContext.jsx` e variabili CSS custom definite in `GlobalCSS.css`. Il toggle tra tema chiaro e scuro modifica una classe sul root del documento, che attiva le variabili CSS del tema corrispondente. Lo stato del tema viene persistito in `localStorage`.

---

## Gestione dello Stato

Lo stato globale e' gestito con **Zustand** (`store/store.js`). Zustand e' stato scelto per la sua semplicita' (nessun boilerplate Redux), le buone performance con React 19, e il supporto nativo a selettori memoizzati.

---

## Stack Tecnologico

| Tecnologia           | Versione  | Ruolo                                          |
|----------------------|-----------|------------------------------------------------|
| React                | 19        | Libreria UI                                    |
| Vite                 | 8.x       | Build tool e dev server                        |
| react-router-dom     | 7.x       | Routing SPA lato client                        |
| Zustand              | 5.x       | State management globale                       |
| Tailwind CSS         | 4.x       | Utility-first CSS framework                    |
| MUI (Material UI)    | 9.x       | Componenti UI aggiuntivi                       |
| Axios                | 1.x       | HTTP client per chiamate API                   |
| react-hook-form      | 7.x       | Gestione e validazione form                    |
| react-markdown       | 10.x      | Rendering Markdown per risposte IA             |
| remark-gfm           | 4.x       | Plugin Markdown GFM (tabelle, task list, ecc.) |
| lucide-react         | 1.x       | Libreria di icone SVG                          |

---

## Setup e Avvio Locale

### Prerequisiti

- Node.js 22+
- Backend Express in esecuzione su `http://localhost:5000`
- Backend IA in esecuzione su `http://localhost:8000` (opzionale, per la chat IA)

### Installazione

```bash
cd frontend
npm install
```

### Avvio

```bash
npm run dev
```

L'applicazione sara' disponibile su `http://localhost:5173`.

### Build di Produzione

```bash
npm run build
```

L'output della build viene generato nella cartella `dist/`.

### Preview Build

```bash
npm run preview
```

---

## Avvio con Docker

Il frontend e' incluso nel `docker-compose.yml` radice del progetto. Il container espone la porta `5173` e dipende dai servizi `backend` e `backend-ai`.

```bash
docker compose up --build
```

Il dev server di Vite e' configurato con `--host` per essere raggiungibile dall'esterno del container.

---

## Variabili d'Ambiente

Il frontend non richiede un file `.env` per il funzionamento base. Gli URL delle API sono attualmente hardcodati nei componenti (`http://localhost:5000` per il backend Express e `http://localhost:8000` per il backend IA). In un ambiente di produzione e' raccomandato esternalizzare questi valori tramite variabili `VITE_*`.

---

<div align="center">
  <b>Progetto sviluppato per il Progetto Finale 404Team - 2026</b>
  - [Kevin Napoli](https://www.linkedin.com/in/kevin-napoli-446b35314/ ) - Backend IA (FastAPI, LangGraph, Mistral), Backend Express, Frontend React
  - [Jose Alexander Yepez Mejia](https://www.linkedin.com/in/jose-alexander-yepez-mejia-960b263b2/) - Backend Express, Frontend React
  - [Bianca Andreea Ciocoiu](https://www.linkedin.com/in/bianca-andreea-ciocoiu-a630663bb/ ) - Frontend React
  - [Maria Carlotta Liberio](https://www.linkedin.com/in/maria-carlotta-liberio-11242b235/) - Frontend React
</div>
