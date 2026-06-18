const db = require("../config/db");
const bcrypt = require('bcryptjs');

const getAllUtenti = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nome_completo, email, ruolo FROM utenti");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createUtente = async (req, res) => {
    try {
        const { nome_completo, email, password, ruolo } = req.body;

        if (!nome_completo || !email || !password) {
            return res.status(400).json({ message: "Tutti i campi obbligatori devono essere compilati." });
        }

        // 1. Controllo se l'email esiste già
        const [existing] = await db.query("SELECT id FROM utenti WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Email già registrata nel sistema." });
        }

        // 2. Hash della password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        console.log("🔐 Hash generato per il nuovo utente:", password_hash);

        // 3. Inserimento nel database
        const ruoloFinale = ruolo || 'user';
        const [result] = await db.query(
            "INSERT INTO utenti (nome_completo, email, password_hash, ruolo) VALUES (?, ?, ?, ?)",
            [nome_completo, email, password_hash, ruoloFinale]
        );

        res.status(201).json({
            id: result.insertId,
            nome_completo,
            email,
            ruolo: ruoloFinale
        });
    } catch (err) {
        console.error("Errore creazione utente:", err);
        res.status(500).json({ error: "Errore durante la creazione dell'utente." });
    }
};

module.exports = { getAllUtenti, createUtente };