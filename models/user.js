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
    questions:[String],
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