const express = require('express');

const router = express.Router();

const favEventsController = require('./favEvents.controller');

router.get('/', async (req, res) => {
  try {
    const { u } = req.query;
    if (typeof u === 'undefined') {
      res.status(400).json('Please supply valid id in the query');
    } else {
      const favEventsId = await favEventsController.findFav(u);
      if (!favEventsId) {
        throw new Error('Favorite events could not be retrieved at this time. Please try again later');
      }
      const favEvents = await favEventsController.findEvents(favEventsId);
      if (!favEvents) {
        throw new Error('Favorite events could not be retrieved at this time. Please try again later');
      }
      res.status(200).json({ message: 'Favorite events retrieved successfully', favEvents });
    }
  } catch (error) {
    res.status(500).json(error.message);
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
