const User = require('../Models/userModel');
const Company = require('../Models/companyModel') ;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const secret = process.env.JWT_SECRET;



const signupController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, role } = req.body;

    console.log('Received signup request with:', { name, email, phone, role });

    // Vérification des champs obligatoires
    if (!name || !email || !password || !confirmPassword || !phone) {
      console.log('Missing fields');
      return res.status(400).json({ message: 'Ensure name, email, password, and confirmPassword are provided' });
    }

    // Vérifier que le mot de passe et la confirmation correspondent
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return res.status(400).json({ message: 'Password and confirmPassword must match' });
    }

    // Vérifier s'il existe déjà un utilisateur admin
    const adminUser = await User.findOne({ role: 'admin' });

    // Si un utilisateur admin existe déjà, empêcher un deuxième admin
    if (adminUser && role === 'admin') {
      console.log('An admin user already exists. Cannot create another one.');
      return res.status(403).json({ message: 'An admin user already exists. Only users and agencies can be created now.' });
    }

    // Vérifier si l'email ou le name existe déjà
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      console.log('name or email already exists');
      return res.status(400).json({ message: 'name or email already exists!' });
    }

    // Définir le rôle automatiquement :
    let userRole;
    if (!adminUser) {
      userRole = 'admin'; // ✅ le premier compte créé devient admin
    } else {
      userRole = role || 'user'; // ✅ tous les autres comptes sont user par défaut
    }

    // Créer un nouvel utilisateur
    const user = new User({ name, email, password, phone, role: userRole });

    const savedUser = await user.save();
    console.log('User saved:', savedUser);

    res.status(201).json({ message: 'User created successfully', user: savedUser });

  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ message: 'An error occurred while creating the user' });
  }
};



const signinController = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ success: false, message: "Nom et mot de passe requis" });
    }

    // =============================
    // 1️⃣ Rechercher dans la collection User
    // =============================
    let account = await User.findOne({ name }).select("email name password role _id profileStatus").exec();
    let accountType = "user";

    // Si pas trouvé, rechercher dans Company
    if (!account) {
      account = await Company.findOne({ name }).select("name password role _id").exec();
      accountType = "company";
    }

    // Si toujours pas trouvé → erreur
    if (!account) {
      return res.status(401).json({ success: false, message: "Utilisateur ou entreprise non trouvé(e)" });
    }

    // =============================
    // 2️⃣ Vérifier le mot de passe
    // =============================
    const validPassword =
      accountType === "user"
        ? await account.comparePassword(password)
        : await bcrypt.compare(password, account.password);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }

    // =============================
    // 3️⃣ Générer le token JWT
    // =============================
    const secret = process.env.JWT_SECRET || process.env.SECRET_KEY;
    if (!secret) {
      throw new Error("Le secret JWT n'est pas défini dans les variables d'environnement");
    }

    const token = jwt.sign(
      { id: account._id, name: account.name, role: account.role },
      secret,
      { expiresIn: "24h" }
    );

    // =============================
    // 4️⃣ Réponse selon le rôle
    // =============================
    if (account.role === "admin") {
      return res.json({ success: true, message: "Admin authentifié", token, role: "admin" });
    } else if (accountType === "company" || account.role === "company") {
      return res.json({ success: true, message: "Company authentifiée", token, role: "company" });
    } else {
      return res.json({
        success: true,
        message: "User authentifié",
        token,
        role: "user",
        userId: account._id,
        name: account.name,
        profileStatus: account.profileStatus,
      });
    }
  } catch (err) {
    console.error("Erreur dans signinController fusionné:", err);
    res.status(500).send(`Erreur lors de l'authentification : ${err.message}`);
  }
};



// 🔹 Mise à jour du profil candidat
const updateProfile = async (req, res) => {
  try {
    const { _id } = req.params;
    const {
      name,
      phone,
      dateOfBirth,
      address,
      nationality,
      gender,
      specialty,
      subSpecialties,
      education,
      experiences,
      projects,
      skills,
      languages,
      certifications,
      linkedin,
      github,
      portfolio,
    } = req.body;

    // 🔹 Si l'utilisateur a uploadé des fichiers (CV, lettre de motivation)
    const cv = req.files?.cv ? req.files.cv[0].filename : undefined;
    const motivationLetter = req.files?.motivationLetter ? req.files.motivationLetter[0].filename : undefined;

    // 🔹 Construire un objet de mise à jour dynamique
    const updateData = {
      name,
      phone,
      dateOfBirth,
      address,
      nationality,
      gender,
      specialty,
      subSpecialties: Array.isArray(subSpecialties) ? subSpecialties : subSpecialties?.split(','),
      linkedin,
      github,
      portfolio,
      cv,
      motivationLetter,
    };

    // Ajouter les tableaux si présents
    if (education) updateData.education = JSON.parse(education);
    if (experiences) updateData.experiences = JSON.parse(experiences);
    if (projects) updateData.projects = JSON.parse(projects);
    if (skills) updateData.skills = Array.isArray(skills) ? skills : skills?.split(',');
    if (languages) updateData.languages = JSON.parse(languages);
    if (certifications) updateData.certifications = JSON.parse(certifications);

    // 🔹 Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // 🔹 Vérifier si tous les champs importants sont remplis → profil complet
    const requiredFields = [
      updatedUser.name,
      updatedUser.phone,
      updatedUser.address,
      updatedUser.specialty,
      updatedUser.skills?.length,
      updatedUser.education?.length,
      updatedUser.experiences?.length,
      updatedUser.cv,
    ];

    const isComplete = requiredFields.every(field => field && field !== '' && field !== null);

    updatedUser.profileStatus = isComplete ? 'Complet' : 'Incomplet';
    await updatedUser.save();

    res.status(200).json({
      message: 'Profil mis à jour avec succès',
      profileStatus: updatedUser.profileStatus,
      updatedUser,
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


module.exports = {
    signupController,
    signinController,
    updateProfile
   
};
