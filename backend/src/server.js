/**
 * ============================================================================
 * FILE: src/server.js
 * SCOPO: Entry point e cuore pulsante del backend Express.
 * COSA FA:
 * - Inizializza il server web e lo mette in ascolto sulla porta designata.
 * - Configura i middleware globali (es. express.json per leggere i body,
 * cookie-parser per estrarre i JWT sicuri).
 * - Registra e smista le rotte principali (API) per far comunicare Frontend e Database.
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./config/db');

// Importazione delle rotte
const authRoutes = require('./routes/authRoutes');
const trasferteRoutes = require('./routes/trasferteRoutes');
const speseRoutes = require('./routes/speseRoutes');
const policiesRoutes = require('./routes/policiesRoutes');
const utentiRoutes = require('./routes/utentiRoutes');


const { verifyToken } = require('./middlewares/authMiddleware');

const app = express();

// ==========================================
// ⚙️ MIDDLEWARE GLOBALI
// ==========================================
// Il CORS è configurato PERFETTAMENTE per far passare Vite (porta 5173)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public")); // Per i file caricati (scontrini)

// ==========================================
// 🗄️ TEST CONNESSIONE DATABASE
// ==========================================
db.query("SELECT 1")
  .then(() => console.log("✅ Database connesso con successo!"))
  .catch((err) => console.error("❌ Errore DB:", err.message));

// ==========================================
// 🚦 REGISTRAZIONE ROTTE PRINCIPALI
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/trasferte', trasferteRoutes);
app.use('/api/spese', speseRoutes);
app.use('/api/policies', policiesRoutes);
app.use('/api/utenti', utentiRoutes);

// ==========================================
// 🛠️ ROTTE DI TEST E FALLBACK
// ==========================================
app.get('/', (req, res) => {
  res.json({ message: "API attiva" });
});

app.get('/api/status', (req, res) => {
  res.json({ message: "Il server Express è online e pronto a spaccare! 🚀" });
});

app.get('/api/profilo-segreto', verifyToken, (req, res) => {
  res.json({
    message: "Benvenuto nell'area VIP!",
    datiUtente: req.user,
  });
});

// ==========================================
// 🚨 MIDDLEWARE GESTIONE ERRORI
// ==========================================
app.use((err, req, res, next) => {
  console.error("Errore catturato:", err);
  res.status(500).json({ error: err.message });
});

// ==========================================
// 🚀 AVVIO DEL SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Express in ascolto sulla porta ${PORT}`);
});