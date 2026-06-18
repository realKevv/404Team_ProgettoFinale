/**
 * ============================================================================
 * FILE: src/config/db.js
 * SCOPO: Gestione robusta connessione MySQL/MariaDB con retry (Docker-safe)
 * ============================================================================
 */

const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

// 🔁 funzione di retry connessione
async function initDB(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      const connection = await pool.getConnection();
      console.log("✅ Database BusinessTravel connesso con successo!");
      connection.release();

      return pool;
    } catch (err) {
      console.error(`❌ Tentativo ${i + 1}/${retries} fallito: ${err.message}`);

      // attesa prima del retry
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw new Error("❌ Impossibile connettersi al database dopo vari tentativi");
}

// inizializza subito
initDB().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

module.exports = pool;
