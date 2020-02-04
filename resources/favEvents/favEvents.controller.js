const FavEvent = require('./favEvents.model');
const mapper = require('../favEvents/favEvents.helpers');
const Event = require('../event/event.model');

module.exports = {
  findFav(userId) {
    return new Promise((resolve, reject) => {
    // Find all Fav Events for a user;
      // eslint-disable-next-line consistent-return
      FavEvent.find({ userId }, async (err, favEvents) => {
        if (err) return err;
        try {
        // If they exist;
          const allFavs = await mapper.mapAllDocs(favEvents);
          resolve(allFavs);
        } catch (e) {
          reject(e);
        }
      });
    });
  },
  saveFav(eventId, userId, scrapedEventId) {
    /* If scrapedEventId is not available the data will
    default to null, as defined on the model schema */
    const dataToSave = scrapedEventId ? { eventId, userId, scrapedEventId } : { eventId, userId };
    const favedEvent = new FavEvent(dataToSave);
    return favedEvent.save();
  },
  async deleteFav(event, userId) {
    const { _id, scrapedEventId } = event;
    // if event has a mongoose id, then query by it else query by scrapedEventId
    const query = _id ? { eventId: _id, userId } : { scrapedEventId, userId };
    return FavEvent.findOneAndDelete(query);
  },
  checkIfInDbElseSaveInDb(event) {
    const query = { scrapedEventId: event.scrapedEventId };
    return new Promise((resolve, reject) => {
      Event.findOne(query, (err, theEvent) => {
        if (err) reject(err);
        if (!theEvent) {
          const saveEvent = new Event(event);
          saveEvent.save()
            .then((savedEvent) => {
              resolve(savedEvent);
            })
            .catch(async (savedEventErr) => {
              try {
              /* Get Event by name, in the case that event failed to save based on
              validation of 'Event validation failed' */
                if (savedEventErr._message === "Event validation failed") {
                  const evt = await Event.findOne({ name: saveEvent.name });
                  resolve(evt);
                } else reject(err);
              } catch (e) {
                reject(e);
              }
            });
        } else {
          resolve(theEvent);
        }
      });
    });
  },
};
