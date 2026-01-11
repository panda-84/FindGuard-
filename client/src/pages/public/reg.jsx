import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import bgImage from "../../assets/image.png";
import logo from "../../assets/Untitled.png";

export const Register = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Form Values...", data);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="  min-h-screen w-full flex items-center justify-center bg-opacity-100">
        <form
          onSubmit={handleSubmit(onSubmit)}
          
          className="w-[950px] h-[550px] rounded-3xl shadow-md flex bg-black/20 backdrop-blur-md 
            shadow-[0_0_20px_rgba(168,85,248,0.5)]
             hover:shadow-[0_0_40px_rgba(168,85,247,0.9)]
             transition duration-300 p-14">
        
          {/* LEFT SIDE (Form) */}
          <div className="w-2/3 flex flex-col justify-center">
            <h1 className="font-bold text-3xl text-center text-white mb-6">Register</h1>

            {/* Grid Layout: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto">

              {/* First Name */}
              <div>
                <label className="block text-white text-sm mb-2">First Name *</label>
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName", { required: "First Name is required" })}
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-white text-sm mb-2">Last Name *</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName", { required: "Last Name is required" })}
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm mb-2">Your Email *</label>
                <input
                  type="email"
                  placeholder="Your Email"
                  {...register("email", { required: "Email is required" })}
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white text-sm mb-2">Your Phone *</label>
                <input
                  type="tel"
                   pattern="[0-9]{10}"
  maxLength="10"
                  placeholder="Your Phone"
                  {...register("phone", { required: "Phone is required" })}
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white text-sm mb-2">Password *</label>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: "Password is required" })}
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white text-sm mb-2">Confirm Password *</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmpassword", { required: "Confirm Password is required" })}
                  className="hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] w-full px-3 py-2 border rounded-lg bg-blue-500/15 text-white border-none outline-none"
                />
                {errors.confirmpassword && <p className="text-red-500 text-xs mt-1">{errors.confirmpassword.message}</p>}
              </div>
            </div>
            {/* Register Button */}
            <div className="w-[400px] mx-auto flex justify-center  mt-6">
              <button className="flex items-center justify-center w-[300px] bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded-3xl transition duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                Register
              </button>
            </div>

            {/* Already have account */}
            <div className="mt-4 text-center">
              <p className="text-white">
                Already have an account? <Link className="text-blue-600" to="/login">Login Here</Link>
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
