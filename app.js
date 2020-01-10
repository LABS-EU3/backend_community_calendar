require("dotenv").config();
const express = require("express");

const expressMiddlewares = require("./utils/middlewares");
const resources = require("./resources");
const connectDB = require("./database");

const app = express();

app.use(express.json());
middleware(app);

app.use(resources);

connectDB();

app.get('/', (req, res, next) => {
  try {
    res
      .status(200)
      .json({
        message: 'Welcome to Community Calendar API',
      });
  } catch (error) {
    next(new Error(error));
  }
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res
    .status(err.status || 500)
    .json({ message: err.message });
  next();
});

module.exports = app;
