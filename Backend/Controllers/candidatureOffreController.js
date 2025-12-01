const User = require("../Models/userModel");
const Offre = require("../Models/offreModel");
const { embedText } = require("../utils/ai");
const { buildCandidateText } = require("../utils/candidateText");

// Similarité cosinus
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, v, i) => sum + v * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(vecB.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
}

function extractSectorFields(offer) {
  return {
    technologie: [
      ...offer.programmingLanguages,
      ...offer.frameworks,
      ...offer.databaseKnowledge,
      ...offer.tools,
      offer.projectType,
      ...(offer.methodology || [])
    ].join(" "),

    marketing: [
      ...offer.marketingChannels,
      ...offer.campaignTools,
      ...offer.targetAudience,
      ...offer.kpiFocus
    ].join(" "),

    finance: [
      ...offer.financialTools,
      ...offer.areaOfExpertise,
      ...offer.certifications,
      ...offer.reportingFrequency
    ].join(" "),

    health: [
      ...offer.requiredDiploma,
      ...offer.medicalSpecialty,
      ...offer.workSchedule,
      ...offer.licenseNumber
    ].join(" "),

    education: [
      ...offer.teachingLevel,
      ...offer.subjectTaught,
      ...offer.requiredDegree,
      offer.classSize
    ].join(" "),

    commerce: [
      ...offer.salesType,
      ...offer.productType,
      ...offer.salesTarget,
      ...offer.customerManagementTools,
      offer.mobilityRequired ? "mobility required" : ""
    ].join(" "),

    industry: [
      ...offer.machineOperation,
      ...offer.safetyCertifications,
      offer.shiftType,
      offer.productionEnvironment,
      offer.qualityControl
    ].join(" "),
  };
}

const recommendOffers = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;

    const candidate = await User.findById(candidateId);
    if (!candidate)
      return res.status(404).json({ message: "Candidat non trouvé" });

    // ✅ AJOUT : Filtrer les offres selon la spécialité
    const candidateSpecialty = candidate.specialty?.toLowerCase() || "";

    let offers = [];

    if (candidateSpecialty === "technologie") {
      offers = await Offre.find({ sector: /technologie/i });
    } else {
      offers = await Offre.find(); // pas de filtre
    }

    // Embedding du candidat
    const candidateText = buildCandidateText(candidate);
    const candidateVec = await embedText(candidateText);

    const results = [];

    for (const offer of offers) {
      const sectorKey = offer.sector.toLowerCase();
      const sectorFields = extractSectorFields(offer)[sectorKey] || "";

      const offerText = `
        ${offer.title}
        ${offer.description}
        ${sectorFields}
      `;

      const offerVec = await embedText(offerText);
      const score = cosineSimilarity(candidateVec, offerVec);

      results.push({
        ...offer._doc,
        matchingScore: Math.round(score * 100) // %
      });
    }

    res.json({
      candidate: candidateId,
      recommendations: results.sort((a, b) => b.matchingScore - a.matchingScore)
    });

  } catch (error) {
    console.error("AI Matching Error:", error);
    res.status(500).json({ error: "Erreur matching AI" });
  }
};

module.exports = { recommendOffers };
