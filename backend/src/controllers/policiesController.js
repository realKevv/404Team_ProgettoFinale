const db = require("../config/db");

const getAllPolicies = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM travel_policies");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllPolicies };