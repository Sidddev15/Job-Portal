const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const redisClient = require("../config/redisClient");
const jwt = require("jsonwebtoken");

exports.register = async ({ name, email, password }) => {
  if (!name || !email || !password)
    throw { statusCode: 400, message: "Missing fields" };

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  return { message: "Registered", userId: user._id };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw { statusCode: 401, message: "Invalid Credentials" };
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await redisClient.set(`refresh:${user._id}`, refreshToken);

  return { accessToken, refreshToken };
};

exports.refreshToken = async (refreshToken) => {
  if (!refreshToken) throw { message: "Token Missing" };

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  const stored = await redisClient.get(`refresh:${decoded.userId}`);

  if (!stored || stored !== refreshToken) {
    throw { message: "Invalid Token" };
  }

  const newAccessToken = generateAccessToken({ _id: decoded.userId });
  return { accessToken: newAccessToken };
};
