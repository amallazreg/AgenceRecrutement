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

    const candidateSpecialty = candidate.specialty?.toLowerCase() || "";

    // ✅ Ajouter populate pour companyId
    let offers = [];
    if (candidateSpecialty === "technologie") {
      offers = await Offre.find({ sector: /technologie/i }).populate('companyId', 'name');
    } else {
      offers = await Offre.find().populate('companyId', 'name');
    }

    const candidateText = buildCandidateText(candidate);
    const candidateVec = await embedText(candidateText);

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const today = new Date();
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());

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

      // Calcul daysRemaining
      let daysRemaining = null;
      let statusInfo = "Date de fin non définie";
      if (offer.endOffreDate) {
        const endDate = new Date(offer.endOffreDate);
        const diffMs = endDate.getTime() - todayZero.getTime();
        daysRemaining = Math.floor(diffMs / MS_PER_DAY) + 1;
        if (daysRemaining > 0) statusInfo = `Expire dans ${daysRemaining} jour(s)`;
        else if (daysRemaining === 0) statusInfo = "Expire aujourd'hui";
        else statusInfo = `Expirée depuis ${Math.abs(daysRemaining)} jour(s)`;

        // Archive si expirée
        if (daysRemaining <= 0 && offer.status !== 'Archivé') {
          offer.status = 'Archivé';
          try { await offer.save(); } catch (err) { console.error(err); }
        }
      }

      results.push({
        ...offer._doc,
        matchingScore: Math.round(score * 100),
        companyName: offer.companyId?.name || "Entreprise inconnue",
        daysRemaining,
        statusInfo
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
