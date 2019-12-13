const express = require('express');
const router = express.Router();
const controller = require('./users.controller');

router.route('/')
    .get(controller.getAll)


module.exports = router;