const mongoose = require("mongoose");

const dbConfig = require('../config/dbConfig');

module.exports = () => {
  return new Promise((resolve) => {
    let url = "";

    switch (process.env.ENVIRONMENT) {
      case "development":
        url = dbConfig.DATABASE_URL_DEVELOPMENT;
        break;

      case "staging":
        url = dbConfig.DATABASE_URL_STAGING;
        break;

      case "test":
        url = dbConfig.DATABASE_URL_TEST;
        break;

      case "production":
        url = dbConfig.DATABASE_URL_PRODUCTION;
        break;

      default:
        url = dbConfig.DATABASE_URL_DEVELOPMENT;
    }

    mongoose.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => {
        resolve(true);
      }
    );
  });
};
