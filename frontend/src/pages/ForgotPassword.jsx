import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.jpg";
import { Mail, KeyRound, Lock, ArrowLeft, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useToast } from "../context/ToastContext";

function ForgotPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // STEP 1: SEND OTP
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await axios.post("http://localhost:5000/api/otp/send", { email });
      toast.info("Verification OTP has been sent to your email address.", "OTP Sent");
      setStep(2);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to send verification code. Please check your email.";
      setErrorMessage(msg);
      toast.error(msg, "Error");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: VERIFY OTP
  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await axios.post("http://localhost:5000/api/otp/verify", { email, otp });
      toast.success("Security code verified successfully!", "Code Verified");
      setStep(3);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Invalid or expired verification code.";
      setErrorMessage(msg);
      toast.error(msg, "Verification Failed");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: RESET PASSWORD
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await axios.post("http://localhost:5000/api/otp/reset-password", {
        email,
        newPassword,
      });

      toast.success("Password reset successful! Please log in with your new credentials.", "Password Updated");
      navigate("/login");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to reset password. Please try again.";
      setErrorMessage(msg);
      toast.error(msg, "Reset Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex items-center justify-center px-4 py-12 font-sans selection:bg-[#F2DFB0] selection:text-[#4A0E1C]">
      <div className="bg-[#FFFCF7] w-full max-w-md rounded-2xl shadow-sm border border-[#E8E3E1] p-8">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <div 
            className="w-12 h-12 rounded-full overflow-hidden border border-[#E8E3E1] shadow-xs mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform bg-[#FFFCF7]"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1D1A1B] tracking-tight">
            Account Recovery
          </h1>
          <p className="text-xs text-[#5F5A5C] mt-1">
            Follow the steps to securely reset your password
          </p>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="flex items-center justify-between mb-8 px-2 relative">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#E8E3E1] -z-0"></div>
          <div 
            className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#6B1D2A] -z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 80}%` }}
          ></div>

          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                step > s
                  ? "bg-[#6B1D2A] text-[#FFFCF7]"
                  : step === s
                  ? "bg-[#6B1D2A] text-[#FFFCF7] ring-4 ring-[#6B1D2A]/20"
                  : "bg-[#FFFCF7] border-2 border-[#E8E3E1] text-[#5F5A5C]"
              }`}
            >
              {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#4A0E1C] text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">
                Institutional Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F5A5C]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="user@zppsu.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-[#E8E3E1] rounded-xl text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] transition-all bg-[#FFFCF7] hover:border-[#5F5A5C] text-sm shadow-xs"
                />
              </div>
              <p className="text-[11px] text-[#5F5A5C]">A one-time verification code will be dispatched to this address.</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] py-5 rounded-xl font-bold text-sm shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F5A5C]">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-[#E8E3E1] rounded-xl text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] transition-all bg-[#FFFCF7] hover:border-[#5F5A5C] text-sm tracking-widest font-mono text-center shadow-xs"
                />
              </div>
              <p className="text-[11px] text-[#5F5A5C]">Check your inbox ({email}) for the code.</p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/3 py-5 rounded-xl text-xs font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA]"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !otp}
                className="w-2/3 bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] py-5 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F5A5C]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-[#E8E3E1] rounded-xl text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] transition-all bg-[#FFFCF7] hover:border-[#5F5A5C] text-sm shadow-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !newPassword}
              className="w-full bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] py-5 rounded-xl font-bold text-sm shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Password...</span>
                </>
              ) : (
                <>
                  <span>Confirm New Password</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* RETURN TO LOGIN */}
        <div className="mt-8 pt-6 border-t border-[#E8E3E1] text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B1D2A] hover:underline underline-offset-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;