var express = require("express");
var router = express.Router();

const Event = require('../models/events.js');
const User = require('../models/user.js');
const withAuth = require("../helpers/middleware");
const { use } = require("./auth.js");
const uploadCloud = require("../config/cloudinary");

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

router.get('/user', withAuth, async (req, res, next)=>{
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



//edit user profile

router.get("/user/edit", withAuth, function (req, res, next) {
  User.findOne({ _id: req.query.user_id })
    .then((user) => {
      res.render("user/edit-user", { user });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/user/edit", uploadCloud.single("photo"), withAuth, async (req, res, next) => {
  const { fullname, password, repeatPassword, birthdate, gender, email, description } = req.body;
  const imgPath = req.file.url;

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear() - 18;

  const error = errorMessage;
  
  today = mm + dd + yyyy;
  if (birthdate < today){
    res.render(error);
    return;
  }else if (password.length < 8){
    res.render("auth/signup", {
      errorMessage: "Your password should have at least 8 characters",
    });
    return;
  }else if (password !== repeatPassword){
    res.render("auth/signup", {
      errorMessage: "Your passwords are not matching",
    });
    return;
  }else if (fullname.length === ""){
    res.render("auth/signup", {
      errorMessage: "Your match will need to know how to call you ;)",
    });
    return;
  }else if (description.length < 10){
    res.render("auth/signup", {
      errorMessage: "Tell your future match a bit more about yourself!",
    });
    return;
  }

  const salt = await bcrypt.genSaltSync(10);
  const hashPass = await bcrypt.hashSync(password, salt);

  User.update(
    { _id: req.query.event_id },
    { $set: { fullname, password, repeatPassword, birthdate, gender, email, description, imgPath } }
  )
    .then((user) => {
      res.redirect("/user/myprofile");
    })
    .catch((error) => {
      console.log(error); 
    });
});




module.exports = router;