const { UnsupportedMediaType } = require("http-errors");
var express = require("express");
var router = express.Router();
const withAuth = require("../helpers/middleware");

const User = require("../models/user");
const Event = require("../models/events");
const uploadCloud = require("../config/cloudinary");

//comparing users

// const match = () => {
//   let score = 0;
//   if (searchUser.question1.value === genderArr.question1.value) {
//     return (score += 1);
//   } else if (searchUser.question2.value === genderArr.question2.value) {
//     return (score += 1);
//   } else if (searchUser.question3 === genderArr.question3) {
//     return (score += 1);
//   } else if (searchUser.question4 === genderArr.question4) {
//     return (score += 1);
//   } else if (searchUser.question5 === genderArr.question5) {
//     return (score += 1);
//   } else if (searchUser.question6 === genderArr.question6) {
//     return (score += 1);
//   } else if (searchUser.question7 === genderArr.question7) {
//     return (score += 1);
//   } else if (searchUser.question8 === genderArr.question8) {
//     return (score += 1);
//   } else if (searchUser.question9 === genderArr.question9) {
//     return (score += 1);
//   } else if (searchUser.question10 === genderArr.question10) {
//     return (score += 1);
//   } else {
//     return 0;
//   }
// };

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
    
      //with this we save each genderArr questions
    //   let userAnswers = {answers: [
    //     searchUser.question1,
    //     searchUser.question2,
    //     searchUser.question3,
    //     searchUser.question4,
    //     searchUser.question5,
    //     searchUser.question6,
    //     searchUser.question7,
    //     searchUser.question8,
    //     searchUser.question9,
    //     searchUser.question10,
    //   ]};
    //    console.log("VALUEs", userAnswers);

    //   function theAnswers () {
    //     for (let i = 0; i < genderArr.length; i++) {
    //     let allUsersAnswers = {answers: [
    //       genderArr[i].question1,
    //       genderArr[i].question2,
    //       genderArr[i].question3,
    //       genderArr[i].question4,
    //       genderArr[i].question5,
    //       genderArr[i].question6,
    //       genderArr[i].question7,
    //       genderArr[i].question8,
    //       genderArr[i].question9,
    //       genderArr[i].question10,
    //     ]};
         
    //   }}console.log("OTHERS ANSWERS", theAnswers);
      

        
    
    var points = (searchUser, usuario) => {
      var pts = 0;
      for (var i = 0; i < searchUser.answers.length; i++) {
        if (searchUser.answers[i] === usuario.answers[i]) pts++;
      }
      return pts;
    };
    //points(searchUser, usuario2);
    const bestMatch = (searchUser, genderArr) => {
      const results = genderArr.map((user) => {
        const pts = points(searchUser, user);
        //console.log(pts);
        if (pts > 7) {
          return user;
        } else {
          return false;
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
