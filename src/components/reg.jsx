import {useForm} from 'react-hook-form';
import { Link } from 'react-router-dom';

export const Register = () => {
const {register, handleSubmit, reset, formState: {errors},
    }=useForm()

    console.log(errors);

    const onSubmit = (data) => {
        console.log(errors);
        console.log("Form Values...", data);
    }

    return(
        <div className="flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-8 rounded shadow-md">
                {/* Heading */}
                <h1 className="font-bold text-3xl text-center mb-6">Register Here</h1>

                {/* Full Name */}
                <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-700" type="text" {...register("name", {required: "Full Name is required..."})} placeholder="Enter your full name" />
                    {errors.name && <p className='text-red-500 text-xs italic'>{errors.name.message}</p>}
                </div>

            {/* Gender */}
            <div className="mb-5">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                Gender
            </label>

            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                <input
                    type="radio"
                    value="Male"
                    {...register("gender", { required: "Gender is required" })}
                />
                Male
                </label>

                <label className="flex items-center gap-2">
                <input
                    type="radio"
                    value="Female"
                    {...register("gender", { required: "Gender is required" })}
                />
                Female
                </label>
            </div>

            {errors.gender && (
                <p className="text-red-500 text-xs italic">
                {errors.gender.message}
                </p>
            )}
            </div>

        {/* DOB */}
            <div className='mb-6'>
                <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                <input type="date" className="w-full px-3 py-2 border rounded" {...register("dob", {required: "Date of birth is required"})} />
                {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
            </div>

        {/* Address (Location) */}
            <div className="mb-7">
            <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
            <input
                className="w-full px-3 py-2 border rounded"
                {...register("address", { required: "Address is required" })}
                placeholder="Enter your address"
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>

            {/* Email */}
                <div className="mb-8">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-700" type="text" {...register("email", {required: "Email is required..."})} placeholder="Enter your email address" />
                    {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                </div>

            {/* Contact Number */}
                <div className="mb-9">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-700" type="number" {...register("phone", {required: "Phone is required..."})} placeholder="Enter your phone number" />
                    {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone.message}</p>}
                </div>

            {/* Password */}
                <div className="mb-10">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-700" type="password" {...register("password", {required: "Password is required..."})} placeholder="Enter your password" />
                    {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                </div>

            {/* Confirm Password */}
                <div className="mb-11">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                    <input className="w-full px-3 py-2 border rounded text-gray-700" type="password" {...register("confirmpassword", {required: "Password is required..."})} placeholder="Enter your password" />
                    {errors.confirmpassword && <p className="text-red-500 text-xs italic">{errors.confirmpassword.message}</p>}
                </div>

            {/* Buttons */}
                <div className="flex items-center justify-between gap-4">
                    <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</button>
                    <button type="button" onClick={() => reset()} className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Reset</button>
                </div>

            {/* Already Have an account? */}
            <div className='flex items-center justify-between'>
                <p>Already have an account? <Link className='text-blue-600' to="/login">Login Here</Link></p>
            </div>
            </form>
        </div>
    );
}