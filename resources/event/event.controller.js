
const mongoose = require("mongoose");
const EventSchema = require('./event.model');

const addScrapedEvent = (scrappedEventsArray) => {
  scrappedEventsArray.forEach(async (event) => {
    const data = new EventSchema({
      name: event.title,
      scrapedEventDate: event.date,
      scrapedEventId: event.eventId,
      scrapedEventLink: event.eventLink,
      imageUrl: event.imageLink,
      location: event.location,
      price: event.price,
    });
    await data.save();
  });
};

EventSchema.statics.addScrapedEvent = addScrapedEvent;

const Event = mongoose.model('Event', EventSchema);

export default Event;
