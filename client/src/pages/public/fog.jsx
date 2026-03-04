
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import bgImage from "../../assets/image.png";
import logo from "../../assets/Untitled.png";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Forget Password Email:", data);
    alert("Reset link sent to " + data.email);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[750px] h-auto md:h-[450px] p-6 rounded-3xl
            flex flex-col md:flex-row
            bg-black/20 backdrop-blur-md
            shadow-[0_0_20px_rgba(168,85,248,0.5)]
            hover:shadow-[0_0_40px_rgba(168,85,248,0.9)]
            transition duration-300"
        >
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <h1 className="font-bold text-2xl md:text-3xl text-center text-white mb-4">
              Forgot Password
            </h1>

            <p className="text-sm text-gray-300 text-center mb-6">
              Enter your email and we'll send you a reset link
            </p>

            <div className="mb-8 w-full max-w-[400px] mx-auto">
              <label className="block text-white text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                {...register("email", { required: "Email is required" })}
                className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
                  w-full px-3 py-2 rounded-lg
                  bg-blue-500/15 text-white
                  border-none outline-none"
              />
              {errors.email && (
                <p className="text-red-400 text-xs italic mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="w-full max-w-[400px] mx-auto flex justify-center">
              <button
                type="submit"
                className="w-[300px] bg-blue-500 hover:bg-blue-300
                  text-white font-bold py-2 px-4 rounded-3xl
                  transition duration-300
                  hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
              >
                Send Reset Link
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link className="text-blue-400" to="/login">
                ← Back to Login
              </Link>
            </div>
          </div>

          <div className="hidden md:flex w-1/3 items-center justify-center">
            <img src={logo} alt="Logo" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;