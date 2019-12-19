const Joi = require("joi");

module.exports = function validateUser(user) {
  const schema = {
    first_name: Joi.string()
      .min(2)
      .max(80)
      .required(),
    last_name: Joi.string()
      .min(2)
      .max(80)
      .required(),
    email: Joi.string()
      .min(2)
      .max(80)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(80)
      .required()
  };
  return Joi.validate(user, schema);
};
