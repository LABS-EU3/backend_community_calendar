const express = require("express");

const router = express.Router();
const eventController = require("./event.controller");

router.get('/fetch-events', async (req, res, next) => {
  try {
    eventController.addScrapedEvent().then(() => {
      // const event = await eventController.findEvent();
      eventController.findEvent().then((event) => {
        res
          .status(200)
          .json(event);
      });
    });
  } catch (error) {
    next(new Error(error));
  }
});

module.exports = router;
