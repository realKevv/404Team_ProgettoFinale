const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const trasferteRoutes = require("./routes/trasferteRoutes");

const app = express();

// Middleware: abilita CORS e parsing del body in JSON
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Verifica connessione al database all'avvio del server
db.query("SELECT 1")
  .then(() => console.log("Database connesso!"))
  .catch((err) => console.error("Errore DB:", err.message));

// Rotta base per verificare che il server sia attivo
app.get("/", (req, res) => {
  res.json({ message: "API attiva" });
});
// Rotta per i viaggi
app.use("/api/trasferte", trasferteRoutes);

// Middleware globale per la gestione degli errori
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;
