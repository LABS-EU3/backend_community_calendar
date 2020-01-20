const express = require('express');

const router = express.Router();

const favEventsController = require('./favEvents.controller');

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (typeof userId === 'undefined') {
      return res.status(400).json('Please supply valid user id in the query');
    }
    const favEvents = await favEventsController.findFav(userId);
    if (!favEvents.length) {
      return res.status(404).json({ message: 'Favorite events not found' });
    }
    return res.status(200).json({ message: 'Favorite events retrieved successfully', favEvents });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

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
    if (typeof eventId !== 'undefined' && typeof userId !== 'undefined') {
      const deletedFav = await favEventsController.deleteFav(eventId, userId);
      if (!deletedFav) {
        throw new Error('Favorite event not found or could not be removed at this time. Please try again later');
      }
      res.status(200).json({ message: 'Event successfully removed as favorite', deletedFav });
    } else {
      res.status(400).json({ message: 'supply valid favorite eventId and/or userId' });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
