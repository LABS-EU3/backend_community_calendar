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
  },
  create: async function(req, res, next) {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("That user already exisits!");
    } else {
      // Insert the new user if they do not exist yet
      user = new Users({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
      });
      await user.save();
      res.status(201).json({
        status: 201,
        message: "User created successfully",
        user
      });
    }
  }
});
