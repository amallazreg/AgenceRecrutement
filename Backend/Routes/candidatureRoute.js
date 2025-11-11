const express = require('express');
const router = express.Router();
const {applyOffer,getCandidatureForOffer} = require('../Controllers/candidatureController');
const upload = require('../middleware/upload'); // Multer pour fichiers

router.post('/applyOffer/:offerId/:candidateId', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'motivationLetter', maxCount: 1 },
  { name: 'additionalDocuments', maxCount: 5 },
]), applyOffer);

router.get('/getCandidatureForOffer/:offerId',getCandidatureForOffer);


module.exports = router;
