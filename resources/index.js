const express = require('express');

const mainRouter = express.Router();
const users = require('./users/users.route');
const event = require('./event/event.route');
const favorite = require('./favEvents/favEvents.route');

mainRouter.use('/api/v1/users', users);
mainRouter.use('/api/v1/event', event);
mainRouter.use('/api/v1/favorite', favorite);

module.exports = mainRouter;
