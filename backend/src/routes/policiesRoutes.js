const express = require("express");
const router = express.Router();
const { getAllPolicies, updatePolicy } = require("../controllers/policiesController");
const { verifyToken } = require('../middlewares/authMiddleware');

// Rotta protetta per leggere i massimali (es. 50€ vitto, 150€ alloggio)
router.get("/", verifyToken, getAllPolicies);

// Rotta protetta per aggiornare il massimale (Admin only)
router.put("/:categoria", verifyToken, updatePolicy);

module.exports = router;