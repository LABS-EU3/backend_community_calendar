const mongoose = require('mongoose');

/* eslint-disable no-param-reassign */
const Event = require('../event/event.model');

module.exports = {
  async mapAll(arr) {
    // Convert all found models to objects
    const convertedArr = arr.map((el) => el.toObject());
    // Use Promise to safely map the array and find users for each userId
    const unQuery = convertedArr.map((el) => Event.findOne({ scrapedEventId: el.eventId },
      (err, doc) => {
        if (err) {
          return false;
        }
        return doc;
      }));

    const resolvedFavEvents = await Promise.all(
      unQuery,
    );
    return convertedArr.map((el, idx) => {
      const event = resolvedFavEvents[idx].toObject();
      el.event = event;
      // Delete unnecessary keys
      delete el.event.__v;
      delete el.eventId;
      delete el.__v;
      delete el.userId;
      return el;
    });
  },

  mapAllDocs(arr) {
    // Convert mongosse ids from string to mongoose object type.
    const arrOfIds = arr.map(({ eventId }) => mongoose.Types.ObjectId(eventId));

    const query = {
      _id: {
        $in: arrOfIds,
      // eslint-disable-next-line comma-dangle
      }
    };

    return new Promise((resolve, reject) => {
      Event.find(query, (err, favEvents) => {
        if (err) reject(err);

        resolve(favEvents);
      });
    });
  },
};
