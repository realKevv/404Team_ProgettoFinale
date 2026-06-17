/**
 * ============================================================================
 * FILE: src/middlewares/authMiddleware.js
 * SCOPO: Proteggere le rotte sensibili (es. dashboard, trasferte).
 * COSA FA: 
 * - Intercetta la richiesta HTTP prima che arrivi al controller.
 * - Cerca il JWT all'interno dei cookie HttpOnly.
 * - Se il token è valido, estrae i dati dell'utente (id, ruolo) e li attacca
 * alla richiesta (req.user) per renderli disponibili ai controller successivi.
 * - Se il token manca o è manipolato, blocca la richiesta (401/403).
 * ============================================================================
 */
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // 1. Cerchiamo il token PRIMA nell'header Authorization
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1]; // Prende la parte dopo "Bearer"
    // 2. Se non c'è, controlliamo i cookie (opzionale)
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // 3. Se non troviamo nulla in nessuno dei due posti...
    if (!token) {
        return res.status(401).json({ message: "Accesso negato. Effettua il login per continuare." });
    }
    try {
        // Assicurati che process.env.JWT_SECRET sia lo stesso usato nel login
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TUA_CHIAVE_SEGRETA');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token non valido o scaduto." });
    }
};

exports.checkRole = (ruoloRichiesto) => {
    return (req, res, next) => {
        // 1. Controllo di sicurezza: c'è un utente?
        if (!req.user) {
            return res.status(401).json({ message: "Devi prima fare il login!" });
        }

        // 2. Controllo del ruolo
        if (req.user.ruolo !== ruoloRichiesto) {
            return res.status(403).json({
                message: `Accesso negato. Permessi insufficienti (Richiesto: ${ruoloRichiesto}).`
            });
        }

        // 3. Se il ruolo combacia, il buttafuori VIP ti fa passare!
        next();
    };
};