const mongoose = require("mongoose");
const { use } = require("../routes");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullname:String,
    password:String,
    birthdate:Date,
    gender:String,
    email:String,
    description:String,
    imgPath: {type:String, default: 'linkimage'},
    question1:String,
    question2:String,
    question3:String,
    question4:String,
    question5:String,
    question6:String,
    question7:String,
    question8:String,
    question9:String,
    question10:String,
    matches: [],
    likedEvents: [ { type: Schema.Types.ObjectId, ref: "Events"} ],
    ownEvents:  [ { type: Schema.Types.ObjectId, ref: "Events"} ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;