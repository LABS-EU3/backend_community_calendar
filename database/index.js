const mongoose = require("mongoose");

const dbConfig = require("../config/dbConfig");

module.exports = async () => {
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

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to Database");
  } catch (e) {
    console.log("Connection To Database Failed");
  }
};
