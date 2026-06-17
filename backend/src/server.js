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
require('dotenv').config();
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const trasferteRoutes = require('./routes/trasferteRoutes');
const speseRoutes = require('./routes/speseRoutes');

const { verifyToken } = require('./middlewares/authMiddleware');

const app = express();
// ==========================================
// 🚦 REGISTRAZIONE ROTTE PRINCIPALI
// ==========================================
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/trasferte', trasferteRoutes);
app.use('/api/spese', speseRoutes);


// ==========================================
// 🛠️ ROTTE DI TEST (Per il debug rapido)
// ==========================================
// Test 1: Server vivo (Rotta pubblica)
app.get('/api/status', (req, res) => {
  res.json({ message: "Il server Express è online e pronto a spaccare! 🚀" });
});

// Test 2: Controllo Token 
app.get('/api/profilo-segreto', verifyToken, (req, res) => {
  res.json({
    message: "Benvenuto nell'area VIP!",
    datiUtente: req.user,
  });
});


// ==========================================
// 🚀 AVVIO DEL SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Express in ascolto sulla porta ${PORT}`);
});
