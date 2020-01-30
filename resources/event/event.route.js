/* eslint-disable max-len */
const express = require("express");

const router = express.Router();
const eventController = require("./event.controller");
const User = require('../users/users.model');
const uploadToMemory = require("../../utils/uploads/upload");
const validateToken = require("../../utils/validateToken");
const validator = require('./event.validation');


router.post("/fetch-events", async (req, res, next) => {
  try {
    const { userCity, userCountry, eventType } = req.body;
    const events = await eventController.addScrapedEvent(
      userCountry,
      userCity,
      eventType,
    );
    if (!events) {
      res
        .status(500)
        .json("Events could not be inserted or they already exist");
    }
    res.status(200).json(events);
  } catch (error) {
    next(new Error(error));
  }
});

router.post("/fetch-description", async (req, res, next) => {
  try {
    const { link, eventId, type } = req.body;
    const events = await eventController.addDescription(eventId, link, type);
    if (!events) {
      res.status(404).json("No description available for this event");
    }
    res.status(200).json(events);
  } catch (error) {
    next(new Error(error));
  }
});

router.post("/fetch-date", async (req, res, next) => {
  try {
    const { userCity, userCountry, startDate, endDate, eventType } = req.body;
    const dbUpdate = await eventController.updateEventsByDates(
      userCountry,
      userCity,
      eventType,
      startDate,
      endDate,
    );

    if (!dbUpdate) {
      res.status(404).json("No events found for this date");
    }
    res.status(200).json(dbUpdate);
  } catch (error) {
    next(new Error(error));
  }
});

router.delete('/delete-event', validateToken, async (req, res, next) => {
  try {
    const { eventId, userId } = req.body;
    const user = await User.findById({ _id: userId });
    if (!user) {
      res.status(400).json('User does not exist');
    }
    const deletedEvent = await eventController.deleteEvent(eventId);
    if (!deletedEvent) {
      res.status(400).json("Event does not exist");
    }
    res.status(200).json('Event successfully deleted');
  } catch (error) {
    next(new Error(error));
  }
});

router.post("/create-event", validateToken, validator.validateImageType, uploadToMemory, validator.validateBody, eventController.createEvent);

router.post("/update-event/:id", async (req, res) => {
  try {
    const update = await eventController.updateEventById(req.params.id, req.body);

    if (update) {
      res.status(200).json({ message: 'event updated successfully' });
    } else {
      res.status(400).json({ message: 'an error occurred' });
    }
  } catch (error) {
    res.status(400).json("an error occurred");
  }
});

module.exports = router;
