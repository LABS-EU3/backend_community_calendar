const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const EventSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    unique: true,
  },
  scrapedEventDate: {
    type: Date,
  },
  scrapedEventId: {
    type: String,
    unique: true,
  },
  scrapedEventLink: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  location: {
    type: String,
  },
  price: {
    type: String,
  },
}, { timestamps: true });

EventSchema.plugin(uniqueValidator);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
