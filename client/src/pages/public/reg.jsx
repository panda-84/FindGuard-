import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../assets/image.png";
import logo from "../../assets/Untitled.png";
import { useApi } from "../../hooks/useAPI";
import { RegisterSchema } from "../../schema/reg.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const { callApi } = useApi();
  const [backendSuccess, setBackendSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

const handleRegister = async (data) => {
  try {
    const payload = {
      name: data.name,       // must match Sequelize
      email: data.email,
      password: data.password,
      phone: data.phone,
      dob: data.dob,
    };

    const res = await callApi("POST", "/auth/register", { data: payload });
    setBackendSuccess(res.data.message || "Registered successfully");
    reset();
    setTimeout(() => navigate("/login"), 1500);
  } catch (err) {
    console.error(err.message);
    alert(err.message);
  }
};


  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen w-full flex items-center justify-center bg-opacity-100">
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="w-[950px] h-[550px] rounded-3xl shadow-md flex bg-black/20 backdrop-blur-md
           
            hover:shadow-[0_0_40px_rgba(168,85,247,0.9)]
            shadow-[0_0_20px_rgba(168,85,248,0.5)]
            transition duration-300 p-14"
        >
          {/* LEFT SIDE (Form) */}
          <div className="w-2/3 flex flex-col justify-center">
            <h1 className="font-bold text-3xl text-center text-white mb-6">Register</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto">
              {/* Name */}
              <div>
                <label className="block text-white text-sm mb-2">Full Name *</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("name")}
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white text-sm mb-2">Phone *</label>
                <input
                  type="tel"
                  maxLength="10"
                  pattern="[0-9]{10}"
                  placeholder="Phone"
                  {...register("phone")}
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* DOB */}
              <div>
                <label className="block text-white text-sm mb-2">Date of Birth *</label>
                <input
                  type="date"
                  {...register("dob")}
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white text-sm mb-2">Password *</label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white text-sm mb-2">Confirm Password *</label>
                <input
                  type="password"
                  {...register("confirm_password")}
                  placeholder="Confirm Password"
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
              </div>
            </div>

            {/* Register Button */}
            <div className="w-[400px] mx-auto flex justify-center mt-6">
              <button className="flex items-center justify-center w-[300px] bg-blue-700 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded-3xl transition duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                Register
              </button>
            </div>

            {/* Already have account */}
            <div className="mt-4 text-center">
              <p className="text-white">
                Already have an account?{" "}
                <Link className="text-blue-600" to="/login">Login Here</Link>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE (Logo) */}
          <div className="w-1/3 flex items-center justify-center">
            <img src={logo} alt="Logo" />
          </div>
        </form>

        {/* Success message */}
        {backendSuccess && (
          <p className="text-green-500 text-center mt-4">{backendSuccess}</p>
        )}
      </div>
    </div>
  );
};

export default Register;
