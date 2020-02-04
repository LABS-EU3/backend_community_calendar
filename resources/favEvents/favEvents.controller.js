const FavEvent = require('./favEvents.model');
const mapper = require('../favEvents/favEvents.helpers');

module.exports = {
  findFav(userId) {
    // Find all Fav Events for a user;
    FavEvent.find({ userId }, async (err, favEvents) => {
      if (err) return err;
      try {
        // If they exist;
        const allFav = await mapper.mapAllDocs(favEvents);
        return allFav;
      } catch (e) {
        return e;
      }
    });
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
