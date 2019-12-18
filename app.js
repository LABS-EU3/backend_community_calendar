const express = require('express');
require("dotenv").config();

const middleware = require('./utils/middlewares');
const resources = require('./resources');
const db = require('./database');

const app = express();

middleware(app);

app.use(resources);

(async () => {
  try {
    const conn = await db();
    if (conn) {
      console.log('connected to database');
    }
  } catch (e) {
     console.log('Failed to connect to database');
  }
})();

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
