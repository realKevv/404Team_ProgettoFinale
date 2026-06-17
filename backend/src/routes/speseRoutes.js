/* ==========================================================================
   📂 ROUTE: SPESE (Gestione Scontrini, Policy Aziendali e Approvazioni)
   ==========================================================================
   Questo file definisce tutti gli endpoint relativi alle spese dei dipendenti:
   
   - 📤 Upload: Gestisce il caricamento fisico di foto/PDF tramite Multer.
   - 🧠 Business Logic: Calcola in automatico se si va fuori massimale.
   - 🛡️ Sicurezza (JWT): Tutte le rotte critiche sono blindate dal middleware 
        'verifyToken' (verifica del token e popolamento di 'req.user').
   - 👑 Privilegi Admin: L'endpoint di valutazione esegue un doppio controllo
        sul ruolo per consentire l'approvazione/rimborso solo agli Admin.
   ========================================================================== */


const express = require('express');
const router = express.Router();
const speseController = require('../controllers/speseController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Multer prende i file inviati dagli utenti (es. foto o PDF) e li salva sul Node.js.
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        // Rinomina il file mettendo la data davanti, così non ci sono doppioni!
        const suffissoUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, suffissoUnico + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// 1. Leggere le spese
router.get('/trasferta/:idTrasferta', verifyToken, speseController.getSpeseByTrasferta);

// 2. Aggiungere una spesa (con caricamento file singolo chiamato 'scontrino')
// Guarda la combo: prima entra il buttafuori, poi il multer prende il file, e il controller salva nel DB!
router.post('/', verifyToken, upload.single('scontrino'), speseController.addSpesa);


// 4. Valutazione spesa da parte dell'Admin 🚀
// Usiamo verifyToken così req.user viene popolato prima di entrare nel controller,
// poi ci penserà il controller a fare la seconda sbarrata controllando se il ruolo è 'admin'!
router.put('/valuta/:idSpesa', verifyToken, speseController.valutaSpesa);

router.delete('/:idSpesa', verifyToken, speseController.deleteSpesa);


module.exports = router;