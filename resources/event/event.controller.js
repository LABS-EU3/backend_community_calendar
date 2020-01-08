const Event = require("./event.model");
const scrapeEvents = require("../../utils/webScraper");

const findEvent = async () => {
  const events = await Event.find();
  return events;
};

const addScrapedEvent = async () => {
  const scrappedEventsArray = await scrapeEvents;
  if (scrappedEventsArray.length > 0) {
    await Event.insertMany(scrappedEventsArray, (error, doc) => {
      if (error) {
        return error;
      }
      return doc;
    });
  } else {
    return false;
  }
  return scrappedEventsArray;
};

module.exports = {
  addScrapedEvent,
  findEvent,
};
