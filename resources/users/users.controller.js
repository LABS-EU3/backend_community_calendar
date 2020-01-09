const generateController = require("../../utils/generateControllers");
const Users = require("./users.model");
const authController = require("../../utils/auth/auth.controller");

module.exports = generateController(Users, {
  getAll(req, res, next) {
    Users.find({}, (err, users) => {
      if (err) return next(err);
      return res.json(users);
    });
  },
  register(req, res, next) {
    authController(Users).createUser(req, res, next);
  },
  signin(req, res) {
    authController(Users).logIn(req, res);
  },
});
