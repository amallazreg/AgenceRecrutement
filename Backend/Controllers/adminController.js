const Company = require('../Models/companyModel');
const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;



const getAllUser = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }); // Filtrer par rôle "user"
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la récupération des utilisateurs");
    }
};


const getAllCompany = async (req, res) => {
    try {
        const company = await Company.find({ role: "company" }); 
        res.json(company);
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la récupération des socités");
    }
};


const deleteCompany = async (req, res) => {
    try {
        await Company.findOneAndDelete({ _id: req.params._id });
        res.status(200).send({message : ' company deleted successfully'});
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la suppression de la socité");
    }
};


const deleteUser = async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.params._id });
        res.status(200).send({message : ' User deleted successfully'});
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la suppression de user");
    }
};

const getUserCount = async (req, res) => {
    try {
      const count = await User.countDocuments();
      res.status(200).json({ totalUser: count-1});
    } catch (error) {
      console.error("Erreur lors du comptage des users:", error);
      res.status(500).json({ message: "Erreur lors du comptage des users" });
    }
  };

  const getCompanyCount = async (req, res) => {
    try {
      const count = await Company.countDocuments();
      res.status(200).json({ totalCompany: count });
    } catch (error) {
      console.error("Erreur lors du comptage des company:", error);
      res.status(500).json({ message: "Erreur lors du comptage des company" });
    }
  };


  module.exports = {
    getAllUser,
    getAllCompany,
    deleteCompany,
    deleteUser,
    getUserCount,
    getCompanyCount
  }