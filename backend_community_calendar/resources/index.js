const express = require('express');
const mainRouter  = express.Router();
const users = require('./users/users.route.js');

mainRouter.use('/api/v1/users', users);


module.exports = mainRouter;