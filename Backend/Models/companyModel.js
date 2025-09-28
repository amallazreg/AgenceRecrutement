const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Définition du schéma de l'utilisateur
const CompanySchema = new Schema({
    companyName: { type: String, required: true, unique: true, validate: {
        validator: function(v) {
            return v != null && v.trim() !== '';
        },
        message: 'Nom de l\'agence ne peut pas être null ou vide'
    }}, 
    sector: { type: String, required: true},
    companyDescription: { type: String, required: true },
    fullAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return v != null && v.trim() !== '';
            },
            message: 'Email ne peut pas être null ou vide'
        }
    },    
    website: { type: String, required: true ,sparse: true },
    hrManage: { type: String, required: true },
    managerEmail: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['company'], default: 'company' },
});

// Méthode pour comparer le mot de passe hashé
CompanySchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log('Comparing passwords:', { candidatePassword, hashedPassword: this.password, isMatch });
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
};

// Middleware pour hasher le mot de passe avant de sauvegarder
CompanySchema.pre('save', function(next) {
    var agence = this;

    if (!agence.isModified('password')) return next();

    const saltRounds = 10;

    bcrypt.hash(agence.password, saltRounds, function(err, hash) {
        if (err) return next(err);
        agence.password = hash;
        next();
    });
});

module.exports = mongoose.model('Company', CompanySchema);
