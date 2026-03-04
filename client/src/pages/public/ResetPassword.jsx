import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import bgImage from "../../assets/image.png";
import logo from "../../assets/Untitled.png";
import { useApi } from "../../hooks/useAPI";

const ResetPassword = () => {
  const { callApi } = useApi();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    if (!token) return setError("Invalid or missing reset token.");
    setLoading(true); setError("");
    try {
      await callApi("POST", "/auth/reset-password", { data: { token, password: data.password } });
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Reset failed. Link may have expired.");
    } finally { setLoading(false); }
  };

  const inp = `w-full px-3 py-2 rounded-lg bg-blue-500/15 text-white border-none outline-none hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition`;

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <form onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[750px] h-auto md:h-[450px] p-6 rounded-3xl flex flex-col md:flex-row bg-black/20 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,248,0.5)] hover:shadow-[0_0_40px_rgba(168,85,248,0.9)] transition duration-300">
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <h1 className="font-bold text-2xl md:text-3xl text-center text-white mb-4">Reset Password</h1>
            {done ? (
              <div className="text-center space-y-4">
                <p className="text-4xl">✅</p>
                <p className="text-green-400 font-bold text-lg">Password reset successfully!</p>
                <p className="text-gray-300 text-sm">Redirecting to login...</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-300 text-center mb-6">Enter your new password below</p>
                <div className="mb-4 w-full max-w-[400px] mx-auto">
                  <label className="block text-white text-sm font-bold mb-2">New Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="Min 6 characters" maxLength={30}
                      {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: "Must have uppercase, lowercase and a number" } })}
                      className={inp + " pr-10"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div className="mb-6 w-full max-w-[400px] mx-auto">
                  <label className="block text-white text-sm font-bold mb-2">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirm ? "text" : "password"} placeholder="Repeat your password" maxLength={30}
                      {...register("confirm", { required: "Please confirm your password", validate: v => v === password || "Passwords do not match" })}
                      className={inp + " pr-10"} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm.message}</p>}
                </div>
                {error && <p className="text-red-400 text-sm text-center mb-4">❌ {error}</p>}
                <div className="w-full max-w-[400px] mx-auto flex justify-center">
                  <button type="submit" disabled={loading}
                    className="w-[300px] bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded-3xl transition duration-300 disabled:opacity-50">
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
                <div className="mt-6 text-center"><Link className="text-blue-400" to="/login">← Back to Login</Link></div>
              </>
            )}
          </div>
          <div className="hidden md:flex w-1/3 items-center justify-center"><img src={logo} alt="Logo" /></div>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;