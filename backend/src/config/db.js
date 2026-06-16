/**
 * ============================================================================
 * FILE: src/config/db.js
 * SCOPO: Gestione della connessione al database MariaDB/MySQL.
 * COSA FA: 
 * - Legge in modo sicuro le credenziali dal file .env.
 * - Crea un "Pool di connessioni" tramite mysql2/promise per gestire richieste 
 * simultanee in modo efficiente, evitando colli di bottiglia.
 * - Permette di esportare la connessione per usarla in modo asincrono (async/await)
 * in tutti i controller del progetto.
 * ============================================================================
 */


const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Database BusinessTravel connesso con successo!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Errore di connessione al database:', err.message);
    });

module.exports = pool;