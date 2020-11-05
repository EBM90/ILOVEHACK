const { UnsupportedMediaType } = require("http-errors");
var express = require("express");
var router = express.Router();
const withAuth = require("../helpers/middleware");

const User = require("../models/user");
const Event = require("../models/events");
const uploadCloud = require("../config/cloudinary");

//comparing users

router.get(
  "/user/matches",
  withAuth,
  uploadCloud.single("photo"),
  async (req, res, next) => {
    try {
      //with this we find only the opposite sex:
      const allUsers = await User.find();
      const searchUser = await User.findById(req.query.user_id);

      const genderArr = await allUsers.filter(
        (d) => d.gender !== searchUser.gender
      );

      //   console.log("genderArr", genderArr);
      //   console.log("searchUser", searchUser);

      var points = (searchUser, usuario) => {
        var pts = 0;
        for (var i = 0; i < searchUser.answers.length; i++) {
          if (searchUser.answers[i] === usuario.answers[i]) pts++;
        }
        return pts;
      };

      //points(searchUser, usuario2);
      const bestMatch = (searchUser, genderArr) => {
        const results = genderArr.filter((user) => {
          const pts = points(searchUser, user);
          //console.log(pts);
          if (pts >= 7) {
            return user;
          }
        });
        return results;
      };

      console.log(bestMatch(searchUser, genderArr));
      
      let matchList = bestMatch(searchUser, genderArr);

      res.render("user/matches", { matchList });
    } catch (error) {
      next(error);
      return;
    }
  }
);

router.post("/user/matches", withAuth, async function (req, res, next) {
  try {
    const user = await User.find();
  } catch (error) {}
});

module.exports = router;
