const bcrypt = require("bcryptjs");
const validate = require("../../resources/users/users.validation");
const Auth = require("./auth");
const { genSaltSync, hashSync } = bcrypt;

module.exports = function(model) {
  return {
    async createUser(req, res) {
      try {
        const { error } = validate.validateUser(req.body);

        if (error) {
          return res
            .status(422)
            .json({ status: 422, error: error.details[0].message });
        }
        const { first_name, last_name, username, email, password } = req.body;
        let doc = await model.findOne({ email, username });
        if (doc) {
          return res.status(409).send("user already exisits!");
        } else {
          // Insert the new user if they do not exist yet
          const salt = genSaltSync(10);
          const hash = hashSync(password, salt);
          doc = new model({
            first_name,
            last_name,
            username,
            email,
            password: hash
          });
          const payload = {
            id: doc.id,
            username: doc.username
          };

          const options = {
            expiresIn: "24h"
          };

          const token = Auth(payload, options);
          await doc.save();

          res.status(201).json({
            status: 201,
            message: "User Created successfully",
            token
          });
        }
      } catch (error) {
        if (error.errmsg.includes("duplicate key error")) {
          return res.status(500).json({
            status: 409,
            errors: "user already exists"
          });
        } else {
          return res.status(500).json({
            status: 500,
            error: "something went wrong"
          });
        }
      }
    }
  };
};
