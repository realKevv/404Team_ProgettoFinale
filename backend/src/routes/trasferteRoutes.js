const express = require("express");
const router = express.Router();

const {
  getAllTrasferte,
  getTrasferteById,
  createTrasferta,
  cambiaStatoTrasferta
} = require("../controllers/trasferteController");

const { verifyToken } = require('../middlewares/authMiddleware');

router.get("/", verifyToken, getAllTrasferte);
router.get("/:id", verifyToken, getTrasferteById);
router.post("/", verifyToken, createTrasferta);

router.put("/:id/stato", verifyToken, cambiaStatoTrasferta);

module.exports = router;