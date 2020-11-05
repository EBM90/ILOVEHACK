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
    imgPath: {type:String},
    answers: [],
    favEvent: [ { type: Schema.Types.ObjectId, ref: "Event"} ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;