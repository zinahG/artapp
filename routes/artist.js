const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const artistController = require('../controllers/artist');
const isAuth = require('../middleware/is-auth');
const isArtist = require('../middleware/is-artist');

const router = express.Router();

// /artist/add-artwork => GET
router.get('/add-artwork', isAuth, isArtist, artistController.getAddArtwork);

// /artist/artworks => GET
router.get('/artworks', isAuth, artistController.getArtworks);

// /artist/add-artwork => POST
router.post(
  '/add-artwork',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  isArtist,
  artistController.postAddArtwork
);

router.get('/edit-artwork/:artworkId', isAuth, artistController.getEditArtwork);

router.post(
  '/edit-artwork',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  artistController.postEditArtwork
);

router.delete('/artwork/:artworkId', isAuth, artistController.deleteArtwork);

module.exports = router;





