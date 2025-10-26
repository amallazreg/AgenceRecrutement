// models/Offer.js
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  sector: { type: String, required: true }, // rempli automatiquement depuis la company
  title: { type: String, required: true },
  description: { type: String, required: true },

  // Général
  requiredSkills: [{ type: String }],
  experienceLevel: { type: String, enum: ['Junior','Intermediate','Senior'], default: 'Junior' },
  contractType: { type: String, enum: ['CDI','CDD','Stage','Freelance','Alternance'], default: 'CDI' },
  location: { type: String },
  salaryRange: { type: String },
  startOffreDate: { type: Date },
  endOffreDate: { type: Date },
  workingHours: { type: String },
  remoteOption: { type: String, enum: ['Oui','Non','Hybride'], default: 'Non' },
  createdAt: { type: Date, default: Date.now } ,

  // Champs spécifiques - Informatique 
  programmingLanguages: [{ type: String }],
  frameworks: [{ type: String }],
  databaseKnowledge: [{ type: String }],
  tools: [{ type: String }],
  projectType: { type: String },
  methodology: [{ type: String }], // Agile, Scrum ...

  // Champs spécifiques - Marketing
  marketingChannels: [{ type: String }],
  campaignTools: [{ type: String }],
  targetAudience: [{ type: String }],
  kpiFocus: [{ type: String }],

  // Champs spécifiques - Finance
  financialTools: [{ type: String }],
  areaOfExpertise: [{ type: String }],
  certifications: [{ type: String }],
  reportingFrequency: [{ type: String }],

  // Champs spécifiques - Health (Santé)
  requiredDiploma: [{ type: String }],
  medicalSpecialty: [{ type: String }],
  workSchedule: [{ type: String }],
  licenseNumber: [{ type: String }],

  // Champs spécifiques - Education
  teachingLevel: [{ type: String }],
  subjectTaught: [{ type: String }],
  requiredDegree:[ { type: String }],
  classSize: { type: Number },

  // Champs spécifiques - Commerce
  salesType: [{ type: String }],
  productType: [{ type: String }],
  salesTarget: [{ type: String }],
  customerManagementTools: [{ type: String }],
  mobilityRequired: { type: Boolean, default: false },

  // Champs spécifiques - Industry
  machineOperation: [{ type: String }],
  safetyCertifications: [{ type: String }],
  shiftType: { type: String },
  productionEnvironment: { type: String },
  qualityControl: { type: String },

  status: { type: String, enum: ['Publié','Brouillon','Archivé'], default: 'Publié' },
  views: { type: Number, default: 0 }
},
{ timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
