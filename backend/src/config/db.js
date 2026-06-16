const mysql = require("mysql2/promise");
require("dotenv").config();

// Creiamo un Pool di connessioni per gestire richieste multiple senza bloccare il server
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Database BusinessTravel connesso con successo!");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Errore di connessione al database:", err.message);
  });

module.exports = pool;
