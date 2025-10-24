// controllers/offerController.js
const Offer = require('../Models/offreModel');
const Company = require('../Models/companyModel');

const { cleanOfferData } = require('../utils/offerUtils');

// Create Offer
const createOffer = async (req, res) => {
  try {
    const companyId = req.company._id; // ✅ fourni par middleware
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    // 1️⃣ Ajouter d’abord les infos de la société
    let offerData = {
      ...req.body,
      companyId: company._id,
      sector: company.sector
    };

    // 2️⃣ Ensuite seulement, nettoyer selon le secteur
    offerData = cleanOfferData(offerData);

    // 3️⃣ Créer et sauvegarder
    // Créer dynamiquement le document sans remplir les champs absents
    const newOffer = new Offer(offerData);
    await newOffer.save();

    await newOffer.save();


    res.status(201).json({
      success: true,
      message: "Offre créée avec succès",
      offer: newOffer
    });

  } catch (error) {
    console.error("Erreur lors de la création de l’offre :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get offers of a company
const getOffersByCompany = async (req, res) => {
  try {
    const companyId = req.company._id;
    const offers = await Offer.find({ companyId }).sort({ createdAt: -1 });
    return res.json(offers);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all offers (for public listing)
const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ status: 'Publié' }).populate('companyId','name sector fullAddress');
    return res.json(offers);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get offer by id
const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('companyId','name sector fullAddress');
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    return res.json(offer);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update offer (only company owner)
// controllers/offerController.js
const { cleanOfferDataForUpdate } = require('../utils/offerUtils');

const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    // Vérification que c’est la société qui possède l’offre
    if (String(offer.companyId) !== String(req.company._id)) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // Filtrer seulement les champs autorisés pour ce secteur
    const cleanedData = cleanOfferDataForUpdate(offer, req.body);

    // Appliquer dynamiquement la mise à jour
    Object.entries(cleanedData).forEach(([key, value]) => {
      offer[key] = value;
    });

    await offer.save();

    res.json({
      success: true,
      message: "Offre mise à jour avec succès",
      offer
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    // Vérifier que c'est bien la société qui a créé l'offre
    if (String(offer.companyId) !== String(req.company._id)) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await offer.deleteOne(); // supprime l'offre
    return res.json({ message: 'Offer deleted' });
  } catch (err) {
    console.error('Delete offer error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get total number of offers
const getOffreCount = async (req, res) => {
  try {
    const totalOffers = await Offer.countDocuments();

    

    return res.json({ totalOffers });
  } catch (err) {
    console.error('Erreur lors du comptage des offres :', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



module.exports ={
    createOffer,
    getOffersByCompany,
    getAllOffers,
    getOfferById,
    updateOffer,
    deleteOffer,
    getOffreCount
  

}