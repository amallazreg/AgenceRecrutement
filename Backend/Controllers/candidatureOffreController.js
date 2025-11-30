const axios = require("axios");
const User = require("../Models/userModel");
const Offre = require("../Models/offreModel");
const { calculateSimilarity } = require("../utils/similarity");


// 🔵 Construire le texte profil candidat
function buildCandidateProfile(c) {
  return `
    Skills: ${c.skills?.join(", ")};
    Experiences: ${c.experiences?.join(", ")};
    Education: ${c.education};
    Projects: ${c.projects?.join(", ")};
    Languages: ${c.languages?.join(", ")};
    Certifications: ${c.certifications?.join(", ")};
  `;
}
const recommendOffers = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;

    // 1) Récupérer candidat
    const candidate = await User.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }

    const candidateSpecialty = candidate.specialty || "";
    const candidateSkills = (candidate.skills || []).join(" ");

    // 2) Récupérer toutes les offres
    const offers = await Offre.find();

    // 3) Filtrer uniquement les offres avec secteur ≈ spécialité
    const filteredOffers = offers.filter((offer) => {
      const similaritySector = calculateSimilarity(candidateSpecialty, offer.sector);
      return similaritySector >= 0.3; // seuil
    });

    // 4) Calculer matchingScore basé sur skills vs title+description
    const scoredOffers = filteredOffers
      .map((offer) => {
        const combinedOfferText = `${offer.title} ${offer.description}`;

        const score = calculateSimilarity(candidateSkills, combinedOfferText);

        return {
          ...offer._doc,
          matchingScore: score,
        };
      })
      .sort((a, b) => b.matchingScore - a.matchingScore);

    res.json({
      candidate: {
        specialty: candidateSpecialty,
        skills: candidateSkills,
      },
      recommendations: scoredOffers,
    });
  } catch (error) {
    console.error("Erreur recommandation :", error);
    res.status(500).json({ error: "Error calculating recommendations" });
  }
};

module.exports = {
  recommendOffers
};
