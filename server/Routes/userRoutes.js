const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { auth } = require('../Middleware/auth');

//User Routes & Controllers Initialize
router.post('/register', userController.register);

router.post('/signin', userController.signin);

router.post('/create-playlist', auth, userController.createPlaylist);

router.get('/get-playlists', auth, userController.getPlaylists);

router.delete('/delete-playlist', auth, userController.deletePlaylist);

router.post('/logout', auth, userController.signout);

module.exports = router;
