const UserFav = require('./favEvents.model');

module.exports = {
  async saveFav(eventId, userId) {
    const favedEvent = new UserFav({ eventId, userId });
    await favedEvent.save();
    return favedEvent;
  },
};
