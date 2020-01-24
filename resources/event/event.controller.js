/* eslint-disable max-len */
const Event = require("./event.model");
const scrapeEventbriteEvents = require("../../utils/eventScraper/webScraperEventbrite");
const scrapeMeetUpEvents = require("../../utils/eventScraper/webScraperMeetup");
const scrapeByDate = require("../../utils/eventScraper/eventbriteByDate.js");
const scrapeDescription = require("../../utils/eventScraper/scrapeEventbriteDesc");

const findEvent = async () => {
  const events = await Event.find();
  return events;
};

const addScrapedEvent = async (userCountry, userCity, eventType) => {
  let scrappedEventsArray = [];
  await Promise.all([scrapeEventbriteEvents(userCountry, userCity, eventType), scrapeMeetUpEvents(userCountry, userCity, eventType)])
    .then((results) => {
      scrappedEventsArray = results[0].concat(results[1]);
      if (scrappedEventsArray.length > 0) {
        Event.insertMany(scrappedEventsArray, (error, doc) => {
          if (error) {
            return error;
          }
          return doc;
        });
      } else {
        return false;
      }
      return scrappedEventsArray;
    })
    .catch((error) => error);
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
