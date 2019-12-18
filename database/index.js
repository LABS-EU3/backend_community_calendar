const mongoose = require("mongoose");

module.exports = () => {
  return new Promise((resolve) => {
    let url = "";

    switch (process.env.ENVIRONMENT) {
      case "development":
        url = process.env.DATABASE_URL_DEVELOPMENT;
        break;

      case "staging":
        url = process.env.DATABASE_URL_STAGING;
        break;

      case "test":
        url = process.env.DATABASE_URL_TEST;
        break;

      case "production":
        url = process.env.DATABASE_URL_PRODUCTION;
        break;

      default:
        url = process.env.DATABASE_URL_TEST;
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
