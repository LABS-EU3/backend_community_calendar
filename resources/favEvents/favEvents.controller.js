const FavEvent = require('./favEvents.model');

module.exports = {
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
