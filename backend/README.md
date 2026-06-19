# Business Travel - Backend API

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MySQL-8.4-4479A1?style=for-the-badge&logo=mysql" />
  <img src="https://img.shields.io/badge/JWT-Auth-F7B731?style=for-the-badge&logo=jsonwebtokens" />
</div>

<p align="center">
  <em>Il microservizio REST principale del gestionale Business Travel. Gestisce autenticazione, trasferte, spese, utenti e travel policies tramite un'API JSON protetta da JWT.</em>
</p>

---

## Architettura

Il backend segue un'architettura a tre livelli classica **Routes -> Controllers -> Database**, con uno strato di middleware che protegge le rotte sensibili prima ancora che la richiesta raggiunga la logica di business.

```
frontend  ----HTTP---->  [Routes]  ---->  [Middleware JWT]  ---->  [Controllers]  ---->  [MySQL Pool]
```

Ogni area funzionale (auth, trasferte, spese, utenti, policies) ha il proprio file di route e controller separato, rendendo il codice modulare e facilmente estendibile.

---

## Struttura del Progetto

```
backend/
├── src/
│   ├── server.js              # Entry point: avvia Express, registra middleware e rotte
│   ├── app.js                 # Configurazione alternativa (legacy)
│   ├── config/
│   │   └── db.js              # Pool MySQL con logica di retry (Docker-safe)
│   ├── middlewares/
│   │   ├── authMiddleware.js  # verifyToken + checkRole
│   │   └── uploadMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js      # POST /api/auth/login
│   │   ├── trasferteRoutes.js # CRUD trasferte
│   │   ├── speseRoutes.js     # CRUD spese + upload scontrini
│   │   ├── utentiRoutes.js    # Gestione utenti (Admin only per write)
│   │   └── policiesRoutes.js  # Lettura e aggiornamento massimali
│   └── controllers/
│       ├── authController.js
│       ├── trasferteController.js
│       ├── speseController.js
│       ├── utentiController.js
│       └── policiesController.js
├── public/
│   └── uploads/               # Cartella auto-generata per scontrini e allegati
├── Dockerfile
├── .env.example
└── package.json
```

---

## API Reference

### Autenticazione

Tutte le rotte (eccetto il login) richiedono un JWT valido, passato come cookie HttpOnly **oppure** come header `Authorization: Bearer <token>`.

| Metodo | Endpoint         | Auth | Descrizione                              |
|--------|------------------|------|------------------------------------------|
| POST   | /api/auth/login  | No   | Login utente, ritorna JWT e dati profilo |

---

### Trasferte

| Metodo | Endpoint                  | Auth         | Descrizione                                      |
|--------|---------------------------|--------------|--------------------------------------------------|
| GET    | /api/trasferte            | JWT          | Restituisce tutte le trasferte (filtrate per ruolo nel controller) |
| GET    | /api/trasferte/:id        | JWT          | Dettaglio singola trasferta                      |
| POST   | /api/trasferte            | JWT          | Crea una nuova richiesta di trasferta            |
| PUT    | /api/trasferte/:id/stato  | JWT          | Cambia lo stato (approvata / rifiutata / in attesa) |
| DELETE | /api/trasferte/:id        | JWT          | Elimina una trasferta                            |

---

### Spese (Note Spese)

| Metodo | Endpoint                          | Auth         | Descrizione                                        |
|--------|-----------------------------------|--------------|----------------------------------------------------|
| GET    | /api/spese/trasferta/:idTrasferta | JWT          | Recupera tutte le spese di una trasferta           |
| POST   | /api/spese                        | JWT          | Aggiunge una spesa con upload scontrino (Multer)   |
| PUT    | /api/spese/valuta/:idSpesa        | JWT + Admin  | Approva o rifiuta una nota spese                   |
| DELETE | /api/spese/:idSpesa               | JWT          | Elimina una spesa                                  |

L'upload del file scontrino avviene tramite `multipart/form-data`, campo `scontrino`. I file vengono salvati in `public/uploads/` con nome univoco basato su timestamp.

---

### Utenti

| Metodo | Endpoint        | Auth              | Descrizione                      |
|--------|-----------------|-------------------|----------------------------------|
| GET    | /api/utenti     | JWT               | Lista di tutti gli utenti        |
| POST   | /api/utenti     | JWT + Admin only  | Crea un nuovo utente             |
| DELETE | /api/utenti/:id | JWT + Admin only  | Rimuove un utente dal sistema    |

---

### Travel Policies

