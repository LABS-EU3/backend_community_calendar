/* eslint-disable max-len */
const Event = require("./event.model");
const scrapeEventbriteEvents = require("../../utils/eventScraper/webScraperEventbrite");
const scrapeMeetUpEvents = require("../../utils/eventScraper/webScraperMeetup");
const scrapeByDate = require("../../utils/eventScraper/eventbriteByDate.js");
const scrapeDescription = require("../../utils/eventScraper/scrapeEventbriteDesc");
const scrapeMeetupDescription = require("../../utils/eventScraper/scrapeMeetupDesc");
const imageUploader = require("../../utils/uploads");

const findEvent = async () => {
  const events = await Event.find();
  return events;
};

const addScrapedEvent = (userCountry, userCity, eventType) => new Promise((resolve, reject) => {
  let scrappedEventsArray = [];

  Promise.all([
    scrapeEventbriteEvents(userCountry, userCity, eventType),
    scrapeMeetUpEvents(userCountry, userCity, eventType),
  ]).then(async (results) => {
    scrappedEventsArray = results[0].concat(results[1]);
    if (scrappedEventsArray && scrappedEventsArray.length > 0) {
      let allScrapedEvents = [];
      const query = { country: userCountry, city: userCity, eventType };
      try {
        // Insert scrapped data to database.
        await Event.insertMany(scrappedEventsArray, { ordered: false });
        // If all succeed get data from database
        allScrapedEvents = await Event.find(query);
        resolve(allScrapedEvents);
      } catch (e) {
      // If some inserts fails get all data from database
        allScrapedEvents = await Event.find(query);
        resolve(allScrapedEvents);
      }
    } else reject(new Error('Events are undefined or not an array!'));
  }).catch(reject);
});

const updateEventsByDates = async (
  userCountry,
  userCity,
  eventType,
  startDate,
  endDate,
) => {
  const scrappedEventsArray = await scrapeByDate(
    userCountry,
    userCity,
    eventType,
    startDate,
    endDate,
  );
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

const addDescription = async (eventId, link, type) => {
  try {
    const description = type === "eventbrite"
      ? await scrapeDescription(link)
      : await scrapeMeetupDescription(link);
    if (eventId) {
      await Event.update(
        { scrapedEventId: eventId },
        {
          $set: { description: description.description },
        },
      );
    }

    return description;
  } catch (error) {
    return false;
  }
};

const findByDate = async (
  startDate,
  endDate,
  userCity,
  userCountry,
  eventType,
) => {
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

const createEvent = async (req, res) => {
  const { file } = req;

  if (file) {
    try {
      const response = await imageUploader(file);
      req.body.imageUrl = response.url;
    } catch (e) {
      res.status(400).json({ message: "Could not create event." });
    }
  } else req.body.imageUrl = "";
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (e) {
    res.status(500).json({ message: e.message || "Could not create event." });
  }
};

const deleteEvent = async (eventId) => {
  try {
    await Event.findOneAndDelete({ _id: eventId });
    return true;
  } catch (error) {
    return error;
  }
};

const updateEventById = async (id, payload) => {
  try {
    await Event.update(
      { _id: id },
      {
        $set: payload,
      },
    );

    return true;
  } catch (error) {
    return error;
  }
};

const getEventByUserId = async (id) => {
  try {
    const event = await Event.find({ author: id });
    return event;
  } catch (error) {
    return false;
  }
};


module.exports = {
  addScrapedEvent,
  findEvent,
  addDescription,
  findByDate,
  deleteEvent,
  updateEventsByDates,
  createEvent,
  updateEventById,
  getEventByUserId,
};
