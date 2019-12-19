import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 *  Authenticate users
 */
module.exports = function generateToken(_id, email) {
  const token = jwt.sign(
    {
      _id,
      email
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h"
    }
  );

  return token;
};
