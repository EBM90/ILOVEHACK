var express = require("express");
var router = express.Router();

const Event = require("../models/events.js");
const User = require("../models/user.js");
const withAuth = require("../helpers/middleware");
const { use } = require("./auth.js");
const uploadCloud = require("../config/cloudinary");
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

/* GET home page. */

router.get("/", (req, res, next) => {
  res.render("index", { title: "I <3 HACK" });
});

router.get("/faq", withAuth, function (req, res, next) {
  res.render("faq");
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

//profile details

router.get("/myprofile", withAuth, async (req, res, next) => {
  const userId = req.user._id;
  console.log('this is the user ID', userId);
  try {
    const user = await User.findById(userId);
    res.render("myprofile", { user });
  } catch (error) {
    next(error);
    return;
  }
});

//edit user profile

router.get("/user/edit", withAuth, async (req, res, next) => {
  await User.findOne({ _id: req.query.user_id })
    .then((user) => {
      res.render("user/edit-user", { user });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/user/edit", withAuth, async (req, res, next) => {
  const {
    fullname,
    password,
    repeatPassword,
    user,
    email,
    description,
  } = req.body;

  try {
    if (password.length < 8) {
      res.render("user/edit", {
        errorMessage: "Your password should have at least 8 characters",
      });
      return;
    } else if (password !== repeatPassword) {
      res.render("user/edit", {
        errorMessage: "Your passwords are not matching",
      });
      return;
    } else if (fullname.length === "") {
      res.render("user/edit", {
        errorMessage: "Your match will need to know how to call you ;)",
      });
      return;
    } else if (description.length < 10) {
      res.render("user/edit", {
        errorMessage: "Tell your future match a bit more about yourself!",
      });
      return;
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashPass = await bcrypt.hashSync(password, salt);

    await User.findByIdAndUpdate(
      req.query.user_id,
      {
        $set: {
          fullname,
          password: hashPass,
          repeatPassword,
          email,
          description,
        },
      },
      { new: true }
    );

    res.redirect("/myprofile");
  } catch (error) {
    console.log(error);
  }
});

//edit user picture
router.get("/user/editPhoto", withAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.query.user_id });

    res.render("user/edit-photo", { user });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/user/editPhoto",
  uploadCloud.single("photo"),
  withAuth,
  async (req, res, next) => {
    try {
      const imgPath = req.file.url;

      let user = await User.findByIdAndUpdate(
        req.query.user_id,
        { $set: { imgPath } },
        { new: true }
      );
      if (user) {
        res.redirect("/myprofile");
      }
    } catch (error) {
      console.log(error);
    }
  }
);

//delete account

router.post("/user/delete", withAuth, async (req, res, next) => {
  await User.deleteOne({ _id: req.query.user_id });
  res.redirect("/");
});

//add favourite events

module.exports = router;
