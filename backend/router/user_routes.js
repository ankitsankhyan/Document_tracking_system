const express = require('express');
const UsersFuctions = require('../controller/user_controller');
const {verifyToken} = require('../middleware/user');
const {protect} = require('../middleware/authenticaion');
const {uploadImage} = require('../middleware/multer');
const router = express.Router();


// ####################routes####################


router.post('/updateCredentials',protect, UsersFuctions.updateCredentials);
router.post('/updatePassword', UsersFuctions.updatePassword);
router.post('/createUser',uploadImage.single('avatar'), UsersFuctions.createUser);
router.post('/login', UsersFuctions.login);
router.post('/generateKeys',protect, UsersFuctions.generatePublicKey);
router.get('/profile', UsersFuctions.getProfile);
router.get('/resetLink', UsersFuctions.generatelink);
router.get('/verifyLink',verifyToken, UsersFuctions.verifyLink);
router.post('/resetPassword', verifyToken, UsersFuctions.resetPassword)
router.patch('/changePassword',protect, UsersFuctions.changePassword);
module.exports = router;