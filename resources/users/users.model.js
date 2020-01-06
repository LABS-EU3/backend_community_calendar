const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = Schema({
  first_name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  last_name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 80
  },
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 80
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 80,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 80
  }
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
