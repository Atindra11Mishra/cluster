const express = require("express");
const { calculateScore } = require("../controllers/scoreController.js");

const router = express.Router();

// ✅ Use GET request & dynamic parameters
router.get("/get-score/:username/:address", calculateScore);

module.exports = router;
