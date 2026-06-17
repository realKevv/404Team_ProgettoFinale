const express = require("express");
const router = express.Router();
const { getAllUtenti } = require("../controllers/utentiController");
const { verifyToken } = require('../middlewares/authMiddleware');

router.get("/", verifyToken, getAllUtenti);

module.exports = router;