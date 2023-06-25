const fs = require('fs');
const path = require('path');
const stripe = require('stripe')('sk_test_51N9X95HInnxLtq2Kj6kv05rClvTjqIh0ljio5Sp7oWY1Qqq4PekJu7WPFJ9jyoNSX4yqE2rm7jg2WQkenQCdlvmc00XfLlCNOn');

const PDFDocument = require('pdfkit');
const Artwork = require('../models/artwork');
const Order = require('../models/order');
const Customer = require('../models/customer');
const Artist = require('../models/artist');
const ITEMS_PER_PAGE = 2;

exports.getArtworks = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Artwork.find()
    .countDocuments()
    .then(numArtworks => {
      totalItems = numArtworks;
      return Artwork.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(artworks => {
      res.render('shop/artwork-list', {
        artworks: artworks,
        pageTitle: 'Artworks',
        path: '/artworks',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getArtwork = (req, res, next) => {
  const artworkId = req.params.artworkId;
  Artwork.findById(artworkId)
    .then(artwork => {
      console.log(artwork); 
      res.render('shop/artwork-detail', {
        artwork: artwork,
        pageTitle: artwork.title,
        path: '/artworks',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Artwork.find()
    .countDocuments()
    .then(numArtworks => {
      totalItems = numArtworks;
      return Artwork.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(artworks => {
      res.render('shop/index', {
        artworks: artworks,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  const isCustomer = req.session.customer
  console.log('req.artist', req.artist);
  if(req.artist) {
    Artist.findById(req.artist._id).populate('cart.items.artworkId')
    .then(artist => {
      const artworks = artist.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        artworks: artworks,
        isCustomer: isCustomer
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  }else {
    Customer.findById(req.customer._id).populate('cart.items.artworkId')
    .then(customer => {
      const artworks = customer.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        artworks: artworks,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  }
};

exports.postCart = (req, res, next) => {
  console.log('reqreq', req);
  const artworkId = req.body.artworkId;
  Artwork.findById(artworkId)
    .then(artwork => {
      if(req.artist) {
        return req.artist.addToCart(artwork);
      }else {
        return req.customer.addToCart(artwork);
      }
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.postCartDeleteArtwork = (req, res, next) => {
  const artworkId = req.body.artworkId;
  req.customer
    .removeFromCart(artworkId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getCheckout = (req, res, next) => {
  const isCustomer = req.session.customer;
  let artworks;
  let total = 0;
  Customer.findById(req.customer._id).populate('cart.items.artworkId')
    .then(customer => {
      artworks = customer.cart.items;
      total = 0;
      artworks.forEach(p => { total += p.quantity * p.artworkId.price; });

      const lineItems = artworks.map(p => {
        return {
          price_data: {
            currency: 'usd',
            product_data: { // Changed 'artwork_data' to 'product_data'
              name: p.artworkId.title,
              description: p.artworkId.description,
            },
            unit_amount: p.artworkId.price * 100,
          },
          quantity: p.quantity
        };
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        artworks: artworks,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getCheckoutSuccess = (req, res, next) => {
  Customer.findById(req.customer._id).populate('cart.items.artworkId')
    .execPopulate()
    .then(customer => {
      const artworks = customer.cart.items.map(i => {
        return { quantity: i.quantity, artwork: { ...i.artworkId._doc } };
      });
      const order = new Order({
        customer: {
          email: req.customer.email,
          customerId: req.customer._id
        },
        artworks: artworks
      });
      return order.save();
    })
    .then(result => {
      return req.customer.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.postOrder = (req, res, next) => {
  Customer.findById(req.customer._id).populate('cart.items.artworkId')
    .execPopulate()
    .then(customer => {
      const artworks = customer.cart.items.map(i => {
        return { quantity: i.quantity, artwork: { ...i.artworkId._doc } };
      });
      const order = new Order({
        customer: {
          email: req.customer.email,
          customerId: req.customer._id
        },
        artworks: artworks
      });
      return order.save();
    })
    .then(result => {
      return req.customer.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  const isCustomer = req.session.customer
  Order.find({ 'customer.customerId': req.customer._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isCustomer: isCustomer
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.customer.customerId.toString() !== req.customer._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      order.artworks.forEach(artwork => {
        totalPrice += artwork.quantity * artwork.artwork.price;
        pdfDoc
          .fontSize(14)
          .text(
            artwork.artwork.title +
              ' - ' +
              artwork.quantity +
              ' x ' +
              '$' +
              artwork.artwork.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDoc.end();
    })
    .catch(err => next(err));
};




