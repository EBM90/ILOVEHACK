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

// router.use((req, res, next) => {
//   // if hay un usuario en sesión (si está logged in)
//   if (req.session.currentUser) {
//     next();
//   } else {
//     res.redirect("/login");
//   }
// });

router.get("/secret", function (req, res, next) {
  res.render("secret");
});

//esto es nuevo
router.get("/faq", withAuth, function (req, res, next) {
  res.render("faq");
});

//esto es nuevo
router.get("/myprofile", withAuth, function (req, res, next) {
  res.render("myprofile");
});

//esto es nuevo
router.get("/events", withAuth, function (req, res, next) {
  res.render("events");
});

//esto es nuevo
router.get("/fav-events", withAuth, function (req, res, next) {
  res.render("user/fav-events");
});

//esto es nuevo
router.get("/matches", withAuth, function (req, res, next) {
  res.render("user/matches");
});


//ADDING NEW EVENT FUNCTIONS:
router.get('/events/add-event', (req, res, next) => {
  res.render('add-event');
});
 
router.post('/events/add-event', (req, res, next) => {
  const { /*HERE WE NEED TO DESTRUCTURE THE MODEL WHENEVER WE HAVE IT */ } = req.body;
 
  const newEvent = new Event({ /*HERE WE NEED TO DESTRUCTURE THE MODEL WHENEVER WE HAVE IT */ });
  newEvent
    .save()
    .then(event => {
      res.redirect('/all-events');
    })
    .catch(error => {
      next(error);
    });
});

// intento de traer user, prueba 1
router.get('/usuario', withAuth, async (req, res, next)=>{
  const userId= req.user._id;
  console.log(userId)
  // console.log(req)
  try {
  const user= await User.findById(userId);
  // res.locals.currentUserInfo=user;
  res.render('myprofile', {user});
  } catch (error) {
    next(error)
    return;
  }
})


module.exports = router;