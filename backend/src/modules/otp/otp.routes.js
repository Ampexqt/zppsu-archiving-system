const express = require("express");

const router = express.Router();

const otpController =
  require("./otp.controller");

// SEND OTP
router.post(
  "/send",
  otpController.sendOTP
);

// VERIFY OTP
router.post(
  "/verify",
  otpController.verifyOTP
);

// RESET PASSWORD
router.post(
  "/reset-password",
  otpController.resetPassword
);

module.exports = router;