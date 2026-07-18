import React,{useState} from "react";
import { Link, matchPath, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import authService from "../api/auth";
import { useForm } from "react-hook-form";
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");
    try {
   
      const  session = await authService.login(data);
    
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin({ userData }));
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="w-full flex items-center justify-center ">
      <div
        className='mx-auto w-full max-w-lg rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-10'
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-25">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-[var(--theme-muted)]">
          Don&apos;t have any account? &nbsp;
          <Link
            to="/signup"
            className="font-medium text-[var(--theme-text)] transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
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
            <Button type="submit" className="w-full">Sign in</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
