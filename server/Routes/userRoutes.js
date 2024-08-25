const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

//User Routes & Controllers Initialize
router.post('/register', userController.register);

router.post('/signin', userController.signin);

module.exports = router;
