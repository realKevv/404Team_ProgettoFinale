const express = require("express");
const router = express.Router();
const {
  getAllTrasferte,
  getTrasferteById,
  createTrasferta,
} = require("../controllers/trasferteController");

router.get("/", getAllTrasferte);
router.get("/:id", getTrasferteById);
router.post("/", createTrasferta);

module.exports = router;
