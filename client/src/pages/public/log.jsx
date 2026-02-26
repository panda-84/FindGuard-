// log.jsx
// Login page - user enters email and password
// After login, redirects to correct page based on role

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import bgImage from "../../assets/image.png";
import logo from "../../assets/Untitled.png";
import { useApi } from "../../hooks/useAPI";

const Login = () => {
  const navigate = useNavigate();
  const { callApi } = useApi();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // This runs when user clicks Login button
  const handleLogin = async (data) => {
    try {
      setErrorMessage("");

      // Send login request to backend
      const res = await callApi("POST", "/auth/login", { data });

      // Get token and role from response
      const token = res?.data?.data?.access_token;
      const role = res?.data?.data?.role;

      // If no token received, something went wrong
      if (!token) throw new Error("Login failed: No token received");

      // Save token in localStorage so we stay logged in
      localStorage.setItem("access_token", token);
      // Save role too so we can use it anywhere
      localStorage.setItem("role", role);

      // ✅ Redirect to correct page based on role
      if (role === "admin") {
        // Super admin goes to superadmin dashboard
        navigate("/superadmin");

      } else if (role === "company") {
        // Company goes to company admin dashboard
        navigate("/admin");

      } else {
        // Customer goes to customer dashboard
        navigate("/dashboard");
      }

    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="w-full max-w-[750px] h-auto md:h-[450px] p-6 rounded-3xl flex flex-col md:flex-row
            bg-black/20 backdrop-blur-md
            shadow-[0_0_30px_rgba(168,85,248,0.25)]
            hover:shadow-[0_0_60px_rgba(168,85,248,0.9)]
            transition duration-1000"
        >
          {/* LEFT SIDE - Form */}
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <h1 className="font-bold text-2xl md:text-3xl text-center text-white mb-6">
              Login
            </h1>

            {/* Email */}
            <div className="mb-4 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-2">Email</label>
              <input
                type="text"
                placeholder="Enter your email address"
                {...register("email", { required: "Email is required" })}
                className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 rounded-lg bg-blue-500/15 text-white border-none outline-none"
              />
              {errors.email && (
                <p className="text-red-400 text-xs italic mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 rounded-lg bg-blue-500/15 text-white border-none outline-none"
              />
              {errors.password && (
                <p className="text-red-400 text-xs italic mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Show error if login fails */}
            {errorMessage && (
              <div className="mb-4 w-full max-w-[400px] mx-auto">
                <p className="text-red-400 text-sm text-center">{errorMessage}</p>
              </div>
            )}

            {/* Login Button */}
            <div className="w-full max-w-[400px] mx-auto flex justify-center">
              <button
                type="submit"
                className="w-[300px] bg-blue-700 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded-3xl
                  transition duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
              >
                Login
              </button>
            </div>

            {/* Links */}
            <div className="mt-4 text-center">
              <p className="text-white">
                Don't have an account?{" "}
                <Link className="text-blue-400" to="/register">Register Here</Link>
              </p>
              <p className="mt-2">
                <Link className="text-blue-400" to="/forgot-password">Forgot Password?</Link>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - Logo */}
          <div className="hidden md:flex w-1/3 items-center justify-center">
            <img src={logo} alt="Logo" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
