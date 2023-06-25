const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash'); 
const multer = require('multer');

const errorController = require('./controllers/error');
const Artist = require('./models/artist');
const Customer = require('./models/customer');
const Admin = require('./models/admin');

const customers = new Customer(); 
const admins = new Admin();
const MONGODB_URI =
   'mongodb+srv://zina:xKqthTrSF4Uj4Bx9@artgallery.cchhryv.mongodb.net/artgallery';
 

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const artistRoutes = require('./routes/artist');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  const isArtist = req.session.artist
  res.locals.isArtist = isArtist;
  next();
});

app.use((req, res, next) => {
  const isCustomer = req.session.customer
  res.locals.isCustomer = isCustomer;
  next();
});

app.use((req, res, next) => {
  const isAdmin = req.session.admin
  res.locals.isAdmin = isAdmin;
  next();
});



// app.use((req, res, next) => {
//   if (!req.session.artist) {
//     return next();
//   }
//   Artist.findById(req.session.artist._id)
//     .then(artist => {
//       if (!artist) {
//         return next();
//       }
//       req.artist = artist;
//       next();
//     })
//     .catch(err => {
//       next(new Error(err));
//     });
// });
// app.use((req, res, next) => {
//   next();
// })

// app.use((req, res, next) => {
//   if (!req.session.customer) {
//     return next();
//   }
//   Customer.findById(req.session.customer._id)
//     .then(customer => {
//       if (!customer) {
//         return next();
//       }
//       req.customer = customer;
//       next();
//     })
//     .catch(err => {
//       next(new Error(err));
//     });
// });

app.use((req, res, next) => {
  if (!req.session.artist) {
    return next();
  }
  Artist.findById(req.session.artist._id)
    .then(artist => {
      if (!artist) {
        return next();
      }
      req.artist = artist;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  if (!req.session.admin) {
    return next();
  }
  Admin.findById(req.session.admin._id)
    .then(admin => {
      if (!admin) {
        return next();
      }
      req.admin = admin;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  if (!req.session.customer) {
    return next();
  }
  Customer.findById(req.session.customer._id)
    .then(customer => {
      if (!customer) {
        return next();
      }
      req.customer = customer;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});


app.use('/artist', artistRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(adminRoutes);


app.get('/500', errorController.get500);

app.use(errorController.get404);

// app.use((error, req, res, next) => {
//   // res.status(error.httpStatusCode).render(...);
//   // res.redirect('/500');
//   res.status(500).render('500', {
//     pageTitle: 'Error!',
//     path: '/500',
//     isAuthenticated: req.session.isLoggedIn
//   });
// });

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000, ()=> {
      console.log('server run port 3000');
    });
  })
  .catch(err => {
    console.log(err);
  });