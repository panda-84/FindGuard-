import { useForm } from "react-hook-form";

const UserRegister = () => {
    const{
        register,
        handleSubmit,
        formState:{errors},
    } = useForm();

    console.log(errors);

    const onSubmit = (data) => {
        debugger;
        console.log(errors);
        console.log("Form Values", data);
    };

    return (<>
    <div className="bg-black w-[600px] h-[400px] rounded-md  shadow-lg m-auto">
        <br></br>
        <br></br>
        <h2 className="text-2xl mb-4 bold text-center text-white">User Registration</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{maxWidth:400}}>
            
            <div>
                <label>Name </label>
                <input 
                type="text" 
                {...register("name", {required:"Name is required"})}
                />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div><br></br>
            <div>
                <label>Email </label>
                <input 
                type="email" 
                {...register("email", {required:"Email is required"})}
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div> <br></br>
            <div>
                <label>Password </label>
                <input 
                type="password" 
                {...register("password", {required:"Password is required",
                minLength:{value:6, message:"Password must be at least 6 characters"}})}
                />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <br></br>
            <button type="submit">Register</button>


        </form> 
    </div>
    </>)
};
export default UserRegister;