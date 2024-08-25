const express = require('express');
const router = express.Router();
const indexController = require('../Controllers/indexController');

//Index Routes & Controllers Initialize
router.get('/', indexController.index);

router.get('/verify-token', indexController.verifyToken);

module.exports = router;