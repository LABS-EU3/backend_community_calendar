const db = require("./");

module.exports = async () => {
  try {
    const conn = await db();
    if (conn) {
      console.log("connected to database");
    }
  } catch (e) {
    console.log("Failed to connect to database");
  }
};
