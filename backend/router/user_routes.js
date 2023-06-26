const express = require('express');
const UsersFuctions = require('../controller/user_controller');

const {protect} = require('../middleware/authenticaion');
const router = express.Router();


// ####################routes####################


router.post('/updateCredentials',protect, UsersFuctions.updateCredentials);
router.post('/updatePassword', UsersFuctions.updatePassword);
router.post('/createUser', UsersFuctions.createUser);
router.post('/login', UsersFuctions.login);
router.get('/generateKeys',protect, UsersFuctions.generatePublicKey);
router.get('/profile', UsersFuctions.getProfile);


module.exports = router;