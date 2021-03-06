const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_SESSION;

const User = require("../models/user");

const withAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
        res.locals.isUserLoggedIn = false;
        next();
    } else {
      const decoded = await jwt.verify(token, secret)
      req.user = decoded.userWithoutPass;
      res.locals.currentUserInfo = req.user;
      res.locals.isUserLoggedIn = true;
      next();
    }
  } catch (err) {
    console.error(err);
    res.locals.isUserLoggedIn = false;
    next(err);
  }
};

module.exports = withAuth;