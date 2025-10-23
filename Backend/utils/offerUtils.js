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
    'startDate', 'applicationDeadline', 'workingHours', 'remoteOption', 
    'status', 'createdAt', 'updatedAt'
  ];

  const allowedFields = [...generalFields, ...(fieldsBySector[offerData.sector] || [])];

  // Ne garder que les champs autorisés
  const cleanedData = {};
  allowedFields.forEach(field => {
    if (offerData[field] !== undefined) cleanedData[field] = offerData[field];
  });

  return cleanedData;
}
module.exports = { cleanOfferData };
