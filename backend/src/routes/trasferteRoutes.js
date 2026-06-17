const express = require("express");
const router = express.Router();

const {
  getAllTrasferte,
  getTrasferteById,
  createTrasferta,
} = require("../controllers/trasferteController");

router.get("/", verifyToken, getAllTrasferte);
router.get("/:id", verifyToken, getTrasferteById);
router.post("/", verifyToken, createTrasferta);

module.exports = router;
