const Event = require("./event.model");
const ScrapeEvents = require("../../utils/webScraper");

const addScrapedEvent = async () => {
  console.log('scrappedEventsArray runs');
  const scrappedEventsArray = await ScrapeEvents;
  await scrappedEventsArray.forEach(async (event) => {
    console.log(event);
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
};

const findEvent = async () => {
  const events = await Event.find();
  // console.log(events);
  return events;
};

module.exports = {
  addScrapedEvent,
  findEvent,
};
