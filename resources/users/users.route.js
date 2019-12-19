const express = require("express");
const router = express.Router();

const Users = require("./users.model");
const controller = require("./users.controller");

router.route("/");

router.route("/register").post(controller.register);

module.exports = router;
