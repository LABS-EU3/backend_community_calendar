const morgan = require('morgan');
const express = require('express');

module.exports = function(app) {
  app.use(morgan);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};
