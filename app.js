require("dotenv").config();
const express = require("express");

const expressMiddlewares = require("./utils/middlewares");
const resources = require("./resources");
const connectDB = require("./database");

const app = express();

expressMiddlewares(app);

app.use(resources);

connectDB();

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(err.status).json({ message: err.message });
});

module.exports = app;
