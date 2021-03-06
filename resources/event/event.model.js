const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;
const EventSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    unique: true,
  },
  eventDate: {
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
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  price: {
    type: String,
  },
  description: {
    type: String,
  },
  eventType: {
    type: String,
  },
  source: {
    type: String,
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
  },
}, { timestamps: true });

EventSchema.plugin(uniqueValidator);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
