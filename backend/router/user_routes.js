const express = require('express');
const UsersFuctions = require('../controller/user_controller');
console.log(UsersFuctions);
const router = express.Router();
router.post('/updateCredentials', UsersFuctions.updateCredentials);
router.post('/updatePassword', UsersFuctions.updatePassword);
router.post('/createUser', UsersFuctions.createUser);
router.get('/login', UsersFuctions.login);
module.exports = router;