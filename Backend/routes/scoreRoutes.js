const express = require("express");
const { calculateScore } = require("../controllers/scoreController.js");

const router = express.Router();

router.post("/get-score", calculateScore); // POST request to calculate score

module.exports = router;
