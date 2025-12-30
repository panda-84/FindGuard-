import {useForm} from 'react-hook-form';
import { Link } from 'react-router-dom';


export function Login(){
    const {register, handleSubmit, reset, formState: {errors},
    }=useForm()

    console.log(errors);

    const onSubmit = (data) => {
        console.log(errors);
        console.log("Form Values...", data);
    }
    return (
        <>
            <div className=' flex items-center justify-center bg-gray-100'>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded shadow-md">
                    {/* Heading */}
                    <h1 className='font-bold text-3xl text-center text-black mb-6'>Login</h1>

                    {/* Email */}
            {/* Email */}
                <div className="mb-8 ">
                    <label className="block text-black text-sm font-bold mb-2">Email</label>
                    <input className="w-full px-3 py-2 border rounded " type="text" {...register("email", {required: "Email is required..."})} placeholder="Enter your email address" />
                    {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                </div>

            {/* Password */}
                <div className="mb-10">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input className="w-full px-3 py-2 border rounded " type="password" {...register("password", {required: "Password is required..."})} placeholder="Enter your password" />
                    {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                </div>

            {/* Buttons */}
                <div className="flex items-center justify-between gap-4">
                    <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
                    <button type="button" onClick={() => reset()} className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Reset</button>
                </div>

            {/* Don't Have an account? */}
            <div className='flex items-center justify-between'>
                <p>Don't have an account? <Link className='text-blue-600' to="/register">Register Here</Link></p>
            </div>
                </form>
            </div>
        </>
    );
}