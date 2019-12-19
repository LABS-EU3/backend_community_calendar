const express = require("express");
const router = express.Router();
const controller = require("./users.controller");

router.route("/").post(controller.create);

module.exports = router;
