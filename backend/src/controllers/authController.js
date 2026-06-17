/**
 * ============================================================================
 * FILE: src/controllers/authController.js
 * SCOPO: Motore logico dell'autenticazione (Login/Logout).
 * COSA FA: 
 * 1. Riceve le credenziali dal frontend.
 * 2. Interroga il database usando query parametrizzate (?) per prevenire SQL Injection.
 * 3. Valida la password confrontandola con l'hash salvato nel DB tramite bcrypt 
 * (hashing a senso unico, zero password in chiaro).
 * 4. Genera un JSON Web Token (JWT) contenente il ruolo (es. admin/user).
 * 5. Invia il Token incapsulandolo in un Cookie HttpOnly per bloccare attacchi XSS 
 * (furto di token tramite JavaScript malevolo).
 * ============================================================================
 */
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {

        //estrazione dati
        const { email, password } = req.body;

        // Controllo base
        if (!email || !password) {
            return res.status(400).json({ message: "Inserisci email e password." });
        }

        //  Cerchiamo l'utente sul database.
        // Usiamo la sintassi [email] per sostituire il punto interrogativo (Anti SQL-Injection)
        const [rows] = await db.query('SELECT * FROM utenti WHERE email = ?', [email]);

        console.log("1️⃣ Utenti trovati:", rows.length); //debug


        // Se non trovo nessuno, l'array rows è vuoto
        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenziali non valide." });
        }

        const utente = rows[0];

        // Confronto la password scritta a 
        // mano con l'Hash salvato nel DB
        console.log("2️⃣ Hash nel DB:", utente.password_hash); //debug
        console.log("Lunghezza Hash nel DB:", utente.password_hash.length); //debug


        const passwordCorretta = await bcrypt.compare(password, utente.password_hash);
        if (!passwordCorretta) {
            return res.status(401).json({ message: "Credenziali non valide." });
        }


        console.log("3️⃣ La password combacia?", passwordCorretta); //debug

        //Creiamo il JWT
        const payload = {
            id: utente.id,
            ruolo: utente.ruolo
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h' // Scade domani alla stessa ora
        });

        // BLINDIAMO IL TOKEN: Lo mettiamo in un Cookie HttpOnly
        res.cookie('token', token, {
            httpOnly: true, // JavaScript nel browser NON può vederlo/rubarlo
            secure: false,  // Metti a TRUE solo se usi HTTPS (in locale su http metti false)
            sameSite: 'strict', // Nessun sito esterno può fare richieste fasulle
            maxAge: 24 * 60 * 60 * 1000 // 24 ore in millisecondi
        });

        // Rispondiamo al frontend inviando solo i dati "puliti"
        res.status(200).json({
            message: "Login effettuato con successo!",
            user: {
                id: utente.id,
                nome_completo: utente.nome_completo,
                email: utente.email,
                ruolo: utente.ruolo
            }
        });

    } catch (error) {
        console.error("❌ Errore durante il login:", error);
        res.status(500).json({ message: "Errore interno del server." });
    }
};