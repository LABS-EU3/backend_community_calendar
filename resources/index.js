const express = require('express');

const mainRouter = express.Router();
const users = require('./users/users.route.js');
const event = require('./event/event.route');

mainRouter.use('/api/v1/users', users);
mainRouter.use('/api/v1/event', event);

module.exports = mainRouter;
