const db = require("../config/db");

const getAllTrasferte = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        t.*,
        u.nome_completo AS richiedente
      FROM trasferte t
      LEFT JOIN utenti u ON t.id_utente = u.id
      ORDER BY t.id DESC
    `);
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
  const { destinazione, data_inizio, data_fine, motivo } = req.body;
  const id_utente = req.user.id;

  try {
    const oggi = new Date().toISOString().split('T')[0];

    if (data_fine < data_inizio) {
      return res.status(400).json({ error: "La data di fine non può essere precedente a quella di inizio." });
    }
    if (data_inizio < oggi) {
      return res.status(400).json({ error: "Non puoi richiedere trasferte per date già passate." });
    }

    // 🚨 2. CONTROLLO ANTI-UBIQUITÀ (Sovrapposizione date)
    // La logica: (InizioNuova <= FineVecchia) AND (FineNuova >= InizioVecchia)
    const [viaggiSovrapposti] = await db.query(`
            SELECT id, destinazione FROM trasferte 
            WHERE id_utente = ? 
            AND stato != 'rifiutata' 
            AND data_inizio <= ? 
            AND data_fine >= ?
        `, [id_utente, data_fine, data_inizio]);

    if (viaggiSovrapposti.length > 0) {
      return res.status(400).json({
        error: `Hai già una trasferta attiva o in approvazione per queste date (${viaggiSovrapposti[0].destinazione}).`
      });
    }

    // Se passa tutti i controlli, salviamo nel DB!
    const [result] = await db.query(
      "INSERT INTO trasferte (id_utente, destinazione, data_inizio, data_fine, motivo) VALUES (?, ?, ?, ?, ?)",
      [id_utente, destinazione, data_inizio, data_fine, motivo]
    );

    res.status(201).json({
      id: result.insertId, id_utente, destinazione, data_inizio, data_fine, motivo, stato: 'in_attesa'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cambiaStatoTrasferta = async (req, res) => {
  try {
    const { id } = req.params;
    const { stato } = req.body;

    if (req.user.ruolo !== 'admin') {
      return res.status(403).json({ error: "Accesso negato: solo gli Admin possono cambiare lo stato." });
    }

    // Evitiamo che passino stringhe strane nel DB
    if (!['approvata', 'rifiutata'].includes(stato)) {
      return res.status(400).json({ error: "Stato non valido." });
    }

    const [result] = await db.query(
      "UPDATE trasferte SET stato = ? WHERE id = ?",
      [stato, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Trasferta non trovata." });
    }

    res.json({ message: `Trasferta ${stato} con successo!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTrasferta = async (req, res) => {
  try {
    const { id } = req.params;
    const utenteCorrente = req.user;

    const [rows] = await db.query("SELECT * FROM trasferte WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Trasferta non trovata." });
    }

    const trasferta = rows[0];

    if (utenteCorrente.ruolo !== 'admin' && trasferta.id_utente !== utenteCorrente.id) {
      return res.status(403).json({ error: "Non hai i permessi per eliminare questa trasferta." });
    }

    await db.query("DELETE FROM trasferte WHERE id = ?", [id]);
    res.json({ message: "Trasferta eliminata con successo!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllTrasferte, getTrasferteById, createTrasferta, cambiaStatoTrasferta, deleteTrasferta };