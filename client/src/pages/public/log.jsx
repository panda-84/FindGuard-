import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import bgImage from "../../assets/image.png";
import logo from "../../assets/Untitled.png";

export function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Values...", data);
  };

  return (
    <>
      {/* Background */}
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Center Form */}
        <div className="min-h-screen w-full flex items-center justify-center bg-opacity-100">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[750px] h-[450px] p-6 rounded-3xl shadow-md flex bg-black/20 backdrop-blur-md 
            shadow-[0_0_20px_rgba(168,85,248,0.5)]
             hover:shadow-[0_0_40px_rgba(168,85,247,0.9)]
             transition duration-300">
            {/* LEFT SIDE (Form) */}
            <div className="w-2/3 flex flex-col justify-center">
              <h1 className="font-bold text-3xl text-center text-white mb-6">
                Login
              </h1>

              {/* Email */}
              <div className="mb-4 w-[400px] mx-auto">
                <label className="block text-white text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]  w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                  type="text"
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

              {/* Password */}
              <div className="mb-8 w-[400px] mx-auto">
                <label className="block text-white text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]  w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                  type="password"
                  {...register("password", {
                    required: "Password is required...",
                  })}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs italic">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <div className="w-[400px] mx-auto flex justify-center">
                <button className=" flex items-center justify-center hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-[300px] bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded-3xl transition duration-900 ">
                  Login
                </button>
              </div>

              {/* Register */}
              <div className="mt-4 text-center">
                <p className="text-white">
                  Don't have an account?{" "}
                  <Link className="text-blue-600 " to="/register">
                    Register Here
                  </Link>
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
    </>
  );
}
