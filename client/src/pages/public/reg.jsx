// reg.jsx
// Register page - user can sign up as customer or company

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import bgImage from "../../assets/image.png";
import logo from "../../assets/Untitled.png";
import { useApi } from "../../hooks/useAPI";

const Register = () => {
  const navigate = useNavigate();
  const { callApi } = useApi();

  // Track which role user selected (customer or company)
  const [selectedRole, setSelectedRole] = useState("customer");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Watch password field so we can compare with confirm password
  const password = watch("password");

  // This runs when user clicks Register button
  const onSubmit = async (data) => {
    try {
      setErrorMessage("");

      // Send register request to backend with role
      await callApi("POST", "/auth/register", {
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          dob: data.dob,
          role: selectedRole, // ✅ send selected role
        },
      });

      // After register, go to login page
      navigate("/login");

    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[750px] p-6 rounded-3xl flex flex-col md:flex-row
            bg-black/20 backdrop-blur-md
            shadow-[0_0_30px_rgba(168,85,248,0.25)]
            hover:shadow-[0_0_60px_rgba(168,85,248,0.9)]
            transition duration-1000"
        >
          {/* LEFT SIDE - Form */}
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <h1 className="font-bold text-2xl md:text-3xl text-center text-white mb-4">
              Create Account
            </h1>

            {/* ✅ Role Selector - Customer or Company */}
            <div className="mb-4 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-2">
                I am a:
              </label>
              <div className="flex gap-3">
                {/* Customer Button */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("customer")}
                  className={`flex-1 py-2 rounded-lg font-bold transition duration-300 ${
                    selectedRole === "customer"
                      ? "bg-blue-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                      : "bg-blue-500/15 text-white border border-blue-500/30"
                  }`}
                >
                  👤 Customer
                </button>

                {/* Company Button */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("company")}
                  className={`flex-1 py-2 rounded-lg font-bold transition duration-300 ${
                    selectedRole === "company"
                      ? "bg-blue-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                      : "bg-blue-500/15 text-white border border-blue-500/30"
                  }`}
                >
                  🏢 Company
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="mb-3 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">
                {selectedRole === "company" ? "Company Name" : "Full Name"}
              </label>
              <input
                type="text"
                placeholder={selectedRole === "company" ? "Enter company name" : "Enter your full name"}
                {...register("name", { required: "Name is required" })}
                className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 rounded-lg bg-blue-500/15 text-white border-none outline-none"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="mb-3 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 rounded-lg bg-blue-500/15 text-white border-none outline-none"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="mb-3 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">Phone</label>
              <input
                type="text"
                placeholder="Enter phone number"
                {...register("phone", { required: "Phone is required" })}
                className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 rounded-lg bg-blue-500/15 text-white border-none outline-none"
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            {/* Date of Birth */}
            <div className="mb-3 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">Date of Birth</label>
              <input
                type="date"
                {...register("dob", { required: "Date of birth is required" })}
                className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 rounded-lg bg-blue-500/15 text-white border-none outline-none"
              />
              {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob.message}</p>}
            </div>

            {/* Password */}
            <div className="mb-3 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 rounded-lg bg-blue-500/15 text-white border-none outline-none"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-4 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                {...register("confirm_password", {
                  required: "Please confirm password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 rounded-lg bg-blue-500/15 text-white border-none outline-none"
              />
              {errors.confirm_password && (
                <p className="text-red-400 text-xs mt-1">{errors.confirm_password.message}</p>
              )}
            </div>

            {/* Show error message if register fails */}
            {errorMessage && (
              <div className="mb-3 w-full max-w-[400px] mx-auto">
                <p className="text-red-400 text-sm text-center">{errorMessage}</p>
              </div>
            )}

            {/* Company notice */}
            {selectedRole === "company" && (
              <div className="mb-3 w-full max-w-[400px] mx-auto">
                <p className="text-yellow-300 text-xs text-center">
                  ⚠️ Company accounts need admin approval before you can login
                </p>
              </div>
            )}

            {/* Register Button */}
            <div className="w-full max-w-[400px] mx-auto flex justify-center">
              <button
                type="submit"
                className="w-[300px] bg-blue-700 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded-3xl
                  transition duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
              >
                Register as {selectedRole === "company" ? "Company" : "Customer"}
              </button>
            </div>

            {/* Link to Login */}
            <div className="mt-4 text-center">
              <p className="text-white">
                Already have an account?{" "}
                <Link className="text-blue-400" to="/login">Login Here</Link>
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

export default Register;
