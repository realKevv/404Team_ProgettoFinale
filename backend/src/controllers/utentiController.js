const db = require("../config/db");

const getAllUtenti = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nome_completo, email, ruolo FROM utenti");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllUtenti };