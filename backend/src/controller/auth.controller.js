const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const redisClient = require("../config/redisClient");
const { decode } = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.status(201).json({ message: "Registered", userId: user._id });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await redisClient.set(`refresh:${user._id}`, refreshToken);

  res.json({ accessToken, refreshToken });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Token Missing" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const stored = await redisClient.get(`refresh:${decoded.userId}`);

    if (!stored || stored !== refreshToken) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    const newAccessToken = generateAccessToken({ _id: decoded.userId });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
