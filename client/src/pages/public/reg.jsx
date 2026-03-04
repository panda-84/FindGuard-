import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import bgImage from "../../assets/image.png";
import logo    from "../../assets/Untitled.png";
import { useApi } from "../../hooks/useAPI";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { callApi } = useApi();

  const [selectedRole,  setSelectedRole]  = useState("customer");
  const [errorMessage,  setErrorMessage]  = useState("");
  const [showPassword,  setShowPassword]  = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      await callApi("POST", "/auth/register", {
        data: {
          name:     data.name,
          email:    data.email,
          password: data.password,
          phone:    data.phone,
          dob:      data.dob,
          role:     selectedRole,
        },
      });
      navigate("/login");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const inputClass = `w-full px-3 py-2 rounded-lg bg-blue-500/15 text-white
    border-none outline-none placeholder-blue-300/50
    hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition`;

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[750px] p-6 rounded-3xl flex flex-col md:flex-row
            bg-black/20 backdrop-blur-md
            shadow-[0_0_30px_rgba(168,85,248,0.25)]
            hover:shadow-[0_0_60px_rgba(168,85,248,0.9)] transition duration-1000"
        >
          {/* LEFT - Form */}
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <h1 className="font-bold text-2xl md:text-3xl text-center text-white mb-4">
              Create Account
            </h1>

            {/* Role Selector */}
            <div className="mb-4 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-2">I am a:</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setSelectedRole("customer")}
                  className={`flex-1 py-2 rounded-lg font-bold transition duration-300 ${
                    selectedRole === "customer"
                      ? "bg-blue-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                      : "bg-blue-500/15 text-white border border-blue-500/30"
                  }`}>
                  👤 Customer
                </button>
                <button type="button" onClick={() => setSelectedRole("company")}
                  className={`flex-1 py-2 rounded-lg font-bold transition duration-300 ${
                    selectedRole === "company"
                      ? "bg-blue-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                      : "bg-blue-500/15 text-white border border-blue-500/30"
                  }`}>
                  🏢 Company
                </button>
              </div>
            </div>

            {/* Name - max 30 chars */}
            <div className="mb-3 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">
                {selectedRole === "company" ? "Company Name" : "Full Name"}
              </label>
              <input
                type="text"
                placeholder={selectedRole === "company" ? "Enter company name" : "Enter your full name"}
                maxLength={30}
                {...register("name", {
                  required:  "Name is required",
                  minLength: { value: 2,  message: "Name must be at least 2 characters" },
                  maxLength: { value: 30, message: "Name cannot exceed 30 characters" },
                  pattern: {
                    value:   /^[a-zA-Z\s]+$/,
                    message: "Name can only contain letters and spaces",
                  },
                })}
                className={inputClass}
              />
              <div className="flex justify-between mt-1">
                {errors.name
                  ? <p className="text-red-400 text-xs">{errors.name.message}</p>
                  : <span />
                }
                <p className="text-blue-300 text-xs">{watch("name")?.length || 0}/30</p>
              </div>
            </div>

            {/* Email */}
            <div className="mb-3 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                maxLength={50}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email (e.g. name@gmail.com)",
                  },
                })}
                className={inputClass}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone - numbers only, 10 digits */}
            <div className="mb-3 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                maxLength={10}
                {...register("phone", {
                  required:  "Phone number is required",
                  pattern: {
                    value:   /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                })}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) e.preventDefault();
                }}
                className={inputClass}
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            {/* Date of Birth */}
            <div className="mb-3 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">Date of Birth</label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("dob", {
                  required: "Date of birth is required",
                  validate: (value) => {
                    const age = new Date().getFullYear() - new Date(value).getFullYear();
                    if (age < 18) return "You must be at least 18 years old";
                    if (age > 100) return "Enter a valid date of birth";
                    return true;
                  },
                })}
                className={inputClass}
              />
              {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob.message}</p>}
            </div>

            {/* Password with show/hide */}
            <div className="mb-3 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  maxLength={30}
                  {...register("password", {
                    required:  "Password is required",
                    minLength: { value: 6,  message: "Password must be at least 6 characters" },
                    maxLength: { value: 30, message: "Password cannot exceed 30 characters" },
                    pattern: {
                      value:   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: "Must have uppercase, lowercase and a number",
                    },
                  })}
                  className={inputClass + " pr-10"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition text-lg">
                  {showPassword
  ? <EyeOff className="w-5 h-5" />
  : <Eye    className="w-5 h-5" />
}

                </button>
              </div>
              {errors.password
                ? <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                : <p className="text-blue-300 text-xs mt-1">Uppercase + lowercase + number required</p>
              }
            </div>

            {/* Confirm Password with show/hide */}
            <div className="mb-4 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  maxLength={30}
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                  className={inputClass + " pr-10"}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition text-lg">
                  {showPassword
  ? <EyeOff className="w-5 h-5" />
  : <Eye    className="w-5 h-5" />
}

                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-400 text-xs mt-1">{errors.confirm_password.message}</p>
              )}
            </div>

            {/* API Error */}
            {errorMessage && (
              <div className="mb-3 w-full max-w-[400px] mx-auto">
                <p className="text-red-400 text-sm text-center">❌ {errorMessage}</p>
              </div>
            )}

            {/* Company notice */}
            {selectedRole === "company" && (
              <div className="mb-3 w-full max-w-[400px] mx-auto">
                <p className="text-yellow-300 text-xs text-center">
                  ⚠️ Company accounts need admin approval before you can use the dashboard
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="w-full max-w-[400px] mx-auto flex justify-center">
              <button type="submit"
                className="w-[300px] bg-blue-700 hover:bg-blue-300 text-white font-bold
                  py-2 px-4 rounded-3xl transition duration-300
                  hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]">
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

          {/* RIGHT - Logo */}
          <div className="hidden md:flex w-1/3 items-center justify-center">
            <img src={logo} alt="Logo" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;