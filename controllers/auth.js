const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.getToken();
  res.status(StatusCodes.CREATED).json({ user: user.name, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const isPWDCorrect = user.comparePassWord(password);
  if (!isPWDCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = user.getToken();
  res.status(StatusCodes.OK).json({ user: user.name, token });
};

module.exports = {
  login,
  register,
};
