import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { Eye, EyeOff } from "lucide-react";

function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      password: "",

    });

  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });
  };

  // HANDLE REGISTER
  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const response =
        await axios.post(

          "http://localhost:5000/api/auth/register",

          formData
        );

      alert(
        response.data.message
      );

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data
          ?.message ||
          "Registration failed!"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCF7] px-4 py-12 font-sans selection:bg-[#F2DFB0] selection:text-[#4A0E1C]">
      <div className="bg-[#FFFCF7] p-8 sm:p-10 rounded-2xl shadow-sm border border-[#E8E3E1] w-full max-w-md">
        {/* TITLE */}
        <h1 className="text-3xl font-extrabold text-center text-[#4A0E1C] tracking-tight">
          Create Account
        </h1>

        <p className="text-center text-[#5F5A5C] text-sm mt-2 mb-8">
          Register your institutional account
        </p>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* FULL NAME */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-[#E8E3E1] rounded-xl px-4 py-3 bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 text-sm outline-none focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] transition-all shadow-xs"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">
              Institutional Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@zppsu.edu.ph"
              className="w-full border border-[#E8E3E1] rounded-xl px-4 py-3 bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 text-sm outline-none focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] transition-all shadow-xs"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1D1A1B] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-[#E8E3E1] rounded-xl px-4 py-3 pr-12 bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 text-sm outline-none focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] transition-all shadow-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5F5A5C] hover:text-[#1D1A1B] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#6B1D2A] hover:bg-[#8B3545] text-[#FFFCF7] py-3.5 rounded-xl text-sm font-bold shadow-xs hover:shadow-md transition-all mt-4 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center mt-6 text-xs text-[#5F5A5C]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#6B1D2A] font-bold hover:underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;