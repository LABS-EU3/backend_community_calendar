const express = require("express");

const router = express.Router();
const eventController = require("./event.controller");

router.post('/fetch-events', async (req, res, next) => {
  try {
    const { userCity, userCountry, eventType } = req.body;
    const events = await eventController.addScrapedEvent(userCountry, userCity, eventType);
    if (!events) {
      res
        .status(500)
        .json('Events could not be inserted or they already exist');
    }
    res
      .status(200)
      .json(events);
  } catch (error) {
    next(new Error(error));
  }
});

router.post('/fetch-description', async (req, res, next) => {
  try {
    const { link, eventId } = req.body;
    const events = await eventController.addDescription(eventId, link);
    if (!events) {
      res
        .status(404)
        .json('No description found, check sent link');
    }
    res
      .status(200)
      .json(events);
  } catch (error) {
    next(new Error(error));
  }
});

module.exports = router;
