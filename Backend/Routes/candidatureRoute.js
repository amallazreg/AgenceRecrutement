const express = require('express');
const router = express.Router();
const {applyOffer,getCandidatureForOffer,getMyCandidature,updateCandidatureStatus,getCountCandidatureForOffer, deleteCandidature,getNotification, notificationLue} = require('../Controllers/candidatureController');
const upload = require('../middleware/upload'); // Multer pour fichiers

router.post('/applyOffer/:offerId/:candidateId', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'motivationLetter', maxCount: 1 },
  { name: 'additionalDocuments', maxCount: 5 },
]), applyOffer);

router.get('/getCandidatureForOffer/:offerId',getCandidatureForOffer);

router.get('/getMyCandidature/:candidateId',getMyCandidature);
router.delete('/deleteCandidature/:candidatureId', deleteCandidature);

router.put('/updateCandidatureStatus/:candidatureId',updateCandidatureStatus);
router.get('/getCountCandidatureForOffer/:offerId', getCountCandidatureForOffer);

router.get('getNotification/:candidateId',getNotification); 
router.put('notificationLue/:id',notificationLue);



module.exports = router;
