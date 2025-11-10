
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 
const { signupController, signinController,updateProfile} = require('../Controllers/userController');

router.post('/signup', signupController);
router.post('/signin', signinController);
router.put('/update/:_id', upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'motivationLetter', maxCount: 1 },
]), updateProfile);




module.exports = router;