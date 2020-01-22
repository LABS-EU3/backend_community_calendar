/* eslint-disable max-len */
const Event = require("./event.model");
const scrapeEvents = require("../../utils/eventScraper/webScraperEventbrite");
const scrapeByDate = require("../../utils/eventScraper/eventbriteByDate.js");
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

const updateEventsByDates = async (userCountry, userCity, eventType, startDate, endDate) => {
  const scrappedEventsArray = await scrapeByDate(userCountry, userCity, eventType, startDate, endDate);
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
        $set: { description: description.description },
      },
    );

    return description;
  } catch (error) {
    return false;
  }
};

const findByDate = async (startDate, endDate, userCity, userCountry, eventType) => {
  try {
    const events = await Event.find({
      eventDate: {
        $gte: `${startDate}T00:00:00.625Z`,
        $lt: `${endDate}T00:00:00.625Z`,
      },
      country: userCountry,
      city: userCity,
      eventType,
    });
    return events;
  } catch (error) {
    return false;
  }
};

module.exports = {
  addScrapedEvent,
  findEvent,
  addDescription,
  findByDate,
  updateEventsByDates,
};
