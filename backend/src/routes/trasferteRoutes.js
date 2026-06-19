const express = require("express");
const router = express.Router();

const {
  getAllTrasferte,
  getTrasferteById,
  createTrasferta,
  cambiaStatoTrasferta,
  deleteTrasferta
} = require("../controllers/trasferteController");



router.get("/", verifyToken, getAllTrasferte);
router.get("/:id", verifyToken, getTrasferteById);
router.post("/", verifyToken, createTrasferta);

router.put("/:id/stato", verifyToken, cambiaStatoTrasferta);
router.delete("/:id", verifyToken, deleteTrasferta);

module.exports = router;