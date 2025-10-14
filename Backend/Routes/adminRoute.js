
const express = require('express');
const router = express.Router();
const { getAllUser,getAllCompany, deleteCompany, deleteUser,getUserCount, getCompanyCount} = require('../Controllers/adminController');


router.get('/getAllCompany',getAllCompany);
router.get('/getAllUser',getAllUser);
router.delete('/deleteCompany/:_id', deleteCompany);
router.delete('/deleteUser/:_id', deleteUser);

router.get('/getUserCount',getUserCount);

router.get('/getCompanyCount',getCompanyCount);



module.exports = router;