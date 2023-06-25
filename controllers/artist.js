const mongoose = require('mongoose');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator/check');
const Artwork = require('../models/artwork');

exports.getAddArtwork = (req, res, next) => {
  const isArtist = req.session.artist

  res.render('artist/edit-artwork', {
    pageTitle: 'Add Artwork',
    path: '/artist/add-artwork',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    isArtist: isArtist,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddArtwork = (req, res, next) => {
  const isArtist = req.session.artist;
  const artistName = req.body.artistName;
  const quantity = req.body.quantity;
  const email = req.body.email;
  const phone = req.body.phone;
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render('artist/edit-artwork', {
      pageTitle: 'Add Artwork',
      path: '/artist/add-artwork',
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      isArtist: isArtist,
      hasError: true,
      artwork: {
        title: title,
        price: price,
        description: description,
        artistName: artistName,
        quantity: quantity,
        status: status
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('artist/edit-artwork', {
      pageTitle: 'Add Artwork',
      path: '/artist/add-artwork',
      editing: false,
      hasError: true,
      artwork: {
        title: title,
        price: price,
        description: description,
        artistName: artistName,
        quantity: quantity,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      
    });
  }

  const imageUrl = image.path;
console.log('req.artistreq.artist', req.body);
  const artwork = new Artwork({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    artistId: req.session.user._id,// Assuming req.artist is defined and has _id property
    artistName: artistName,
    quantity: quantity,
    status: 'available',
    contactInfo: {
      email: email,
      phone: phone
    }
  });

  artwork.save()
    .then(result => {
      console.log('Created Artwork');
      res.redirect('/artist/artworks');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};




exports.getEditArtwork = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const artworkId = req.params.artworkId;
  Artwork.findById(artworkId)
    .then(artwork => {
      if (!artwork) {
        return res.redirect('/');
      }
      res.render('artist/edit-artwork', {
        pageTitle: 'Edit Artwork',
        path: '/artist/edit-artwork',
        editing: editMode,
        artwork: artwork,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditArtwork = (req, res, next) => {
  const artworkId = req.body.artworkId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;
  const updatedArtistName = req.body.artistName;
  const updatedQuantity = req.body.quantity;
  const status = req.body.status;
  const updatedEmail = req.body.email;  
  const updatedPhone = req.body.phone;  

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('artist/edit-artwork', {
      pageTitle: 'Edit Artwork',
      path: '/artist/edit-artwork',
      editing: true,
      hasError: true,
      artwork: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: artworkId,
        artistName: updatedArtistName,
        quantity: updatedQuantity,
        email: updatedEmail,
        phone:updatedPhone
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Artwork.findById(artworkId)
    .then(artwork => {
      if (artwork.artistId.toString() !== req.artist._id.toString()) {
        return res.redirect('/');
      }
      artwork.title = updatedTitle;
      artwork.price = updatedPrice;
      artwork.description = updatedDesc;
      artwork.artistName = updatedArtistName;
      artwork.quantity = updatedQuantity;
      artwork.status = status;
      artwork.contactInfo.email = updatedEmail;  
      artwork.contactInfo.phone = updatedPhone;
      if (image) {
        fileHelper.deleteFile(artwork.imageUrl);
        artwork.imageUrl = image.path;
      }
      return artwork.save().then(result => {
        console.log('UPDATED Artwork!');
        res.redirect('/artist/artworks');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getArtworks = (req, res, next) => {
  console.log('req.artist._id', req.artist);
  Artwork.find({ artistId: req.session.user._id })
    // .select('title price -_id')
    // .populate('artistId', 'name')
    .then(artworks => {
      console.log(artworks);
      res.render('artist/artworks', {
        artworks: artworks,
        pageTitle: 'Profile',
        path: '/artist/artworks',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteArtwork = (req, res, next) => {
  const artworkId = req.params.artworkId;
  Artwork.findOne({ _id: artworkId, artistId: req.artist._id })
    .then(artwork => {
      if (!artwork) {
        return next(new Error('Artwork not found.'));
      }
      fileHelper.deleteFile(artwork.imageUrl);
      return Artwork.deleteOne({ _id: artworkId, artistId: req.artist._id });
    })
    .then(() => {
      console.log('DESTROYED Artwork');
      res.status(200).json({ message: 'Success!' });
    })
    .catch(err => {
      res.status(500).json({ message: 'Deleting artwork failed.' });
    });
};


