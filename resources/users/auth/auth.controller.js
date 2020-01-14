/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
const bcrypt = require("bcryptjs");
const validate = require("../users.validation");
const AuthHelper = require("./auth");

const { genSaltSync, hashSync } = bcrypt;

module.exports = function (Model) {
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

        let doc = await Model.findOne({ email, username });

        if (doc) {
          return res.status(409).send("user already exisits!");
        }
        // Insert the new user if they do not exist yet
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);
        doc = new Model({
          first_name,
          last_name,
          username,
          email,
          password: hash,
        });

        await doc.save();

        res.status(201).json({
          status: 201,
          message: "User Created successfully",
          user: AuthHelper.Auth.toAuthJSON(doc),
        });
      } catch (error) {
        if (error.message.includes("duplicate key error")) {
          return res.status(500).json({
            status: 409,
            errors: "user already exists",
          });
        }
        return res.status(500).json({
          status: 500,
          error: "something went wrong",
        });
      }
    },
    async logIn(req, res) {
      const { error } = validate.validateLogin(req.body);

      if (error) {
        return res
          .status(422)
          .json({ status: 422, error: error.details[0].message });
      }

      const { username, password } = req.body;

      const userInDB = await Model.findOne({ username });

      if (!userInDB) {
        return res.status(400).send("Invalid username or password");
      }

      const userPassword = await bcrypt.compare(password, userInDB.password);

      if (!userPassword) {
        return res.status(400).send("Incorrect email or password.");
      }

      return res.status(200).json({
        user: AuthHelper.Auth.toAuthJSON(userInDB),
      });
    },
  };
};
