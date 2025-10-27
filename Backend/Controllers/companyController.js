const Company = require('../Models/companyModel');
const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;


const signupController = async (req, res) => {
    try {
        const { name, sector, companyDescription, fullAddress, phoneNumber, email, website, hrManage, managerEmail, password, confirmPassword } = req.body;

        if (!name || !sector || !companyDescription || !fullAddress || !phoneNumber || !website || !email || !hrManage || !managerEmail || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Assurez-vous que les champs uniques ne sont pas vides
        if (!name.trim() || !email.trim() || !website.trim()) {
            return res.status(400).json({ message: 'name, Email et website ne peuvent pas être vides' });
        }

        const existingCompany = await Company.findOne({ $or: [{ name }, { email }, { website }] });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company with the same name, email, or website already exists' });
        }

        const company = new Company({ name, sector, companyDescription, fullAddress, phoneNumber, email, website, hrManage, managerEmail, password, confirmPassword, role: 'company' });

        const savedCompany = await company.save();
        res.status(201).json({ message: 'Company created successfully', company: savedCompany });

    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json({ message: 'An error occurred while creating the company' });
    }
};


const signinController = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Vérifier si l'agence existe
        const company = await Company.findOne({ name }).select('name password role _id sector').exec();
        if (!company) {
            return res.status(401).json({ success: false, message: "Company non trouvée" });
        }

        // Vérifier le mot de passe avec bcrypt
        const validPassword = await bcrypt.compare(password, company.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
        }

        // Récupérer le secret depuis les variables d'environnement
        const secret = process.env.SECRET_KEY;
        if (!secret) {
            throw new Error("Le secret JWT n'est pas défini dans les variables d'environnement");
        }

        // Générer le token avec l'ID de l'agence
        const token = jwt.sign(
            { id: company._id, name: company.name, role: company.role,sector:company.sector },
            secret,
            { expiresIn: "24h" }
        );

        // Réponse
        res.json({ success: true, message: "Company authentifiée", token, role: company.role,sector:company.sector });

    } catch (err) {
        console.error("Erreur dans signinController:", err);
        res.status(500).send(`Erreur lors de l'authentification : ${err.message}`);
    }
};


module.exports = {
    signupController,
    signinController
};
