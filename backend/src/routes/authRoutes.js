
/**
 * ============================================================================
 * FILE: src/routes/authRoutes.js
 * SCOPO: Definizione degli endpoint (URL) relativi all'autenticazione.
 * COSA FA: 
 * - Separa logicamente le rotte dal file server.js principale per mantenere il codice pulito.
 * - Intercetta le richieste HTTP (es. POST /login) e le indirizza alla funzione 
 * corrispondente nel file authController.js.
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

module.exports = router;