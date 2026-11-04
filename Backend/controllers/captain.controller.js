const asyncHandler = require("express-async-handler");
const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const { verifyResetToken, consumeResetToken } = require("../utils/resetToken");
const { isDemoAccount, DEMO_LOCKED_MESSAGE } = require("../utils/demo");

module.exports.registerCaptain = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { fullname, email, password, phone, vehicle } = req.body;

  const alreadyExists = await captainModel.findOne({ email });

  if (alreadyExists) {
    return res.status(400).json({ message: "Captain already exists" });
  }

  const captain = await captainService.createCaptain(
    fullname.firstname,
    fullname.lastname,
    email,
    password,
    phone,
    vehicle.color,
    vehicle.number,
    vehicle.capacity,
    vehicle.type
  );

  const token = captain.generateAuthToken();
  res
    .status(201)
    .json({ message: "Captain registered successfully", token, captain });
});

module.exports.verifyEmail = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Invalid verification link", error: "Token is required" });
    }
  
    let decodedTokenData;
    try {
      decodedTokenData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "You're trying to use an invalid or expired verification link", error: "Invalid token" });
    }
    if (!decodedTokenData || decodedTokenData.purpose !== "email-verification" || decodedTokenData.userType !== "captain") {
      return res.status(400).json({ message: "You're trying to use an invalid or expired verification link", error: "Invalid token" });
    }
  
    let captain = await captainModel.findOne({ _id: decodedTokenData.id });
  
    if (!captain) {
      return res.status(404).json({ message: "User not found. Please ask for another verification link." });
    }
  
    if (captain.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
  
    captain.emailVerified = true;
    await captain.save();
  
    res.status(200).json({
      message: "Email verified successfully",
    });
});

module.exports.loginCaptain = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();
  res.cookie("token", token);
  res.json({ message: "Logged in successfully", token, captain });
});

module.exports.captainProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ captain: req.captain });
});

module.exports.updateCaptainProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  if (isDemoAccount(req.captain.email)) {
    return res.status(403).json({ message: DEMO_LOCKED_MESSAGE });
  }

  const { captainData = {} } = req.body;

  // only these fields can be edited from the profile page
  const update = {};
  if (captainData.fullname) {
    update["fullname.firstname"] = captainData.fullname.firstname;
    update["fullname.lastname"] = captainData.fullname.lastname;
  }
  if (captainData.phone !== undefined) update.phone = captainData.phone;
  if (captainData.vehicle) {
    for (const field of ["color", "number", "capacity", "type"]) {
      if (captainData.vehicle[field] !== undefined) {
        update[`vehicle.${field}`] = captainData.vehicle[field];
      }
    }
  }

  const updatedCaptainData = await captainModel.findOneAndUpdate(
    { _id: req.captain._id },
    { $set: update },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedCaptainData,
  });
});

module.exports.logoutCaptain = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.token;

  await blacklistTokenModel.create({ token });

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports.resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { token, password } = req.body;

  const { payload, expired } = await verifyResetToken(token, "captain");
  if (!payload) {
    if (expired) {
      return res.status(400).json({ message: "This password reset link has expired or is no longer valid. Please request a new one to continue" });
    }
    return res.status(400).json({ message: "The password reset link is invalid or has already been used. Please request a new one to proceed" });
  }

  const captain = await captainModel.findById(payload.id);
  if (!captain) return res.status(404).json({ message: "User not found. Please check your credentials and try again" });

  if (isDemoAccount(captain.email)) {
    return res.status(403).json({ message: DEMO_LOCKED_MESSAGE });
  }

  captain.password = await captainModel.hashPassword(password);
  await captain.save();
  await consumeResetToken(token); // single-use link

  res.status(200).json({ message: "Your password has been successfully reset. You can now log in with your new credentials" });
});
