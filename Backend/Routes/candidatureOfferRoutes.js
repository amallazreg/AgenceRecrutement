const express = require("express");
const router = express.Router();

const { recommendOffers } = require("../Controllers/candidatureOffreController");

// Route recommandation
router.get("/recommend/:candidateId", recommendOffers);

module.exports = router;
