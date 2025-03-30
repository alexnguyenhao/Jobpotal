import React, {useState} from 'react'
import NavBar from "@/components/shared/NavBar.jsx";
import {Label} from "@/components/ui/label.js";
import {Input} from "@/components/ui/input.js";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.js";
import {Button} from "@/components/ui/button.js";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {USER_API_END_POINT} from "@/utils/constant.js";
import {toast} from "sonner";
const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role:""
    })
    const navigate = useNavigate();
    const changeEventHandler = (e) => {
        setInput({...input,[e.target.name]:e.target.value});
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await  axios.post(`${USER_API_END_POINT}/login`,input,{
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            console.log(res.data.success);
            if (res.data.success){
                navigate("/");
                toast.success(res.data.message);
            }
        }catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col mt-10">
            {/* Navigation Bar */}
            <NavBar />

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 sm:p-8 transform transition-all hover:shadow-xl">
                    {/* Form Header */}
                    <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                        Job Portal
                    </h1>
                    <p className="text-center text-gray-500 mb-8">
                        Login now
                    </p>

                    {/* Signup Form */}
                    <form className="space-y-5" onSubmit={submitHandler}>
                        {/* Email */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">Email</Label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={input.email}
                                onChange={changeEventHandler}
                                name="email"
                                className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            />
                        </div>
                        {/* Password */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">Password</Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={input.password}
                                onChange={changeEventHandler}
                                name="password"
                                className="mt-1 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">I am a...</Label>
                            <RadioGroup
                                value={input.role}
                                onValueChange={(value) => setInput({ ...input, role: value })}
                                className="mt-2 flex flex-col sm:flex-row gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === "student"}
                                        onChange={changeEventHandler}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    <Label htmlFor="student" className="text-gray-600 cursor-pointer">
                                        Student
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === "recruiter"}
                                        onChange={changeEventHandler}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    <Label htmlFor="recruiter" className="text-gray-600 cursor-pointer">
                                        Recruiter
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Sign Up
                        </Button>
                    </form>

                    {/* Footer Link */}
                    <span className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account? Create now {' '}
                        <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
                            Signup
                        </Link>
                    </span>
                </div>
            </main>
        </div>
    );
}
export default Login