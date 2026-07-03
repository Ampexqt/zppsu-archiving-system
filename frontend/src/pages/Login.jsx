import { useState } from "react";

import axios from "axios";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {

    try {

      const response =
        await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email,
            password,
          }
        );

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
  "user",
  JSON.stringify(
    response.data.user
  )
);

      alert("Login successful!");

      window.location.href =
        "/dashboard";

    } catch (error) {

      console.error(error);

      alert("Login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-10">

        {/* TITLE */}
        <h1 className="text-5xl font-bold text-center text-[#8B0000] mb-3">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-10 text-lg">
          Login to your account
        </p>

        {/* EMAIL */}
        <div className="mb-6">

          <label className="block text-lg font-semibold mb-3">
            Email
          </label>

          <input
            type="email"
            placeholder="john@example.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-4 outline-none focus:border-[#8B0000]"
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-8">

          <label className="block text-lg font-semibold mb-3">
            Password
          </label>

          <input
            type="password"
            placeholder="••••••"
            className="w-full border border-gray-300 rounded-xl px-4 py-4 outline-none focus:border-[#8B0000]"
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#8B0000] hover:bg-[#6d0000] text-white py-4 rounded-xl text-xl font-semibold transition"
        >
          Login
        </button>

        {/* LINKS */}
        <div className="text-center mt-6">

          <p className="text-gray-600">

            Don’t have an account?

            <a
              href="/register"
              className="text-[#8B0000] font-semibold ml-2"
            >
              Create account
            </a>

          </p>

          {/* FORGOT PASSWORD */}
          <p className="mt-4">

            <a
              href="/forgot-password"
              className="text-[#8B0000] font-semibold"
            >
              Forgot Password?
            </a>

          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;