const otpService = require("./otp.service");

const bcrypt = require("bcrypt");

const { PrismaClient } =
  require("@prisma/client");

const prisma = new PrismaClient();

// TEMP OTP STORAGE
const otpStore = {};

// SEND OTP
const sendOTP = async (req, res) => {
  try {

    const { email } = req.body;

    // GENERATE OTP
    const otp =
      otpService.generateOTP();

    // SAVE OTP
    otpStore[email] = otp;

    // SEND EMAIL
    await otpService.sendOTPEmail(
      email,
      otp
    );

    res.status(200).json({
      message:
        "OTP sent successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// VERIFY OTP
const verifyOTP = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const savedOTP =
      otpStore[email];

    if (savedOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    res.status(200).json({
      message:
        "OTP verified successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// RESET PASSWORD
const resetPassword = async (
  req,
  res
) => {
  try {

    const {
      email,
      newPassword,
    } = req.body;

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    // UPDATE USER
    await prisma.users.update({
      where: {
        email,
      },

      data: {
        password:
          hashedPassword,
      },
    });

    // DELETE OTP
    delete otpStore[email];

    res.status(200).json({
      message:
        "Password reset successful",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  resetPassword,
};