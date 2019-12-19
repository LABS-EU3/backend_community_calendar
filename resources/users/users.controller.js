const express = require("express");
var generateController = require("../../utils/generateControllers");
const Users = require("./users.model");

module.exports = generateController(Users, {
  getAll: function(req, res, next) {
    console.log("hello world");
    Users.find({}, function(err, users) {
      if (err) return next(err);
      res.json(users);
    });
  }
});
