const express = require("express");
const router = express.Router();

const userController = require("./users.controller");

router.route("/");

router.route("/register").post(userController.register);

module.exports = router;
