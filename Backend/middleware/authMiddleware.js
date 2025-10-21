const jwt = require('jsonwebtoken');

const authenticateCompany = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attache l'ID de l'agence à la requête
    req.comapnyId = decoded._id;
    
    next(); // Passe au middleware suivant ou à la route
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = authenticateCompany;
