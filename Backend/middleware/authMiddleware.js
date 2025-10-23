const jwt = require('jsonwebtoken');
const Company = require('../Models/companyModel');

const authenticateCompany = async (req, res, next) => {
  try {
    // Récupération du token dans l'en-tête Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Accès refusé, token manquant" });
    }

    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Récupération de la société associée au token
    const company = await Company.findById(decoded.id);
    if (!company) {
      return res.status(404).json({ message: "Société non trouvée" });
    }

    // ✅ Attacher la société entière à la requête (corrige ton erreur)
    req.company = company;

    next(); // Passe au contrôleur suivant
  } catch (err) {
    console.error("Erreur d'authentification :", err.message);
    return res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = authenticateCompany;
