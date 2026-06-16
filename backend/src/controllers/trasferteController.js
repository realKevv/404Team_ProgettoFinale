const db = require("../config/db");

const getAllTrasferte = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM trasferte");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTrasferteById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM trasferte WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Trasferta non trovata" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTrasferta = async (req, res) => {
  const { id_utente, destinazione, data_inizio, data_fine, motivo } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO trasferte (id_utente, destinazione, data_inizio, data_fine, motivo) VALUES (?, ?, ?, ?, ?)",
      [id_utente, destinazione, data_inizio, data_fine, motivo],
    );
    res.status(201).json({ id: result.insertId, message: "Trasferta creata" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllTrasferte, getTrasferteById, createTrasferta };
