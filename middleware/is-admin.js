module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect('/login');
    }
    
    if (req.session.admin) {
        next(); // Allow the admin to proceed to the next middleware or route handler
      } else {
        res.status(403).send('Access Denied'); // Send a 403 Forbidden response 
      }
    };