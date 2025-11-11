const mongoose = require('mongoose');

const candidatureSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true
  },
  // Données supplémentaires que le candidat peut remplir
  cv: { type: String,required: true },
  motivationLetter: { type: String,required: true },
  additionalDocuments: [{ type: String }], //certificats, etc.
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['En attente', 'Accepté', 'Refusé'], default: 'En attente' }
});

module.exports = mongoose.model('Condidature', candidatureSchema);