| Metodo | Endpoint                    | Auth              | Descrizione                             |
|--------|-----------------------------|-------------------|-----------------------------------------|
| GET    | /api/policies               | JWT               | Legge i massimali di spesa per categoria|
| PUT    | /api/policies/:categoria    | JWT               | Aggiorna il massimale di una categoria  |

---

## Sicurezza

### Middleware JWT (authMiddleware.js)

Il middleware `verifyToken` intercetta ogni richiesta protetta e:

1. Cerca il token JWT prima nei **cookie HttpOnly** (`req.cookies.token`), poi nell'header `Authorization: Bearer`.
2. Verifica la firma con `JWT_SECRET` tramite `jsonwebtoken`.
3. Inietta i dati dell'utente decodificati su `req.user` (id, ruolo, nome).
4. Se il token manca risponde con `401 Unauthorized`. Se il token e' alterato o scaduto risponde con `403 Forbidden`.

Il middleware `checkRole(ruolo)` e' uno strato aggiuntivo che, dopo `verifyToken`, verifica che `req.user.ruolo` corrisponda al ruolo richiesto dalla rotta (es. `admin`). Viene applicato sugli endpoint di scrittura di `/api/utenti`.

### Password

Le password degli utenti vengono memorizzate nel database come hash `bcrypt` (libreria `bcryptjs`). Il confronto avviene sempre tramite `bcrypt.compare()`, mai in chiaro.

### Upload File

Multer e' configurato con `diskStorage` e percorso assoluto (`path.join(__dirname, ...)`), garantendo il funzionamento su qualsiasi macchina o container indipendentemente dalla directory di lavoro. Il nome del file viene rinominato con un suffisso univoco `Date.now() + random` per prevenire collisioni.

---

## Connessione al Database

Il file `src/config/db.js` crea un **pool di connessioni MySQL** tramite `mysql2/promise` con logica di **retry automatico** (10 tentativi, 3 secondi di attesa tra l'uno e l'altro). Questo rende il backend robusto negli ambienti Docker, dove il container del database potrebbe non essere ancora pronto quando il backend si avvia.

---

## Stack Tecnologico

| Tecnologia       | Versione  | Ruolo                                    |
|------------------|-----------|------------------------------------------|
| Node.js          | 22        | Runtime JavaScript                       |
| Express          | 4.x       | Framework HTTP                           |
| mysql2           | 3.x       | Driver MySQL con supporto Promise/Pool   |
| jsonwebtoken     | 9.x       | Generazione e verifica JWT               |
| bcryptjs         | 2.x       | Hashing password                         |
| multer           | 1.x       | Upload file multipart                    |
| cookie-parser    | 1.x       | Lettura cookie HttpOnly                  |
| cors             | 2.x       | Gestione Cross-Origin Resource Sharing   |
| dotenv           | 16.x      | Gestione variabili di ambiente           |
| nodemon          | 3.x       | Hot reload in sviluppo                   |

---

## Setup e Avvio Locale

### Prerequisiti

- Node.js 22+
- MySQL 8.x in esecuzione (locale o Docker)
- Database `businesstravel` (o equivalente) creato e popolato

### Installazione

```bash
cd backend
npm install
```

### Configurazione

Copia il file di esempio e compila le variabili:

```bash
cp .env.example .env
```

Variabili richieste:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=businesstravel
JWT_SECRET=la_tua_chiave_segreta_molto_lunga
```

**Nota:** `JWT_SECRET` deve essere identico a quello impostato nel microservizio `backend-ai`.

### Avvio

```bash
# Sviluppo con hot reload
npm run dev

# Produzione
npm start
```

Il server sara' in ascolto su `http://localhost:5000`.

---

## Avvio con Docker

Il backend e' incluso nel `docker-compose.yml` radice del progetto. Per avviare l'intero stack:

```bash
docker compose up --build
```

Il container del backend e' configurato con `depends_on: mysql` e il pool di connessione ha il retry integrato, quindi non e' necessario nessun intervento manuale sull'ordine di avvio.

---

## Rotte di Diagnostica

| Endpoint            | Descrizione                            |
|---------------------|----------------------------------------|
| GET /               | Risponde `{ "message": "API attiva" }` |
| GET /api/status     | Risponde con conferma di server online |
| GET /api/profilo-segreto | Rotta protetta: restituisce req.user (test JWT) |

---

<div align="center">
  <b>Progetto sviluppato per il Progetto Finale 404Team - 2026</b>
</div>
