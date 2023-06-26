const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const Artist = require('../models/artist');
const Customer = require('../models/customer');
const Admin = require('../models/admin');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
    }
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

// exports.postLogin = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).render('auth/login', {
//       path: '/login',
//       pageTitle: 'Login',
//       errorMessage: errors.array()[0].msg,
//       oldInput: {
//         email: email,
//         password: password
//       },
//       validationErrors: errors.array()
//     });
//   }

//   Artist.findOne({ email: email })
//     .then(artist => {
//       if (!artist) {
//         return res.status(422).render('auth/login', {
//           path: '/login',
//           pageTitle: 'Login',
//           errorMessage: 'Invalid email or password.',
//           oldInput: {
//             email: email,
//             password: password
//           },
//           validationErrors: []
//         });
//       }
//       bcrypt
//         .compare(password, artist.password)
//         .then(doMatch => {
//           if (doMatch) {
//             req.session.isLoggedIn = true;
//             req.session.artist = artist;
//             return req.session.save(err => {
//               console.log(err);
//               res.redirect('/');
//             });
//           }
//           return res.status(422).render('auth/login', {
//             path: '/login',
//             pageTitle: 'Login',
//             errorMessage: 'Invalid email or password.',
//             oldInput: {
//               email: email,
//               password: password
//             },
//             validationErrors: []
//           });
//         })
//         .catch(err => {
//           console.log(err);
//           res.redirect('/login');
//         });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
      },
      validationErrors: errors.array()
    });
  }

  // Check if the email exists in either the Artist or Customer model
  Promise.all([
    Artist.findOne({ email: email }),
    Customer.findOne({ email: email }),
    Admin.findOne({ email: email })
  ])
    .then(([artist, customer , admin]) => {
      if (!artist && !customer && !admin) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }

      // Determine if the email belongs to an artist or customer
      // const user = artist || customer || admin ;
       // Determine if the email belongs to an artist, customer, or admin
       let user = null;
       let userType = null;
       if (artist) {
         user = artist;
         userType = 'artist';
       } else if (customer) {
         user = customer;
         userType = 'customer';
       } else {
         user = admin;
         userType = 'admin';
       }

//       bcrypt
//         .compare(password, user.password)
//         .then(doMatch => {
//           if (doMatch) {
//             req.session.isLoggedIn = true;
//             user.type = 'customer';
//             if (artist) {
//               user.type = 'artist';
//             }
//             console.log('user', user);
//             req.session.user = user;
//             req.session.artist = artist;
//             req.session.customer = customer;
//             req.artist = artist; // Set the artist in the req object
//             return req.session.save(err => {
//               console.log(err);
//               res.redirect('/');
//             });
//           }
//           return res.status(422).render('auth/login', {
//             path: '/login',
//             pageTitle: 'Login',
//             errorMessage: 'Invalid email or password.',
//             oldInput: {
//               email: email,
//               password: password
//             },
//             validationErrors: []
//           });
//         })
//         .catch(err => {
//           console.log(err);
//           res.redirect('/login');
//         });
//     })
//     .catch(err => console.log(err));
// };

bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session[userType] = user;
            req[userType] = user; // Set the user in the req object
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};




// exports.postSignup = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log(errors.array());
//     return res.status(422).render('auth/signup', {
//       path: '/signup',
//       pageTitle: 'Signup',
//       errorMessage: errors.array()[0].msg,
//       oldInput: {
//         email: email,
//         password: password,
//         confirmPassword: req.body.confirmPassword
//       },
//       validationErrors: errors.array()
//     });
//   }

//   bcrypt
//     .hash(password, 12)
//     .then(hashedPassword => {
//       const artist = new Artist({
//         email: email,
//         password: hashedPassword,
//         cart: { items: [] }
//       });
//       return artist.save();
//     })
//     .then(result => {
//       res.redirect('/login');
//       // return transporter.sendMail({
//       //   to: email,
//       //   from: 'shop@node-complete.com',
//       //   subject: 'Signup succeeded!',
//       //   html: '<h1>You successfully signed up!</h1>'
//       // });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};


exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    errorMessage: null,
    oldInput: { email: '', password: '', userType: '' },
    validationErrors: []
  });
};

// exports.postSignup = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const userType = req.body.userType; // get the user type from the form

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).render('auth/signup', {
//       pageTitle: 'Signup',
//       errorMessage: errors.array()[0].msg,
//       oldInput: { email: email, userType: userType },
//       validationErrors: errors.array()
//     });
//   }

//   // Create a new artist or customer based on the user type
//   if (userType === 'artist') {
//     bcrypt
//       .hash(password, 12)
//       .then(hashedPassword => {
//         const artist = new Artist({
//           email: email,
//           password: hashedPassword,
//           cart: { items: [] }
//         });
//         return artist.save();
//       })
//       .then(result => {
//         res.redirect('/login');
//       })
//       .catch(err => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//       });
//   } else if (userType === 'customer') {
//     bcrypt
//       .hash(password, 12)
//       .then(hashedPassword => {
//         const customer = new Customer({
//           email: email,
//           password: hashedPassword,
//           cart: { items: [] }
//         });
//         return customer.save();
//       })
//       .then(result => {
//         res.redirect('/login');
//       })
//       .catch(err => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//       });
//   }
// };

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const userType = req.body.userType; // get the user type from the form

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, userType: userType },
      validationErrors: errors.array()
    });
  }

  // Create a new artist, customer, or admin based on the user type
  if (userType === 'artist') {
    bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const artist = new Artist({
          email: email,
          password: hashedPassword,
          cart: { items: [] }
        });
        return artist.save();
      })
      .then(result => {
        res.redirect('/login');
         return transporter.sendMail({
        to: email,
        from: 'artgallerymanage@gmail.com',
        subject: 'Signup succeeded!',
        html: '<h1>You successfully signed up as an artist!</h1>'
      });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else if (userType === 'customer') {
    bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const customer = new Customer({
          email: email,
          password: hashedPassword,
          cart: { items: [] }
        });
        return customer.save();
      })
      .then(result => {
        res.redirect('/login');
        return transporter.sendMail({
          to: email,
          from: 'artgallerymanage@gmail.com',
          subject: 'Signup succeeded!',
          html: '<h1>You successfully signed up as a customer!</h1>'
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else if (userType === 'admin') {
    bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const admin = new Admin({
          email: email,
          password: hashedPassword
        });
        return admin.save();
      })
      .then(result => {
        res.redirect('/login');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }
};



exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    Artist.findOne({ email: req.body.email })
      .then(artist => {
        if (!artist) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        artist.resetToken = token;
        artist.resetTokenExpiration = Date.now() + 3600000;
        return artist.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'artgallerymanage@gmail.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  Artist.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(artist => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        artistId: artist._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const artistId = req.body.artistId;
  const passwordToken = req.body.passwordToken;
  let resetArtist;

  Artist.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: artistId
  })
    .then(artist => {
      resetArtist = artist;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetArtist.password = hashedPassword;
      resetArtist.resetToken = undefined;
      resetArtist.resetTokenExpiration = undefined;
      return resetArtist.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

