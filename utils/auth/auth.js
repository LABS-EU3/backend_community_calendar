const jwt = require("jsonwebtoken");

module.exports = function generateToken(payload = {}, options = {}) {
  const token = jwt.sign(payload, process.env.SECRET_KEY, options);

  return token;
};
