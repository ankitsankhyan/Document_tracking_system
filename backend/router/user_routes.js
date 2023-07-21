const express = require('express');
const UsersFuctions = require('../controller/user_controller');
const {verifyToken} = require('../middleware/user');
const {protect} = require('../middleware/authenticaion');
const {uploadImage} = require('../middleware/multer');
const {redisUserMiddleware} = require('../middleware/caching');
const router = express.Router();


// ####################routes####################


router.post('/updateCredentials',uploadImage.single('avatar'),protect, UsersFuctions.updateCredentials);
router.post('/updatePassword', UsersFuctions.updatePassword);
router.post('/createUser',uploadImage.single('avatar'), UsersFuctions.createUser);
router.post('/login', UsersFuctions.login);
router.post('/generateKeys',protect, UsersFuctions.generatePublicKey);
router.get('/profile:id', UsersFuctions.getProfile);
router.post('/resetLink', UsersFuctions.generatelink);
router.post('/verifyLink',verifyToken, UsersFuctions.verifyLink);
router.post('/resetPassword', verifyToken, UsersFuctions.resetPassword)
router.patch('/changePassword',protect, UsersFuctions.changePassword);
router.get('/search:keyword',protect,redisUserMiddleware, UsersFuctions.searchUser);
router.get('/getusers',protect, UsersFuctions.getUsers);
module.exports = router;