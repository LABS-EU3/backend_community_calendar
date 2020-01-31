const FavEvent = require('./favEvents.model');
const mapper = require('../favEvents/favEvents.helpers');

module.exports = {
  async findFav(userId) {
    // Find all Fav Events for a user;
    const favEventsIds = await FavEvent.find(
      { userId }, (err, docs) => {
        if (err) {
          return false;
        }
        return docs;
      },
    );
    // If they exist;
    if (favEventsIds.length > 0) {
      return mapper.mapAll(favEventsIds);
    }
    // If not, return the empty array, anyways
    return favEventsIds;
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
