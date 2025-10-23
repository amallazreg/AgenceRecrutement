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
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    if (String(offer.companyId) !== req.user.id) return res.status(403).json({ message: 'Not allowed' });

    // Update seulement les champs attendus (ne pas remplacer tout req.body)
    const updatable = [
      'title','description','requiredSkills','experienceLevel','contractType',
      'location','salaryRange','startDate','applicationDeadline','workingHours','remoteOption',
      'programmingLanguages','frameworks','databaseKnowledge','tools','methodology',
      'requiredDiploma','medicalSpecialty','workSchedule','status'
    ];
    updatable.forEach(field => {
      if (field in req.body) offer[field] = req.body[field];
    });

    await offer.save();
    return res.json(offer);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete offer
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    if (String(offer.companyId) !== req.user.id) return res.status(403).json({ message: 'Not allowed' });

    await offer.remove();
    return res.json({ message: 'Offer deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports ={
    createOffer,
    getOffersByCompany,
    getAllOffers,
    getOfferById,
    updateOffer,
    deleteOffer

}