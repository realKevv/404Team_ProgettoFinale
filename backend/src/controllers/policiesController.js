const db = require("../config/db");

const getAllPolicies = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM travel_policies");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePolicy = async (req, res) => {
    try {
        if (req.user.ruolo !== 'admin') {
            return res.status(403).json({ message: "Accesso negato: solo gli Admin possono modificare le policies." });
        }
        
        const { categoria } = req.params;
        const { massimale_giornaliero } = req.body;
        
        await db.query(
            "UPDATE travel_policies SET massimale_giornaliero = ? WHERE categoria = ?",
            [massimale_giornaliero, categoria]
        );
        res.json({ message: "Policy aggiornata con successo!" });
    } catch (err) {
        console.error("Errore UPDATE policy:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllPolicies, updatePolicy };