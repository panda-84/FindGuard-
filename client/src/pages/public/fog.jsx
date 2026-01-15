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
  };

  return (
    <>
      {/* Background */}
      <div
        className="bg-[center_20%] min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Center Form */}
        <div className="min-h-screen w-full flex items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[750px] h-[450px] p-6 rounded-3xl shadow-md flex
            bg-black/20 backdrop-blur-md
            shadow-[0_0_20px_rgba(168,85,248,0.5)]
            hover:shadow-[0_0_40px_rgba(168,85,248,0.9)]
            transition duration-300"
          >
            {/* LEFT SIDE (Form) */}
            <div className="w-2/3 flex flex-col justify-center">
              <h1 className="font-bold text-3xl text-center text-white mb-4">
                Forget Password
              </h1>

              <p className="text-sm text-gray-300 text-center mb-6">
                Enter your email and we’ll send you a reset link
              </p>

              {/* Email */}
              <div className="mb-8 w-[400px] mx-auto">
                <label className="block text-white text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
                  w-full px-3 py-2 rounded-lg
                  bg-blue-500/15 text-white
                  border-none outline-none"
                  type="email"
                  {...register("email", {
                    required: "Email is required...",
                  })}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs italic">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <div className="w-[400px] mx-auto flex justify-center">
                <button
                  type="submit"
                  className="flex items-center justify-center
                  hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
                  w-[300px] bg-blue-500 hover:bg-blue-300
                  text-white font-bold py-2 px-4 rounded-3xl
                  transition duration-900"
                >
                  Send Reset Link
                </button>
              </div>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link className="text-blue-600" to="/login">
                  Back to Login
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE (Logo) */}
            <div className="w-1/3 flex items-center justify-center">
              <img src={logo} alt="Logo" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default ForgetPassword;