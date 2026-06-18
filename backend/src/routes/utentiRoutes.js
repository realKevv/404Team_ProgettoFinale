const express = require("express");
const router = express.Router();
const { getAllUtenti, createUtente, deleteUtente } = require("../controllers/utentiController");
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.get("/", verifyToken, getAllUtenti);
router.post("/", verifyToken, checkRole('admin'), createUtente);
router.delete("/:id", verifyToken, checkRole('admin'), deleteUtente);

module.exports = router;