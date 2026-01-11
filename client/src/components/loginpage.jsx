import profileIcon from "../assets/icons/profile.png";
import logoIcon from "../assets/icons/logo-icon.png";

export default function LoginPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      
      {/* MAIN AUTH BOX */}
      <div className="flex w-[800px] h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden">

        {/* LEFT BLUE PANEL */}
        <div className="w-1/2 flex flex-col justify-center items-center 
          bg-gradient-to-b from-[#1A73E8] to-[#0F4EB3] 
          rounded-tr-[70px] text-white p-[40px]">

          <img
            src={logoIcon}
            alt="Logo"
            className="w-[80px] h-[80px] mb-[20px]"
          />

          <h2 className="text-[36px] font-bold text-center mb-[20px]">
            Hello,<br />Welcome to Kindim
          </h2>

          <p className="text-[16px] mb-[30px] text-center">
            Don't have an account?
          </p>

          <button
            className="px-[30px] py-[10px] bg-black text-white rounded-[25px]
              hover:shadow-[0_0_20px_5px_rgba(0,0,0,0.8)]
              hover:scale-105 transition duration-300"
          >
            Sign up
          </button>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="w-1/2 flex flex-col justify-center px-[60px]">

          <h1 className="text-black text-[48px] font-bold mb-[30px] text-center">
            Login
          </h1>

          <div className="w-full max-w-[380px] mx-auto">

            {/* USERNAME INPUT */}
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-[20px] px-[15px] py-[12px] pr-[40px]
                rounded-[6px] border border-[#ccc] bg-[#f0f0f0] text-[16px]"
              style={{
                color: "black",
                backgroundImage: `url(${profileIcon})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "20px 20px",
                backgroundPosition: "right 10px center",
              }}
            />

            {/* PASSWORD INPUT */}
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-[20px] px-[15px] py-[12px]
                rounded-[6px] border border-[#ccc] bg-[#f0f0f0] text-[16px]"
              style={{ color: "black" }}
            />

            {/* LOGIN BUTTON */}
            <button
              className="w-full py-[12px] bg-[#0d47c2] text-white rounded-[30px] mb-[15px]
                hover:scale-105 transition duration-300
                hover:shadow-[0_0_15px_5px_rgba(59,130,246,0.7)]"
            >
              Login
            </button>

            {/* FORGOT PASSWORD */}
            <div className="text-center text-blue-600 underline cursor-pointer hover:no-underline">
              Forgot Password?
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
