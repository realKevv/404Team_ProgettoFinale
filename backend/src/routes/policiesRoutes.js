const express = require("express");
const router = express.Router();
const { getAllPolicies } = require("../controllers/policiesController");
const { verifyToken } = require('../middlewares/authMiddleware');

// Rotta protetta per leggere i massimali (es. 50€ vitto, 150€ alloggio)
router.get("/", verifyToken, getAllPolicies);

module.exports = router;