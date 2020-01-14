/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");

const Auth = {
  toAuthJSON(user) {
    return {
      _id: user._id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      token: this.generateToken(user),
    };
  },
  generateToken(user) {
    const payload = {
      id: user._id,
    };

    const options = {
      expiresIn: "24h",
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, options);

    return token;
  },
};

module.exports = {
  Auth,
};
