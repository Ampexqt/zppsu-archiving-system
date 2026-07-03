import { useState } from "react";

import axios from "axios";

function ForgotPassword() {

  const [step, setStep] =
    useState(1);

  const [email, setEmail] =
    useState("");

  const [otp, setOTP] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  // SEND OTP
  const handleSendOTP =
    async () => {

    try {

      await axios.post(
        "http://localhost:5000/api/otp/send",
        { email }
      );

      alert("OTP sent!");

      setStep(2);

    } catch (error) {

      console.error(error);

      alert("Failed to send OTP");
    }
  };

  // VERIFY OTP
  const handleVerifyOTP =
    async () => {

    try {

      await axios.post(
        "http://localhost:5000/api/otp/verify",
        {
          email,
          otp,
        }
      );

      alert("OTP verified!");

      setStep(3);

    } catch (error) {

      console.error(error);

      alert("Invalid OTP");
    }
  };

  // RESET PASSWORD
  const handleResetPassword =
    async () => {

    try {

      await axios.post(
        "http://localhost:5000/api/otp/reset-password",
        {
          email,
          newPassword,
        }
      );

      alert(
        "Password reset successful!"
      );

      window.location.href =
        "/login";

    } catch (error) {

      console.error(error);

      alert(
        "Failed to reset password"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-center text-[#8B0000] mb-3">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Recover your account
        </p>

        {/* STEP 1 */}
        {step === 1 && (

          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-4 rounded-xl mb-5 outline-none focus:border-[#8B0000]"
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <button
              onClick={
                handleSendOTP
              }
              className="w-full bg-[#8B0000] hover:bg-[#6d0000] text-white py-4 rounded-xl transition"
            >
              Send OTP
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (

          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border border-gray-300 p-4 rounded-xl mb-5 outline-none focus:border-[#8B0000]"
              onChange={(e) =>
                setOTP(
                  e.target.value
                )
              }
            />

            <button
              onClick={
                handleVerifyOTP
              }
              className="w-full bg-[#8B0000] hover:bg-[#6d0000] text-white py-4 rounded-xl transition"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (

          <>
            <input
              type="password"
              placeholder="New Password"
              className="w-full border border-gray-300 p-4 rounded-xl mb-5 outline-none focus:border-[#8B0000]"
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />

            <button
              onClick={
                handleResetPassword
              }
              className="w-full bg-[#8B0000] hover:bg-[#6d0000] text-white py-4 rounded-xl transition"
            >
              Reset Password
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;