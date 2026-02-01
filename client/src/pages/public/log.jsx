import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../assets/image.png";
import logo from "../../assets/Untitled.png";
import { useApi } from "../../hooks/useAPI";
import { logSchema } from "../../schema/log.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const Login = () => {
  const navigate = useNavigate();
  const { callApi } = useApi();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(logSchema),
  });

  const handleLogin = async (data) => {
    try {
      const res = await callApi("POST", "/auth/login", { data });
      const token = res?.data?.data?.access_token;
      if (!token) throw new Error("Login failed: No token received");
      localStorage.setItem("access_token", token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.message);
      alert(err.message); // optional: show error to user
    }
  };

  return (
    <div
      className="bg-[center_20%] min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen w-full flex items-center justify-center bg-opacity-100">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="w-[750px] h-[450px] p-6 rounded-3xl shadow-md flex bg-black/20 backdrop-blur-md
            shadow-[0_0_30px_rgba(168,85,248,0.25)]
            hover:shadow-[0_0_60px_rgba(168,85,248,0.9)]
            transition duration-1000"
        >
          {/* LEFT SIDE */}
          <div className="w-2/3 flex flex-col justify-center">
            <h1 className="font-bold text-3xl text-center text-white mb-6">Login</h1>

            {/* Email */}
            <div className="mb-4 w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-2">Email</label>
              <input
                type="text"
                placeholder="Enter your email address"
                {...register("email", { required: "Email is required..." })}
                className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
              />
              {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="mb-8 w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required..." })}
                className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
              />
              {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>}
            </div>

            {/* Login Button */}
            <div className="w-[400px] mx-auto flex justify-center">
              <button className="flex items-center justify-center w-[300px] bg-blue-700 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded-3xl transition duration-900 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                Login
              </button>
            </div>

            {/* Links */}
            <div className="mt-4 text-center">
              <p className="text-white">
                Don't have an account?{" "}
                <Link className="text-blue-600" to="/register">Register Here</Link>
              </p>
              <p className="mt-2">
                <Link className="text-blue-600" to="/forgot-password">Forgot Password?</Link>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE (Logo) */}
          <div className="w-1/3 flex items-center justify-center">
            <img src={logo} alt="Logo" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
