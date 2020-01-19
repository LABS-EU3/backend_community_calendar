const express = require('express');

const router = express.Router();

const favEventsController = require('./favEvents.controller');

router.post('/', async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    const savedEvent = await favEventsController.saveFav(eventId, userId);
    if (!savedEvent) {
      throw new Error('Event could not be saved at this time. Please try again later');
    }
    res.status(201).json({ message: 'Favorite event saved successfully', savedEvent });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete('/', async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    if (eventId !== undefined && userId !== undefined) {
      const deletedFav = await favEventsController.deleteFav(eventId, userId);
      if (!deletedFav) {
        throw new Error('Favorite event not found or could not be removed at this time. Please try again later');
      }
      res.status(200).json({ message: 'Event successfully removed as favorite', deletedFav });
    } else {
      res.status(400).json({ message: 'supply valid favorite eventId' });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
