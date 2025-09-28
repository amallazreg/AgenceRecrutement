// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./Routes/userRoute');
const companyRoute = require('./Routes/companyRoute');



// Création de l'application Express
const app = express();

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:4200', // Autorise uniquement les requêtes venant de cette origine
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

// Middleware pour traiter les données JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/agenceDeRecrutement')
  .then(() => {
    console.log('Connexion à la base de données réussie');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données:', error);
  });
// Définition d’une route de test
app.get('/', (req, res) => {
  res.send('Recrutement API is running!');
});

app.use('/user', userRoute); 
app.use('',companyRoute);


// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Serveur en cours d'exécution sur http://localhost:${port}`);
});
