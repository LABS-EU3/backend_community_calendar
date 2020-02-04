const express = require('express');

const router = express.Router();

const favEventsController = require('./favEvents.controller');

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Please supply valid user id in the query' });
    }
    const result = favEventsController.findFav(userId);
    if (result instanceof Error) {
      return res.status(500).json({ message: result.message });
    }
    if (result && result.length === 0) {
      return res.status(404).json({ message: 'Favorite events not found' });
    }
    return res.status(200).json({ message: 'Favorite events retrieved successfully', result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    console.log('req.body = ', req.body);
    const savedEvent = await favEventsController.saveFav(eventId, userId);
    console.log('savedEvent = '+savedEvent)
    if (!savedEvent) {
      throw new Error('Event could not be saved at this time. Please try again later');
    }
    res.status(201).json({ message: 'Favorite event saved successfully', savedEvent });
  } catch (error) {
    console.log('savedEventError = '+error.message)

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
