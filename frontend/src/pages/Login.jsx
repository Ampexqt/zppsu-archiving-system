import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.jpg";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "../context/ToastContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Welcome back! Authentication successful.", "Access Granted");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed! Please check your email and password.", "Authentication Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FFFCF7] font-sans selection:bg-[#F2DFB0] selection:text-[#4A0E1C]">
      {/* LEFT PANEL - BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-[#4A0E1C] relative overflow-hidden flex-col justify-between p-12 text-[#FFFCF7]">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C99A2E]/20 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-xl bg-[#FFFCF7] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/")}>
            <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="mt-8 text-4xl font-extrabold text-[#FFFCF7] tracking-tight leading-tight">
            ZPPSU Guidance Office <br />
            <span className="text-[#F2DFB0] font-semibold text-3xl">Digital Archiving System</span>
          </h1>
          <div className="mt-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-[#FFFCF7] shadow-sm">
            <ShieldCheck className="w-4 h-4 mr-2 text-[#C99A2E]" />
            Authorized Personnel Only
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/80 text-lg max-w-md leading-relaxed font-medium">
            Enterprise-grade records management ensuring secure access, instant retrieval, and strict institutional data compliance.
          </p>
          <div className="mt-8 flex items-center gap-4 text-sm text-white/50 font-medium">
            <span>&copy; {new Date().getFullYear()} Zamboanga Peninsula Polytechnic State University</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 md:p-20 relative bg-[#FFFCF7] overflow-y-auto">
        {/* Mobile Logo Header */}
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E8E3E1] shadow-sm cursor-pointer bg-[#FFFCF7]" onClick={() => navigate("/")}>
            <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-[#6B1D2A] tracking-tight">ZPPSU Guidance</span>
        </div>

        <div className="w-full max-w-md mx-auto mt-16 lg:mt-0">
          <div className="text-left mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D1A1B] tracking-tight mb-3">Welcome back</h2>
            <p className="text-[#5F5A5C] text-lg font-medium">Enter your credentials to securely access the system.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1D1A1B] tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5F5A5C]">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@zppsu.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-[#E8E3E1] rounded-xl text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] transition-all bg-[#FFFCF7] hover:border-[#5F5A5C] text-base shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#1D1A1B] tracking-wide">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5F5A5C]">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3.5 border border-[#E8E3E1] rounded-xl text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] transition-all bg-[#FFFCF7] hover:border-[#5F5A5C] text-base shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#5F5A5C] hover:text-[#1D1A1B] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] py-6 rounded-xl font-bold text-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>


        </div>
      </div>
    </div>
  );
}

export default Login;