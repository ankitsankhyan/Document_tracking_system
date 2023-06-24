const express = require('express');
const UsersFuctions = require('../controller/user_controller');

const {protect} = require('../middleware/authenticaion');
const router = express.Router();


// ####################routes####################


router.post('/updateCredentials',protect, UsersFuctions.updateCredentials);
router.post('/updatePassword', UsersFuctions.updatePassword);
router.post('/createUser', UsersFuctions.createUser);
router.get('/login', UsersFuctions.login);
router.get('/generateKeys',protect, UsersFuctions.generatePublicKey);



module.exports = router;