
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
const app = express();
const { verifyToken } = require('./middlewares/authMiddleware'); // <-- L'import del middleware


// Middleware fondamentale! 
app.use(express.json());
app.use(cookieParser());


// Registrazione rotte
app.use('/api/auth', authRoutes);

// Una GET di prova per vedere se il server è vivo
app.get('/api/status', (req, res) => {
  res.json({ message: "Il server Express è online e pronto a spaccare! 🚀" });
});


const PORT = process.env.PORT || 5000;

app.get('/api/profilo-segreto', verifyToken, (req, res) => {
  res.json({
    message: "Benvenuto nell'area VIP!",
    datiUtente: req.user
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server Express in ascolto sulla porta ${PORT}`);
});