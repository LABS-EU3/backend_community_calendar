const express = require("express");
const router = express.Router();
var generateController = require("../../utils/generateControllers");
const Users = require("./users.model");

module.exports = generateController(Users, {
  getAll: function(req, res, next) {
    Users.find({}, function(err, users) {
      if (err) return next(err);
      res.json(users);
    });
  }
});
