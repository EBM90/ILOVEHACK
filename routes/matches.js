const { UnsupportedMediaType } = require("http-errors");
var express = require("express");
var router = express.Router();
const withAuth = require("../helpers/middleware");

const User = require("../models/user");
const Event = require("../models/events");
const uploadCloud = require("../config/cloudinary");

//comparing users

// router.post("/matches",uploadCloud.single("photo"), async (req, res, next) => {
//     User.find()
//     .then( allTheUsersFromDB => {
//         console.log('Retrieved users from DB:', allTheUsersFromDB);
//         res.render('user/matches', { user: allTheUsersFromDB });
//       })
//       .catch(error => {
//         next(error);
//       });

//     const { question1, question2, question3, question4, question5, question6, question7, question8, question9, question10 } = req.body;

//     const score = [];

//     try {
//         const user = await User.find();
//       } catch (error) { console.log("Users not found")}

//     const arr1[i] = [question1, question2];
//     const arr2 = [question1, question2];

//     compare arrays
//     if (JSON.stringify(arr1) === JSON.stringify(arr2)) {
//         console.log('Both arrays are equal!');
//     } else {
//         console.log('Arrays are not equal.');
//     }

//     if (userX.question1.value === userY.question1.value) {
//         return score += 1;
//     } else if  (userX.question2.value === userY.question2.value) {
//         return score += 1;
//     } else if  (userX.question3 === userY.question3) {
//         return score += 1;
//     } else if  (userX.question4 === userY.question4) {
//         return score += 1;
//     } else if  (userX.question5 === userY.question5) {
//         return score += 1;
//     } else if  (userX.question6 === userY.question6) {
//         return score += 1;
//     } else if  (userX.question7 === userY.question7) {
//         return score += 1;
//     } else if  (userX.question8 === userY.question8) {
//         return score += 1;
//     } else if  (userX.question9 === userY.question9) {
//         return score += 1;
//     } else if  (userX.question10 === userY.question10) {
//         return score += 1;
//     } else {
//         return 0;
//     };
// // });


const match = () => {          
          let score = 0;
                if (searchUser.question1.value === genderArr.question1.value) {
                    return score += 1;
                } else if  (searchUser.question2.value === genderArr.question2.value) {
                    return score += 1;
                } else if  (searchUser.question3 === genderArr.question3) {
                    return score += 1;
                } else if  (searchUser.question4 === genderArr.question4) {
                    return score += 1;
                } else if  (searchUser.question5 === genderArr.question5) {
                    return score += 1;
                } else if  (searchUser.question6 === genderArr.question6) {
                    return score += 1;
                } else if  (searchUser.question7 === genderArr.question7) {
                    return score += 1;
                } else if  (searchUser.question8 === genderArr.question8) {
                    return score += 1;
                } else if  (searchUser.question9 === genderArr.question9) {
                    return score += 1;
                } else if  (searchUser.question10 === genderArr.question10) {
                    return score += 1;
                } else {
                    return 0;
                };
            }
    
            

router.get("/user/matches", withAuth, uploadCloud.single("photo"),async (req, res, next) => {
    
    try {
    //with this we find only the opposite sex:
      const allUsers = await User.find();
      const searchUser = await User.findById(req.query.user_id);

      const genderArr = allUsers.filter((d) => d.gender !== searchUser.gender);
      //console.log("genderArr", genderArr);
      //console.log(searchUser, "searchUser", allUsers, "AllUsers");
      res.render("user/matches", { genderArr });
        //with this we save each genderArr questions
        let userAnswers = [searchUser.question1, searchUser.question2, searchUser.question3, searchUser.question4, searchUser.question5, searchUser.question6, searchUser.question7, searchUser.question8, searchUser.question9, searchUser.question10]
        console.log('VALUEs',userAnswers)
        
        for (let i = 0; i < genderArr.length; i++) {
         let allUsersAnswers = [genderArr[i].question1, genderArr[i].question2, genderArr[i].question3, genderArr[i].question4, genderArr[i].question5, genderArr[i].question6, genderArr[i].question7, genderArr[i].question8, genderArr[i].question9, genderArr[i].question10]
         console.log('VLOSOTROS',allUsersAnswers)
        }
        
        

        
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
