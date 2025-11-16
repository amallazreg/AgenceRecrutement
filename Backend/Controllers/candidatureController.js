const Candidature = require('../Models/candidatureModel');
const Offer = require('../Models/offreModel');
const User = require('../Models/userModel');

const applyOffer = async (req, res) => {
  try {
    const { offerId, candidateId } = req.params;

    // Vérifier que l'offre existe
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: "Offre non trouvée" });

    // Vérifier que le candidat existe
    const candidate = await User.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidat non trouvé" });

    // Fichiers uploadés
    const cv = req.files?.cv ? req.files.cv[0].filename : undefined;
    const motivationLetter = req.files?.motivationLetter ? req.files.motivationLetter[0].filename : undefined;
    const additionalDocuments = req.files?.additionalDocuments
      ? req.files.additionalDocuments.map(file => file.filename)
      : [];

    // Créer la candidature
    const candidature = new Candidature({
      candidateId,
      offerId,
      cv,
      motivationLetter,
      additionalDocuments
    });

    await candidature.save();

    res.status(201).json({
      message: "Candidature envoyée avec succès",
      candidature
    });
  } catch (error) {
    console.error("Erreur lors de la candidature :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};



const getCandidatureForOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    // Vérifier que l'offre existe
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: "Offre non trouvée" });

    // Récupérer les candidatures
    const candidature = await Candidature.find({ offerId })
      .populate('candidateId', 'name email phone skills education experiences languages certifications linkedin github'); 
      // <-- ici on choisit uniquement les champs que la company peut voir

    // Transformer en DTO pour sécuriser la réponse
    const candidatureDTO = candidature.map(app => ({
      _id: app._id,
      candidateId: app.candidateId._id,
      candidateName: app.candidateId.name,
      candidateEmail: app.candidateId.email,
      phone: app.candidateId.phone,
      skills: app.candidateId.skills,
      education: app.candidateId.education,
      experiences: app.candidateId.experiences,
      projects: app.candidateId.projects,
      languages: app.candidateId.languages,
      certifications: app.candidateId.certifications,
      linkedin: app.candidateId.linkedin,
      github: app.candidateId.github,
      motivationLetter: app.motivationLetter,
      additionalDocuments: app.additionalDocuments,
      status: app.status,
      submittedAt: app.submittedAt
    }));

    res.status(200).json({ offerId, candidature: candidatureDTO });

  } catch (error) {
    console.error('Erreur récupération candidatures :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

const getMyCandidature = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidatures = await Candidature.find({ candidateId })
      .populate('offerId', 'title companyId description sector location contractType startOffreDate endOffreDate workingHours remoteOption')
      .sort({ submittedAt: -1 });

    res.status(200).json(candidatures);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des candidatures", error });
  }
};

const updateCandidatureStatus = async (req, res) => {
  try {
    const { candidatureId } = req.params;
    const { status } = req.body; // "Accepté" ou "Refusé"

    if (!['Accepté', 'Refusé'].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const updatedCandidature = await Candidature.findByIdAndUpdate(
      candidatureId,
      { status },
      { new: true }
    ).populate('candidateId', 'name email phone')
     .populate('offerId', 'title');

    if (!updatedCandidature) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    res.status(200).json({
      message: `Statut mis à jour avec succès en '${status}'`,
      candidature: updatedCandidature
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut", error });
  }
};

const getCountCandidatureForOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    // Vérifier que l'offre existe
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: "Offre non trouvée" });

    // Compter le nombre de candidatures
    const count = await Candidature.countDocuments({ offerId });

    res.status(200).json({ offerId, candidatureCount: count });
  } catch (error) {
    console.error('Erreur lors du comptage des candidatures :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
const deleteCandidature = async (req, res) => {
  try {
    const { candidatureId } = req.params;

    const deletedCandidature = await Candidature.findByIdAndDelete(candidatureId);

    if (!deletedCandidature) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    res.status(200).json({
      message: "Candidature supprimée avec succès",
      candidature: deletedCandidature
    });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


module.exports = {
    applyOffer,
    getCandidatureForOffer,
    getMyCandidature,
    updateCandidatureStatus,
    getCountCandidatureForOffer,
    deleteCandidature
}