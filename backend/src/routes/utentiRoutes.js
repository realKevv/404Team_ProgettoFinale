const express = require("express");
const router = express.Router();
const { getAllUtenti, createUtente } = require("../controllers/utentiController");
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.get("/", verifyToken, getAllUtenti);
router.post("/", verifyToken, checkRole('admin'), createUtente);

module.exports = router;