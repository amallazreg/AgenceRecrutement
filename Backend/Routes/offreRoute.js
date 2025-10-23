
const express = require('express');
const router = express.Router();
const {  createOffer, getOffersByCompany,getAllOffers,getOfferById,updateOffer,deleteOffer} = require('../Controllers/offerController');
const authMiddleware = require('../middleware/authMiddleware');

// Company actions (auth required)
router.post('/createOffre', authMiddleware, createOffer);
router.get('/getOffersByCompany', authMiddleware, getOffersByCompany);
router.put('/updateOffre/:id', authMiddleware, updateOffer);
router.delete('/deleteOffre/:id', authMiddleware, deleteOffer);

// Public endpoints
router.get('/getAllOffres/',getAllOffers);
router.get('/getOffreById/:id',getOfferById);

module.exports = router;