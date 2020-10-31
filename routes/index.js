var express = require("express");
var router = express.Router();

const Event = require('../models/events.js');
const User = require('../models/user.js');
const withAuth = require("../helpers/middleware");
const { use } = require("./auth.js");

/* GET home page. */
router.get('/', withAuth, (req, res, next) => {
  res.render('index', { title: 'I <3 HACK' });
});

router.get('/', (req, res, next) => {
  res.render('home', { title: 'I <3 HACK' });
});

router.get("/faq", withAuth, function (req, res, next) {
  res.render("faq");
});

router.get("/myprofile", withAuth, function (req, res, next) {
  res.render("myprofile");
});

router.get("/events", withAuth, function (req, res, next) {
  res.render("all-events"); 
});

router.get("/fav-events", withAuth, function (req, res, next) {
  res.render("user/fav-events");
});

router.get("/matches", withAuth, function (req, res, next) {
  res.render("user/matches");
});

router.get('/usuario', withAuth, async (req, res, next)=>{
  const userId= req.user._id;
  console.log(userId)
  try {
  const user= await User.findById(userId);
  res.render('myprofile', {user});
  } catch (error) {
    next(error)
    return;
  }
})


module.exports = router;