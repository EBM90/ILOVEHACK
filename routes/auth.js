var express = require("express");
var router = express.Router();
const withAuth = require("../helpers/middleware");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const bcrypt = require("bcryptjs");
const { findOne } = require("../models/user");
const bcryptSalt = 10;


//SIGN UP

router.get("/signup", function (req, res, next) {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  if (req.body.email === "" || req.body.password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up",
    });
    return;
  }

  const { fullname, password, repeatPassword, birthdate, gender, email, description, photo } = req.body;

  if (password.length < 8){
    res.render("auth/signup", {
      errorMessage: "Your password should have at least 8 characters",
    });
    return;
  }

  if (password !== repeatPassword){
    res.render("auth/signup", {
      errorMessage: "Your passwords are not matching",
    });
    return;
  }

  if (fullname.length === ""){
    res.render("auth/signup", {
      errorMessage: "Your match will need to know how to call you ;)",
    });
    return;
  }

  if (description.length < 10){
    res.render("auth/signup", {
      errorMessage: "Tell your match a bit more about yourself!",
    });
    return;
  }

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear() - 18;

  today = mm + dd + yyyy;
  if (birthdate < today){
    res.render("auth/signup", {
      errorMessage: "You have to be 18 or older to find love here :)",
    });
    return;
  }
  ;



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

    await User.create({
      fullname,
      password: hashPass,
      birthdate,
      gender,
      email,
      description,
      photo,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

/*attribute=name tag; validator=predefined names from the library; 
validator options=one of the given values that given Validator name accepts;*/
// var constraints = {
//   <attribute>: {
//     <validator name>: <validator options>
//   }
// }


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
      res.status(200).redirect("/");
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

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login')
  })
})



// TEST

router.get("/testsignup", function (req, res, next) {
  res.render("auth/testsignup");
});

module.exports = router;
