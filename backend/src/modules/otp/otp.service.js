const nodemailer = require("nodemailer");

// GENERATE OTP
const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// SEND OTP
const sendOTPEmail = async (
  email,
  otp
) => {

  const mailOptions = {
    from: process.env.EMAIL_USER,

    to: email,

    subject:
      "ZPPSU Archive System OTP Verification",

    html: `
      <div style="font-family: Arial; padding: 20px;">
        
        <h2 style="color:#8B0000;">
          OTP Verification
        </h2>

        <p>
          Your OTP code is:
        </p>

        <h1 style="letter-spacing:5px;">
          ${otp}
        </h1>

        <p>
          This OTP will expire in 5 minutes.
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  generateOTP,
  sendOTPEmail,
};