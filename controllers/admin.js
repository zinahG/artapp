const mongoose = require('mongoose');
const fileHelper = require('../util/file');
const Artwork = require('../models/artwork');
const Artist = require('../models/artist');
const ITEMS_PER_PAGE = 2;

exports.getArtworks = (req, res, next) => {
  Artwork.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(artworks => {
      console.log(artworks);
      res.render('admin/artworks', {
        artworks: artworks,
        pageTitle: 'Artworks',
        path: '/admin/artworks'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteArtwork = (req, res, next) => {
  const artworkId = req.body.artworkId;
  Artwork.findByIdAndRemove(artworkId)
    .then(() => {
      console.log('DESTROYED Artwork');
      res.redirect('/artworks');
    })
    .catch(err => console.log(err));
};