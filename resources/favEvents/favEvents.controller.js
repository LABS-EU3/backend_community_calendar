const FavEvent = require('./favEvents.model');

module.exports = {
  async saveFav(eventId, userId) {
    const favedEvent = new FavEvent({ eventId, userId });
    await favedEvent.save();
    return favedEvent;
  },
  async deleteFav(savedFavId) {
    const deletedFav = await FavEvent.findOneAndDelete({
      _id: savedFavId,
    });
    return deletedFav;
  },
};
