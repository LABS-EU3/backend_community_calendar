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
  scrapedEventId: {
    type: String,
    default: null,
  },
}, { timestamps: true })
  .pre('save', (next) => {
    const self = this;

    // eslint-disable-next-line no-use-before-define
    FavEvent.findOne(
      { eventId: self.eventId, userId: self.userId },
      // eslint-disable-next-line consistent-return
      (err, favEvent) => {
        if (err) return next(err);
        if (favEvent) {
          self.invalidate("eventId", "eventId,userId combination must be unique");
          next(new Error("You have already have this event saved"));
        } else {
          next();
        }
      },
    );
  });

FavEventSchema.plugin(uniqueValidator);

const FavEvent = mongoose.model('FavEvent', FavEventSchema);

module.exports = FavEvent;
