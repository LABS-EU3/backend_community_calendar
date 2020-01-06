var generateController = require("../../utils/generateControllers");
const Users = require("./users.model");
const authController = require("../../utils/auth/auth.controller");

module.exports = generateController(Users, {
  getAll: function(req, res, next) {
    console.log("hello world");
    Users.find({}, function(err, users) {
      if (err) return next(err);
      res.json(users);
    });
  },
  register: function(req, res, next) {
    authController(Users).createUser(req, res, next);
  },
  signin: function (req, res) {
    authController(Users).logIn(req, res);
  }
});
