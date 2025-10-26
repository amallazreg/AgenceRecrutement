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

    // 1b️⃣ Ajouter des dates par défaut si elles ne sont pas fournies
    if (!offerData.startOffreDate) {
      offerData.startOffreDate = new Date(); // aujourd'hui
    }

    if (!offerData.endOffreDate) {
      const end = new Date();
      end.setDate(end.getDate() + 7); // 7 jours par défaut
      offerData.endOffreDate = end;
    }

    // 2️⃣ Nettoyer selon le secteur
    offerData = cleanOfferData(offerData);

    // 3️⃣ Créer et sauvegarder
    const newOffer = new Offer(offerData);
    await newOffer.save();

    // 4️⃣ Calculer daysRemaining pour la réponse
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const todayZero = new Date();
    todayZero.setHours(0,0,0,0);

    const endDate = new Date(newOffer.endOffreDate);
    const startDate = new Date(newOffer.startOffreDate);
    const diffMs = endDate.getTime() - startDate.getTime();
    const daysRemaining = Math.floor(diffMs / MS_PER_DAY) + 1 ;

    res.status(201).json({
      success: true,
      message: "Offre créée avec succès",
      offer: {
        ...newOffer.toObject(),
        daysRemaining,
        statusInfo: daysRemaining > 0 ? `Expire dans ${daysRemaining} jour(s)` :
                     daysRemaining === 0 ? "Expire aujourd'hui" :
                     `Expirée depuis ${Math.abs(daysRemaining)} jour(s)`
      }
    });

  } catch (error) {
    console.error("Erreur lors de la création de l’offre :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get offers of a company
// Get offers of a company (with remaining days and auto-archive)
const getOffersByCompany = async (req, res) => {
  try {
    const companyId = req.company._id;

    const offers = await Offer.find({ companyId }).sort({ createdAt: -1 });

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const today = new Date();
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const results = [];

    for (const offer of offers) {
      const offerObj = offer.toObject();

      if (!offer.endOffreDate) {
        results.push({
          ...offerObj,
          daysRemaining: null,
          statusInfo: 'Date de fin non définie'
        });
        continue;
      }

      const endDate = new Date(offer.endOffreDate);
      const diffMs = endDate.getTime() - todayZero.getTime();
      const daysRemaining = Math.floor(diffMs / MS_PER_DAY) + 1; // inclusif

      let statusInfo;
      if (daysRemaining > 0) {
        statusInfo = `Expire dans ${daysRemaining} jour(s)`;
      } else if (daysRemaining === 0) {
        statusInfo = "Expire aujourd'hui";
      } else {
        statusInfo = `Expirée depuis ${Math.abs(daysRemaining)} jour(s)`;
      }

      // Auto-archive si expirée
      if (daysRemaining <= 0 && offer.status !== 'Archivé') {
        offer.status = 'Archivé';
        try {
          await offer.save();
          offerObj.status = 'Archivé';
        } catch (saveErr) {
          console.error(`Erreur lors de l'archivage de l'offre ${offer._id}:`, saveErr);
        }
      }

      results.push({
        ...offerObj,
        daysRemaining,
        statusInfo
      });
    }

    return res.json(results);

  } catch (err) {
    console.error('Erreur lors de la récupération des offres de la société :', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Get all offers (for public listing)
// Get all offers (with remaining days and auto-archive)
const getAllOffers = async (req, res) => {
  try {
    // Récupère toutes les offres (ou limite si tu veux seulement 'Publié')
    const offers = await Offer.find().populate('companyId', 'name sector fullAddress');

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const today = new Date();
    // Normaliser la "date du jour" à 00:00:00 pour éviter les effets d'heure
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const results = [];

    // Utiliser for..of pour permettre des await lors des sauvegardes
    for (const offer of offers) {
      const offerObj = offer.toObject();

      // Si pas de EndOffreDate : daysRemaining null
      if (!offer.endOffreDate) {
        results.push({
          ...offerObj,
          daysRemaining: null,
          statusInfo: 'Date de fin non définie'
        });
        continue;
      }

      const endDate = new Date(offer.endOffreDate);

      // Calcul inclusif des jours restants depuis aujourd'hui :
      // daysRemaining = nombre de jours entre endDate et todayZero + 1 (inclusif)
      const diffMs = endDate.getTime() - todayZero.getTime();
      const daysRemaining = Math.floor(diffMs / MS_PER_DAY) + 1; // peut être négatif si expirée

      // Construire un texte lisible
      let statusInfo;
      if (daysRemaining > 0) {
        statusInfo = `Expire dans ${daysRemaining} jour(s)`;
      } else if (daysRemaining === 0) {
        statusInfo = "Expire aujourd'hui";
      } else {
        statusInfo = `Expirée depuis ${Math.abs(daysRemaining)} jour(s)`;
      }

      // Si l'offre est expirée et n'est pas encore archivée, on l'archive
      if (daysRemaining <= 0 && offer.status !== 'Archivé') {
        offer.status = 'Archivé';
        // sauve la modification de statut
        try {
          await offer.save();
          // mettre à jour l'objet renvoyé pour refléter le nouveau statut
          offerObj.status = 'Archivé';
        } catch (saveErr) {
          console.error(`Erreur lors de l'archivage de l'offre ${offer._id}:`, saveErr);
          // on continue quand même à renvoyer l'info au client
        }
      }

      results.push({
        ...offerObj,
        daysRemaining,
        statusInfo
      });
    }

    return res.json(results);
  } catch (err) {
    console.error('Erreur lors de la récupération des offres :', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Get offer by id
const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('companyId','name sector fullAddress');
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    offer.views += 1;
    await offer.save();

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
    // Compter les offres par statut
    const publishedCount = await Offer.countDocuments({ status: 'Publié' });
    const archivedCount  = await Offer.countDocuments({ status: 'Archivé' });
    const draftCount     = await Offer.countDocuments({ status: 'Brouillon' });

    return res.json({
      totalOffers: publishedCount + archivedCount + draftCount,
      published: publishedCount,
      archived: archivedCount,
      draft: draftCount
    });
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