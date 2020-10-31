const mongoose = require("mongoose");
const { use } = require("../routes");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
    {
      name: String,
      date: Date,
      description: String,
      location:String,
      imgPath: String,
    },
    {
      timestamps: true,
    }
  );
  const Event = mongoose.model('Event', eventSchema);
  
  module.exports = Event;