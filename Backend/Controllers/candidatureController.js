const Candidature = require('../Models/candidatureModel');
const Offer = require('../Models/offreModel');
const User = require('../Models/userModel');
const Notification = require('../Models/notificationModel');
const axios = require("axios");
const fs = require("fs");
const extractPdfText = require("../utils/pdfReader");
const pdf = require("pdf-parse-fixed");
const FormData = require("form-data");


const applyOffer = async (req, res) => {
  try {
    const { offerId, candidateId } = req.params;

    // Vérifier que l'offre existe
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: "Offre non trouvée" });

    // Vérifier que le candidat existe
    const candidate = await User.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidat non trouvé" });

    // Vérifier CV
    if (!req.files?.cv)
      return res.status(400).json({ message: "CV obligatoire" });

    // Fichiers importés
    const cvFile = req.files.cv[0];
    const motivationLetter = req.files?.motivationLetter
      ? req.files.motivationLetter[0].filename
      : undefined;

    const additionalDocuments = req.files?.additionalDocuments
      ? req.files.additionalDocuments.map(file => file.filename)
      : [];

    // 1️⃣ LIRE le CV PDF en texte
    const cvPath = cvFile.path;
    const cvBuffer = fs.readFileSync(cvPath);
    const cvData = await pdf(cvBuffer);
    const cvText = cvData.text;

    // 2️⃣ Construire objet OFFER pour Flask
    const offerData = {
      title: offer.title,
      description: offer.description,
      experienceLevel: offer.experienceLevel,
      contractType: offer.contractType,
      location: offer.location,
      workingHours: offer.workingHours,
      remoteOption: offer.remoteOption,
      programmingLanguages: offer.programmingLanguages,
      frameworks: offer.frameworks,
      databaseKnowledge: offer.databaseKnowledge,
      tools: offer.tools,
      methodology: offer.methodology
    };

    // 3️⃣ Préparer FORM-DATA vers Flask
    const formData = new FormData();
    formData.append("cv", fs.createReadStream(cvPath));        // PDF
    formData.append("offer", JSON.stringify(offerData));       // Offre JSON

    // 4️⃣ Requête Flask
    const response = await axios.post(
      "http://127.0.0.1:5000/match",
      formData,
      { headers: formData.getHeaders() }
    );

    console.log("FLASK RESPONSE:", response.data); // DEBUG

    const matchScore = response.data?.similarite || 0;
    console.log("MATCH SCORE:", matchScore);       // DEBUG

    // 5️⃣ Sauvegarde candidature
    const candidature = new Candidature({
      candidateId,
      offerId,
      cv: cvFile.filename,
      motivationLetter,
      additionalDocuments,
      matchScore,
      status: "En attente",
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

    // Récupérer les candidatures TRIEES par matchScore DESC
    const candidatures = await Candidature.find({ offerId })
      .sort({ matchScore: -1 })   // 🔥 TRI DU MEILLEUR AU MOINS BON
      .populate(
        "candidateId",
        "name email phone skills education experiences languages certifications linkedin github"
      );

    // Mapper et inclure matchScore
    const candidatureDTO = candidatures.map(app => ({
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
      cv: app.cv,
      motivationLetter: app.motivationLetter,
      additionalDocuments: app.additionalDocuments,

      matchScore: app.matchScore,   // ✅ IMPORTANT

      status: app.status,
      submittedAt: app.submittedAt
    }));

    res.status(200).json({ offerId, candidatures: candidatureDTO });

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

     // 🔔 Création d’une notification interne
    await Notification.create({
      userId: updatedCandidature.candidateId._id,
      candidatureId: updatedCandidature._id,
      status,
      message:
        status === "Accepté"
          ? `🎉 Votre candidature pour l'offre "${updatedCandidature.offerId.title}" a été acceptée.`
          : `❌ Votre candidature pour l'offre "${updatedCandidature.offerId.title}" a été refusée.`
    });

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

// Récupérer les notifications d'un utilisateur
const getNotification =  async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Marquer une notification comme lue
const notificationLue =  async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.status(200).json(notif);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const getAllCandidatureForCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Récupérer toutes les offres de la company
    const offers = await Offer.find({ companyId });
    if (!offers.length) return res.status(404).json({ message: "Aucune offre trouvée pour cette entreprise" });

    const offerIds = offers.map(offer => offer._id);

    // 🔥 Récupérer candidatures triées par matchScore DESC
    const candidatures = await Candidature.find({ offerId: { $in: offerIds } })
      .sort({ matchScore: -1 })   // <-- TRI DU MEILLEUR AU MOINS BON
      .populate('candidateId', 'name email phone skills education experiences languages certifications linkedin github')
      .populate('offerId', 'title description');

    const candidatureDTO = candidatures.map(app => ({
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
      cv: app.cv,
      motivationLetter: app.motivationLetter,
      additionalDocuments: app.additionalDocuments,

      matchScore: app.matchScore,  // <-- INCLUS DANS LE DTO

      status: app.status,
      submittedAt: app.submittedAt,
      offerTitle: app.offerId.title,
      offerDescription: app.offerId.description
    }));

    res.status(200).json({ companyId, candidatures: candidatureDTO });

  } catch (error) {
    console.error('Erreur récupération candidatures pour l’entreprise :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

module.exports = {
    applyOffer,
    getCandidatureForOffer,
    getMyCandidature,
    updateCandidatureStatus,
    getCountCandidatureForOffer,
    deleteCandidature,
    getNotification,
    notificationLue,
    getAllCandidatureForCompany
}