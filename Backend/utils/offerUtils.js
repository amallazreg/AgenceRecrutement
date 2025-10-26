function cleanOfferData(offerData) {
  const fieldsBySector = {
    Technologie: ['programmingLanguages','frameworks','databaseKnowledge','tools','projectType','methodology'],
    Marketing: ['marketingChannels','campaignTools','targetAudience','kpiFocus'],
    Finance: ['financialTools','areaOfExpertise','certifications','reportingFrequency'],
    Santé: ['requiredDiploma','medicalSpecialty','workSchedule','licenseNumber'],
    Éducation: ['teachingLevel','subjectTaught','requiredDegree','classSize'],
    Commerce: ['salesType','productType','salesTarget','customerManagementTools','mobilityRequired'],
    Industrie: ['machineOperation','safetyCertifications','shiftType','productionEnvironment','qualityControl']
  };

  const generalFields = [
    'companyId', 'sector', 'title', 'description', 'requiredSkills', 
    'experienceLevel', 'contractType', 'location', 'salaryRange', 
    'startOffreDate', 'endOffreDate', 'workingHours', 'remoteOption', 
    'status', 'createdAt', 'updatedAt','views'
  ];

  const allowedFields = [...generalFields, ...(fieldsBySector[offerData.sector] || [])];

  // Ne garder que les champs autorisés
  const cleanedData = {};
  allowedFields.forEach(field => {
    if (offerData[field] !== undefined) cleanedData[field] = offerData[field];
  });

  return cleanedData;
}

// utils/offerUtils.js

function cleanOfferDataForUpdate(offer, updateData) {
  const fieldsBySector = {
    Technologie: [
      'programmingLanguages', 'frameworks', 'databaseKnowledge',
      'tools', 'projectType', 'methodology'
    ],
    Marketing: [
      'marketingChannels', 'campaignTools', 'targetAudience', 'kpiFocus'
    ],
    Finance: [
      'financialTools', 'areaOfExpertise', 'certifications', 'reportingFrequency'
    ],
    Santé: [
      'requiredDiploma', 'medicalSpecialty', 'workSchedule', 'licenseNumber'
    ],
    Éducation: [
      'teachingLevel', 'subjectTaught', 'requiredDegree', 'classSize'
    ],
    Commerce: [
      'salesType', 'productType', 'salesTarget', 'customerManagementTools', 'mobilityRequired'
    ],
    Industrie: [
      'machineOperation', 'safetyCertifications', 'shiftType',
      'productionEnvironment', 'qualityControl'
    ]
  };

  // Champs généraux qu'on garde toujours
  const generalFields = [
    'title', 'description', 'requiredSkills', 'experienceLevel', 'contractType',
    'location', 'salaryRange', 'startOffreDate', 'endOffreDate',
    'workingHours', 'remoteOption', 'status','views'
  ];

  // Les champs autorisés sont ceux du secteur de l’offre + les champs généraux
  const allowedFields = [...generalFields, ...(fieldsBySector[offer.sector] || [])];

  const cleanedData = {};
  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      cleanedData[key] = updateData[key];
    }
  });

  return cleanedData;
}




module.exports = { 
    cleanOfferData,
    cleanOfferDataForUpdate
 };
