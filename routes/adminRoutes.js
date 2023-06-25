const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isAdmin= require('../middleware/is-admin');

const router = express.Router();

router.get('/artworks', isAuth,isAdmin, adminController.getArtworks);

router.post('/delete-artwork', adminController.postDeleteArtwork);

module.exports = router;


  