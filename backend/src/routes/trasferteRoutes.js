const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  getAllTrasferte,
  getTrasferteById,
  createTrasferta,
  cambiaStatoTrasferta
} = require("../controllers/trasferteController");



router.get("/", verifyToken, getAllTrasferte);
router.get("/:id", verifyToken, getTrasferteById);
router.post("/", verifyToken, createTrasferta);

router.put("/:id/stato", verifyToken, cambiaStatoTrasferta);

module.exports = router;