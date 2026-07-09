import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.jpg";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed! Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-[#FFD700] selection:text-[#800000]">
      {/* LEFT PANEL - BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-[#800000] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FFD700]/20 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-xl bg-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/")}>
            <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="mt-8 text-4xl font-extrabold text-white tracking-tight leading-tight">
            ZPPSU Guidance Office <br />
            <span className="text-white/80 font-semibold text-3xl">Digital Archiving System</span>
          </h1>
          <div className="mt-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-white shadow-sm">
            <ShieldCheck className="w-4 h-4 mr-2 text-[#FFD700]" />
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 md:p-20 relative bg-[#FDFBF7] lg:bg-white overflow-y-auto">
        {/* Mobile Logo Header */}
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-[#800000] tracking-tight">ZPPSU Guidance</span>
        </div>

        <div className="w-full max-w-md mx-auto mt-16 lg:mt-0">
          <div className="text-left mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Welcome back</h2>
            <p className="text-gray-500 text-lg font-medium">Enter your credentials to securely access the system.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@zppsu.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-all bg-white hover:border-gray-300 text-base shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700 tracking-wide">Password</label>
                <a href="/forgot-password" className="text-sm font-bold text-[#800000] hover:text-[#660000] transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-all bg-white hover:border-gray-300 text-base shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
              className="w-full bg-[#800000] text-white hover:bg-[#660000] py-6 rounded-xl font-bold text-lg shadow-[0_4px_14px_0_rgb(128,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(128,0,0,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
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

          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium">
              Don't have an account?{" "}
              <a href="/register" className="text-[#800000] font-bold hover:underline underline-offset-4">
                Request access
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;