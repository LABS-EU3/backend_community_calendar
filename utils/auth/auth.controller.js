const bcrypt = require("bcryptjs");
const validate = require("../../resources/users/users.validation");
const Auth = require("./auth");
const { genSaltSync, hashSync } = bcrypt;

module.exports = function(model) {
  return {
    async createUser(req, res) {
      const { error } = validate.validateUser(req.body);

      if (error) {
        return res
          .status(422)
          .json({ status: 422, error: error.details[0].message });
      }
      const { first_name, last_name, username, email, password } = req.body;
      let doc = await model.findOne({ email: req.body.email });
      if (doc) {
        return res.status(400).send("That user already exisits!");
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
      return res.status(500).json({
        status: 500,
        errors: "Something went wrong, try again"
      });
    },
    async logIn(req, res) {
      const { error } = validate.validateLogin(req.body);

      if (error) {
        return res
          .status(422)
          .json({ status: 422, error: error.details[0].message });
      }
      const { username, password } = req.body;
      let user = await model.findOne({ username });
      if (!user) {
        return res.status(400).send("Invalid username or password");
      }
      return res.status(200).json({ user });
      // const correctPassword = awaitbcrypt.compare({})
      
    }
  };
};
