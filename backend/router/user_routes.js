const express = require('express');
const UsersFuctions = require('../controller/user_controller');
console.log(UsersFuctions);
const router = express.Router();

router.post('/createUser', UsersFuctions.createUser);

module.exports = router;