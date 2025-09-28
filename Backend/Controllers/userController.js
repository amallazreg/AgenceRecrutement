const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;


const signupController = async (req, res) => {
    try {
        const { username, email, password, confirmPassword,phone, role } = req.body;

        console.log('Received signup request with:', { username, email,phone, role });

        if (!username || !email  || !password || !confirmPassword || !phone) {
            console.log('Missing fields');
            return res.status(400).json({ message: 'Ensure username, email, password, and confirmPassword are provided' });
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

        // Vérifier si l'email ou le username existe déjà
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            console.log('Username or email already exists');
            return res.status(400).json({ message: 'Username or email already exists!' });
        }

        let userRole;
        if (!adminUser) {
            userRole = 'admin';
        } else {
            if (role === 'user') {
                userRole = 'user';
            } 
            if (role === 'agence') {
                userRole = 'agence';
            } 
        }

        // Créer un nouvel utilisateur
        const user = new User({ username, email, password,phone,role: userRole });

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
        const { username, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ username }).select('email username password role _id').exec();
        if (!user) {
            return res.status(401).json({ success: false, message: 'Could not authenticate user' });
        }

        // Vérifier le mot de passe avec bcrypt
        const validPassword = await user.comparePassword(password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Could not authenticate password' });
        }

        // Récupérer le secret depuis les variables d'environnement
        const secret = process.env.SECRET_KEY;
        if (!secret) {
            throw new Error("Le secret JWT n'est pas défini dans les variables d'environnement");
        }

        // Générer le token avec l'ID de l'utilisateur
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            secret,
            { expiresIn: '24h' }
        );

        // Réponse en fonction du rôle
        if (user.role === 'admin') {
            return res.json({ success: true, message: 'Admin authenticated', token, role: 'admin' });
        } else if (user.role === 'agence') {
            return res.json({ success: true, message: 'Agence authenticated', token, role: 'agence' });
        } else {
            return res.json({ success: true, message: 'User authenticated', token,username, role: 'user',userId:user._id });
        }

    } catch (err) {
        console.error('Error in signinController:', err);
        res.status(500).send(`An error occurred while authenticating the user: ${err.message}`);
    }
};




module.exports = {
    signupController,
    signinController
   
};
