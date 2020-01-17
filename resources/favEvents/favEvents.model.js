const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;
const FavEventSchema = new Schema({
  eventId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

FavEventSchema.plugin(uniqueValidator);

const FavEvent = mongoose.model('FavEvent', FavEventSchema);

module.exports = FavEvent;
