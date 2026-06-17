const db = require("../config/db");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp"); // 🔥 Importiamo Sharp per la pressa

// Funzione per recuperare tutte le spese
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
        const { id_trasferta, categoria, importo } = req.body;

        // ========================================================
        // 🧠 IL CERVELLO DEL BACKEND: CONTROLLO POLICY
        // ========================================================
        let fuori_policy = 0;

        const [policyResult] = await db.query('SELECT massimale_giornaliero FROM travel_policies WHERE categoria = ?', [categoria]);

        if (policyResult.length > 0) {
            const massimale = policyResult[0].massimale_giornaliero;

            if (parseFloat(importo) > parseFloat(massimale)) {
                fuori_policy = 1;
                console.log(`⚠️ Allarme Policy: Spesa di ${importo}€ per ${categoria} (Limite: ${massimale}€)`);
            }
        }
        // ========================================================

        let urlScontrino = null;

        // 🔥 SE C'È UN FILE NELLA RAM, LO PASSIAMO A SHARP E LO SALVIAMO NEL PROGETTO
        if (req.file) {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const isImage = req.file.mimetype.startsWith('image/');

            // Definiamo la cartella stabile nel progetto: "public/uploads" nella radice del backend
            const targetFolder = path.join(__dirname, '../../public/uploads');

            // Se la cartella nel progetto non esiste, la creiamo in automatico
            if (!fs.existsSync(targetFolder)) {
                fs.mkdirSync(targetFolder, { recursive: true });
            }

            if (isImage) {
                // 📸 È UN'IMMAGINE: Sharp la ridimensiona, la converte in .webp e la scrive sul disco
                const filename = `${uniqueName}.webp`;
                const filepath = path.join(targetFolder, filename);

                await sharp(req.file.buffer)
                    .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(filepath); // Scrittura fisica nel progetto

                // Questo è il nome file che manderemo alle rotte di recupero
                urlScontrino = `/uploads/${filename}`;
            } else {
                // 📄 È UN PDF: Lo scriviamo così com'è sul disco del progetto
                const ext = path.extname(req.file.originalname);
                const filename = `${uniqueName}${ext}`;
                const filepath = path.join(targetFolder, filename);

                fs.writeFileSync(filepath, req.file.buffer); // Scrittura fisica nel progetto

                urlScontrino = `/uploads/${filename}`;
            }
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

// Modificato il percorso per andarlo a pescare nella cartella del progetto "public/uploads"
exports.getScontrinoFisico = (req, res) => {
    const nomeFile = req.params.nomeFile;
    const percorsoFile = path.join(__dirname, '../../public/uploads', nomeFile);

    if (fs.existsSync(percorsoFile)) {
        res.sendFile(percorsoFile);
    } else {
        res.status(404).json({ message: "Scontrino non trovato." });
    }
};

exports.valutaSpesa = async (req, res) => {
    try {
        const { idSpesa } = req.params;
        const { stato_approvazione, importo_rimborsato } = req.body;

        if (req.user.ruolo !== 'admin') {
            return res.status(403).json({ message: "Accesso negato: solo gli Admin possono approvare le spese." });
        }

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

// Modificato il percorso per eliminare il file fisicamente dalla nuova cartella del progetto
exports.deleteSpesa = async (req, res) => {
    try {
        const { idSpesa } = req.params;

        const [spesa] = await db.query('SELECT url_scontrino FROM spese WHERE id = ?', [idSpesa]);

        if (spesa.length === 0) {
            return res.status(404).json({ message: "Spesa non trovata." });
        }

        if (spesa[0].url_scontrino) {
            const nomeFile = spesa[0].url_scontrino.split('/').pop();
            const percorsoFile = path.join(__dirname, '../../public/uploads', nomeFile);
            if (fs.existsSync(percorsoFile)) {
                fs.unlinkSync(percorsoFile);
            }
        }

        await db.query('DELETE FROM spese WHERE id = ?', [idSpesa]);

        res.status(200).json({ message: "Scontrino eliminato con successo!" });
    } catch (error) {
        console.error("❌ Errore DELETE spesa:", error);
        res.status(500).json({ message: "Errore durante l'eliminazione." });
    }
};