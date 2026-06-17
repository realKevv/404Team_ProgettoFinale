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
    const token = req.cookies.token;

    // 2. Niente token? Fuori!
    if (!token) {
        return res.status(401).json({ message: "Accesso negato. Effettua il login per continuare." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ message: "Token non valido o scaduto." });
    }
};