const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📂 Dossier où les fichiers seront enregistrés
const uploadDirectory = path.join(__dirname, '../uploads');

// ✅ Création du dossier s'il n'existe pas
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
  console.log('📁 Dossier "uploads" créé automatiquement');
}

// ⚙️ Configuration du stockage Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// ✅ Filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF ou Word sont autorisés !'), false);
  }
};

// 📦 Initialisation du middleware Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  fileFilter: fileFilter,
});

module.exports = upload;
