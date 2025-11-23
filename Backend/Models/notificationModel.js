const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  candidatureId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidature", required: true },

  message: { type: String, required: true },
  status: { type: String, enum: ["Accepté", "Refusé"], required: true },

  read: { type: Boolean, default: false }, // Pour savoir si le candidat l’a consultée

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
