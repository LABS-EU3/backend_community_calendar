const Event = require("./event.model");
const scrapeEvents = require("../../utils/eventScraper/webScraperEventbrite");
const scrapeDescription = require("../../utils/eventScraper/scrapeEventbriteDesc");

const findEvent = async () => {
  const events = await Event.find();
  return events;
};

const addScrapedEvent = async (userCountry, userCity, eventType) => {
  const scrappedEventsArray = await scrapeEvents(userCountry, userCity, eventType);
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

const addDescription = async (eventId, link) => {
  try {
    const description = await scrapeDescription(link);
    await Event.update(
      { scrapedEventId: eventId },
      {
        $set: { description },
      },
    );

    return description;
  } catch (error) {
    return false;
  }
};

module.exports = {
  addScrapedEvent,
  findEvent,
  addDescription,
};
