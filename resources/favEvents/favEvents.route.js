const express = require('express');

const router = express.Router();

const userFavController = require('./favEvents.controller');

router.post('/', async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    const savedEvent = await userFavController.saveFav(eventId, userId);
    if (!savedEvent) {
      throw new Error('Event could not be saved at this time. Please try again later');
    }
    res.status(201).json({ message: 'Favorite event saved successfully', savedEvent });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
