const express = require("express");

const router = express.Router();
const eventController = require("./event.controller");

router.get('/fetch-events', async (req, res, next) => {
  try {
    const events = await eventController.addScrapedEvent();
    res
      .status(200)
      .json(events);
  } catch (error) {
    next(new Error(error));
  }
});

module.exports = router;
