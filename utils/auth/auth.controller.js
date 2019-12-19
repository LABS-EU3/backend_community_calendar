const bcrypt = require("bcryptjs");
const validate = require("../../resources/users/users.validation");
const { genSaltSync, hashSync } = bcrypt;

module.exports = function(model) {
  return {
    createUser: async function(req, res) {
      const { error } = validate(req.body);

      if (error) {
        return res
          .status(422)
          .json({ status: 422, error: error.details[0].message });
      }
      const { first_name, last_name, email, password } = req.body;
      let doc = await model.findOne({ email: req.body.email });
      if (doc) {
        return res.status(400).send("That user already exisits!");
      } else {
        // Insert the new user if they do not exist yet
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);
        doc = new model({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: hash
        });
        await doc.save();
        res.status(201).json({
          status: 201,
          message: "Created successfully",
          user: doc
        });
      }
      return res.status(400).json({
        status: 400,
        errors: "Something went wrong, try again"
      });
    }
  };
};
