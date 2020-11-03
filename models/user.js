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
    question1:Number,
    question2:Number,
    question3:Number,
    question4:Number,
    question5:Number,
    question6:Number,
    question7:Number,
    question8:Number,
    question9:Number,
    question10:Number,
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