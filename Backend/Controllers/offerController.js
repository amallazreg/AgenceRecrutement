// controllers/offerController.js
const Offer = require('../Models/offreModel');
const Company = require('../Models/companyModel');

// Create Offer
const createOffer = async (req, res) => {
  try {
    const companyId = req.company._id; // fourni par verifyToken
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    // Construire l'objet en prenant req.body (ne pas faire confiance aveuglément au client)
    const data = {
      companyId,
      sector: company.sector,
      title: req.body.title,
      description: req.body.description,
      requiredSkills: req.body.requiredSkills || [],
      experienceLevel: req.body.experienceLevel,
      contractType: req.body.contractType,
      location: req.body.location,
      salaryRange: req.body.salaryRange,
      startDate: req.body.startDate,
      applicationDeadline: req.body.applicationDeadline,
      workingHours: req.body.workingHours,
      remoteOption: req.body.remoteOption,

      // Informatique
      programmingLanguages: req.body.programmingLanguages || [],
      frameworks: req.body.frameworks || [],
      databaseKnowledge: req.body.databaseKnowledge || [],
      tools: req.body.tools || [],
      projectType : req.body.projectType || [],
      methodology: req.body.methodology || [],

      // Marketing
      marketingChannels: req.body.marketingChannels || [],
      campaignTools: req.body.campaignTools ||[],
      targetAudience: req.body.targetAudience || [],
      kpiFocus: req.body.kpiFocus || [],

      // Finance
      financialTools: req.body.financialTools || [],
      areaOfExpertise: req.body.areaOfExpertise || [],
      certifications: req.body.certifications||[],
      reportingFrequency: req.body.reportingFrequency || [],

      // Santé
      requiredDiploma: req.body.requiredDiploma || [],
      medicalSpecialty: req.body.medicalSpecialty || [],
      workSchedule: req.body.workSchedule || [],
      licenseNumber : req.body.licenseNumber || [],

      // Education
      teachingLevel:  req.body.teachingLevel || [],
      subjectTaught: req.body.subjectTaught || [],
      requiredDegree:req.body.requiredDegree || [],
      classSize: req.body.classSize || [],

      // Commerce
      salesType: req.body.salesType || [],
      productType: req.body.productType || [],
      salesTarget: req.body.salesTarget || [],
      customerManagementTools: req.body.customerManagementTools || [],
      mobilityRequired: req.body.mobilityRequired || [],

      //Industry
      machineOperation: req.body.machineOperation || [],
      safetyCertifications: req.body.safetyCertifications || [],
      shiftType: req.body.shiftType || [],
      productionEnvironment: req.body.productionEnvironment || [],
      qualityControl: req.body.qualityControl  || [],
    };

    const offer = new Offer(data);
    await offer.save();

    return res.status(201).json(offer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
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