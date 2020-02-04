const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const CORS_ORIGIN_WHITELIST = ['http://localhost:3000', 'https://comcalendar.now.sh', 'https://comcal.now.sh', 'https://frontendcommunitycalendar.comcalender.now.sh'];

const corsOptions = {
  origin(origin, callback) {
    if (CORS_ORIGIN_WHITELIST.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} is not allowed by CORS`));
    }
  },
};

module.exports = function expressMiddlewares(app) {
  app.use(morgan("combined"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(helmet());
  app.use(cors())
  // app.use(cors(corsOptions));
};
