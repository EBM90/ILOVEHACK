var express = require("express");

var router = express.Router();
const withAuth = require("../helpers/middleware");

const jwt = require("jsonwebtoken");

const User = require("../models/user");
const uploadCloud = require('../config/cloudinary');

const bcrypt = require("bcryptjs");
const { findOne } = require("../models/user");
const bcryptSalt = 10;


//SIGN UP

router.get("/signup", function (req, res, next) {
  res.render("auth/signup");
});

router.post("/signup",uploadCloud.single("photo"), async (req, res, next) => {
  if (req.body.email === "" || req.body.password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up",
    });
    return;
  }

  const { fullname, password, repeatPassword, birthdate, gender, email, description, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10 } = req.body;
  console.log("req.body", req.body)

  // var date = birthdate.toLocaleDateString('es-ES');

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear() - 18;
  let birthday= {day: req.body.day}
  today = mm + dd + yyyy;
  if (birthdate < today){
    res.render("auth/signup", {
      errorMessage: "You have to be 18 or older to find love here :)",
    });
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
  }else if (description.length < 180 && description.length > 240){
    res.render("auth/signup", {
      errorMessage: "Tell your future match a bit more about yourself! (at least 180 characters)",
    });
    return;
  }

  const salt = await bcrypt.genSaltSync(10);
  const hashPass = await bcrypt.hashSync(password, salt);

  try {
    const user = await User.findOne({ email: email });
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The email already exists!",
      });
      return;
    }
    const imgPath = req.file.url;
    
    await User.create({
      fullname,
      password: hashPass,
      birthdate,
      gender,
      email,
      description,
      answers: [question1,
        question2,
        question3,
        question4,
        question5,
        question6,
        question7,
        question8,
        question9,
        question10],
      
      imgPath,
    });
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
});


//LOG IN + TOKEN VALIDATION (MIDDLEWARE ALSO INVOLVED)


router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  if (req.body.email === "" || req.body.password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up.",
    });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.render("auth/login", {
        errorMessage: "The email doesn't exist",
      });
      return;
    } else if (bcrypt.compareSync (password, user.password)) {
      const userWithoutPass = await User.findOne({ email }).select("-password");
      const payload = { userWithoutPass };
      const token = jwt.sign(payload, process.env.SECRET_SESSION, {
        expiresIn: "1h"
      });
      res.cookie("token", token, { httpOnly: true });
      res.status(200).redirect("/myprofile");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/logout", withAuth, (req, res, next) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.redirect("/");
});


module.exports = router;
