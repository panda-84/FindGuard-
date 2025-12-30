 import { Link } from "react-router-dom";
    function NavBar() {
    return (
        <>   
        <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white z-50">
            <div className="bg-white h-24 flex gap-9 justify-center items-center">
                <Link to="/" className="text-black font-bold text-2xl">Home</Link>
                <h1 className="text-black font-bold text-2xl ">FindGuard</h1>
                <Link to="/register" className="bg-red-500 text-white px-4 py-2 rounded ml-[100px]">Register</Link>
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded ">Login</Link>
            </div>
        </nav>
        </>

    );
}

export default NavBar;