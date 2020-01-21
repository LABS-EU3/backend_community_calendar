const FavEvent = require('./favEvents.model');
const Event = require('../event/event.model');

module.exports = {
  async findFav(userId) {
    const favEventsIds = await FavEvent.find({ userId }, 'eventId userId', (err, docs) => {
      if (err) {
        return false;
      }
      return docs;
    });
    const result = await Promise.all(
      favEventsIds.map((event) => Event.findOne({
        scrapedEventId: event.eventId,
      }, (err, doc) => {
        if (err) return false;
        return doc;
      })),
    )
      .then((favEventsArr) => favEventsArr);
    return result;
  },
  async saveFav(eventId, userId) {
    const favedEvent = new FavEvent({ eventId, userId });
    await favedEvent.save();
    return favedEvent;
  },
  async deleteFav(eventId, userId) {
    const deletedFav = await FavEvent.findOneAndDelete({
      eventId,
      userId,
    });
    return deletedFav;
  },
};
