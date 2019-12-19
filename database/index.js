const mongoose = require("mongoose");

const connectionUrl = require("../config/dbConfig");

module.exports = async () => {
  try {
    await mongoose.connect(connectionUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Database");
  } catch (e) {
    console.log(`Connection to database failed: ${e.message}`);
  }
};
