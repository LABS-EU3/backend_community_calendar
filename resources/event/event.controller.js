const Event = require("./event.model");
const ScrapeEvents = require("../../utils/webScraper");

const addScrapedEvent = async () => {
  const scrappedEventsArray = await ScrapeEvents;
  await scrappedEventsArray.forEach(async (event) => {
    const data = new Event({
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
  return scrappedEventsArray;
};

const findEvent = async () => {
  const events = await Event.find();
  return events;
};

module.exports = {
  addScrapedEvent,
  findEvent,
};
