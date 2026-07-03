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

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        {/* TITLE */}
        <h1 className="text-5xl font-bold text-center text-[#8B0000]">

          Create Account

        </h1>

        <p className="text-center text-gray-500 mt-4 mb-10">

          Register your account

        </p>

        {/* FORM */}
        <form
          onSubmit={
            handleRegister
          }
          className="space-y-6"
        >

          {/* FULL NAME */}
          <div>

            <label className="block mb-2 font-semibold">

              Full Name

            </label>

            <input
              type="text"
              name="name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              placeholder="Enter your full name"
              className="w-full border rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-[#8B0000]"
              required
            />

          </div>

          {/* EMAIL */}
          <div>

            <label className="block mb-2 font-semibold">

              Email

            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Enter your email"
              className="w-full border rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-[#8B0000]"
              required
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block mb-2 font-semibold">

              Password

            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your password"
                className="w-full border rounded-xl px-4 py-4 pr-12 outline-none focus:ring-2 focus:ring-[#8B0000]"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >

                {showPassword ? (
                  <EyeOff
                    size={20}
                  />
                ) : (
                  <Eye
                    size={20}
                  />
                )}

              </button>

            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#8B0000] hover:bg-red-900 text-white py-4 rounded-xl text-xl font-bold transition"
          >

            Create Account

          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-center mt-8 text-gray-600">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-[#8B0000] font-bold"
          >

            Login

          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;