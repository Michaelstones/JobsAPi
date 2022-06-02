const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name "],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      "please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getToken = function () {
  return jwt.sign(
    { userId: this._id, user: this.name },
    process.env.MY_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};

UserSchema.methods.comparePassWord = function (pasword) {
  const isMatch = bcrypt.compare(pasword, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", UserSchema);
