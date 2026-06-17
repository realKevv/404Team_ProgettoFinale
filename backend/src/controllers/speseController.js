const db = require("../config/db");
const path = require("path");
const fs = require("fs");


//funzione per recuperare tutte le spese
exports.getSpeseByTrasferta = async (req, res) => {
    try {
        const idTrasferta = req.params.idTrasferta;
        const [spese] = await db.query('SELECT * FROM spese WHERE id_trasferta = ?', [idTrasferta]);
        res.status(200).json(spese);
    } catch (error) {
        console.error("❌ Errore GET spese:", error);
        res.status(500).json({ message: "Errore nel recupero delle spese." });
    }
};

exports.addSpesa = async (req, res) => {
    try {
        // Guarda qua: non chiediamo più fuori_policy al frontend!
        const { id_trasferta, categoria, importo } = req.body;

        // ========================================================
        // 🧠 IL CERVELLO DEL BACKEND: CONTROLLO POLICY
        // ========================================================
        let fuori_policy = 0; // Di default assumiamo che sia nei limiti

        // 1. Andiamo a leggere il tetto massimo per questa specifica categoria
        const [policyResult] = await db.query('SELECT massimale_giornaliero FROM travel_policies WHERE categoria = ?', [categoria]);

        if (policyResult.length > 0) {
            const massimale = policyResult[0].massimale_giornaliero;

            // 2. Facciamo il calcolo: "l'importo supera il massimale?"
            if (parseFloat(importo) > parseFloat(massimale)) {
                fuori_policy = 1;
                console.log(`⚠️ Allarme Policy: Spesa di ${importo}€ per ${categoria} (Limite: ${massimale}€)`);
            }
        }
        // ========================================================

        // Se c'è un file allegato, multer ce lo mette in req.file
        let urlScontrino = null;
        if (req.file) {
            urlScontrino = `/uploads/${req.file.filename}`;
        }

        const query = `
            INSERT INTO spese (id_trasferta, categoria, importo, url_scontrino, fuori_policy) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [id_trasferta, categoria, importo, urlScontrino, fuori_policy]);

        res.status(201).json({
            message: "Spesa inserita con successo!",
            id_spesa: result.insertId,
            url_scontrino: urlScontrino,
            fuori_policy: fuori_policy === 1
        });
    } catch (error) {
        console.error("❌ Errore POST spesa:", error);
        res.status(500).json({ message: "Errore nell'inserimento della spesa." });
    }
};



exports.valutaSpesa = async (req, res) => {
    try {
        const { idSpesa } = req.params;
        const { stato_approvazione, importo_rimborsato } = req.body;

        // 1. Controlliamo se chi fa la richiesta è davvero un Admin!
        if (req.user.ruolo !== 'admin') {
            return res.status(403).json({ message: "Accesso negato: solo gli Admin possono approvare le spese." });
        }

        // 2. Eseguiamo l'aggiornamento nel database
        const query = `
            UPDATE spese 
            SET stato_approvazione = ?, importo_rimborsato = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [stato_approvazione, importo_rimborsato, idSpesa]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Spesa non trovata." });
        }

        res.json({
            message: `Spesa ${stato_approvazione} con successo!`,
            importo_concordato: importo_rimborsato
        });

    } catch (error) {
        console.error("❌ Errore valutazione spesa:", error);
        res.status(500).json({ message: "Errore durante l'approvazione della spesa." });
    }
};

exports.deleteSpesa = async (req, res) => {
    try {
        const { idSpesa } = req.params;
        const [spesa] = await db.query('SELECT url_scontrino FROM spese WHERE id = ?', [idSpesa]);

        if (spesa.length === 0) {
            return res.status(404).json({ message: "Spesa non trovata." });
        }

        // 2. Se c'è un file allegato, lo cancelliamo fisicamente dal server! 🧹
        if (spesa[0].url_scontrino) {
            const nomeFile = spesa[0].url_scontrino.split('/').pop();
            const percorsoFile = path.join(__dirname, '../../public/uploads', nomeFile);
            if (fs.existsSync(percorsoFile)) {
                fs.unlinkSync(percorsoFile);
            }
        }

        // 3. Cancelliamo il record dal Database
        await db.query('DELETE FROM spese WHERE id = ?', [idSpesa]);

        res.status(200).json({ message: "Scontrino eliminato con successo!" });
    } catch (error) {
        console.error("❌ Errore DELETE spesa:", error);
        res.status(500).json({ message: "Errore durante l'eliminazione." });
    }
};