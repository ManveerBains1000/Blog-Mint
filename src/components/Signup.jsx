import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appWrite/auth";
import { useForm } from "react-hook-form";

function SignUp() {
    const [error,setError] = useState("")
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register,handleSubmit} = useForm();

    const createAccount = async(data) => {
        console.log(data)
        setError("");
        try {
            const userData = await authService.createAccount(data);
            if (userData) {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) dispatch({currentUser});
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
        }
    }
  return (
    <div className="w-full flex items-center justify-center ">
      <div
        className={`mx-auto w-full max-w-lg bg-gary-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-25">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          create a new account
        </h2>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(createAccount)} className="mt-8">
          <div className="space-y-5">
            <Input
                label="name: "
                placeholder="Enter your full name"
                type="text"
                {...register("name",{required:true})}
            />
            <Input
              label="email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Invalid email",
                },
              })}
            />
            <Input
                label="password: "
                placeholder="Enter your password"
                type="password"
                {...register("password",{required:true})}
            />
            <Button type="submit" className="w-full">Sign up</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp
