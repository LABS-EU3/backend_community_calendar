const express = require('express');

const router = express.Router();

const favEventsController = require('./favEvents.controller');

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Please supply valid user id in the query' });
    }
    const result = await favEventsController.findFav(userId);

    if (!result) return res.status(500).json({ message: 'Server Error: Could not retrieve fav events' });
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

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  try {
    const { event, userId } = req.body;
    /* Check if event is in database else save it and return it with
    its _id to be used as the faveevent 'eventId' */
    let eventInDatabase;
    if (!event._id) {
      eventInDatabase = await favEventsController.checkIfInDbElseSaveInDb(event);
      if (!eventInDatabase) throw new Error('Couldnt get event from database records to save');
    } else eventInDatabase = event;

    const savedEvent = await favEventsController.saveFav(eventInDatabase._id,
      userId,
      eventInDatabase.scrapedEventId);
    if (!savedEvent) {
      throw new Error('Event could not be saved at this time. Please try again later');
    }
    res.status(201).json({ message: 'Favorite event saved successfully', savedEvent });
  } catch (error) {
    // This is from validation error from the validation mongoose plugin i guess.
    if (error._message === "FavEvent validation failed") {
      return res.status(400).json("You have already added this to favourites!");
    }
    res.status(500).json(error.message || "Failed to save to favourites! ");
  }
});

// eslint-disable-next-line consistent-return
router.delete('/', async (req, res) => {
  try {
    const { event, userId } = req.body;
    if (!event) return res.status(400).json({ message: 'supply valid favorite eventId and/or userId' });
    const deletedFav = await favEventsController.deleteFav(event, userId);
    if (!deletedFav) throw new Error('Favorite event not found or could not be removed at this time. Please try again later');

    res.status(200).json({ message: 'Event successfully removed as favorite', deletedFav });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
