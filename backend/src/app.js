const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const db = require("./config/db");

const app = express();

// Configurazione dei middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verifica della connessione al database all'avvio
db.query("SELECT 1")
  .then(() => {
    console.log("Database connesso correttamente (db_traveller)!");
  })
  .catch((err) => {
    console.error("Errore connessione database (db_traveller):", err.message);
  });

// Rotta di base per verificare se il server è attivo
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Progetto Finale API" });
});

// Rotta per verificare la connessione al DB su richiesta
app.get("/api/test-db", async (req, res) => {
  try {
    const [result] = await db.query("SELECT 1 + 1 AS solution");
    res.json({
      status: "success",
      message: "Connessione al database db_traveller riuscita!",
      result: result[0],
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Errore durante la query al database db_traveller",
      error: err.message,
    });
  }
});

// Middleware per la gestione degli errori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Qualcosa è andato storto!",
  });
});

module.exports = app;
