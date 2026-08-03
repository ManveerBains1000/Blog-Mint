import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Logo } from "./index";
import authService from "../api/auth";
import { useForm } from "react-hook-form";

function SignUp() {

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("password");

    const createAccount = async (data) => {
        
        setError("");
        setLoading(true);

        try {

            const response = await authService.createAccount(data);

            // Save email so refresh doesn't lose it
            sessionStorage.setItem(
                "verificationEmail",
                response.data.email
            );

            navigate("/verify-email", {
                state: {
                    email: response.data.email
                }
            });

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                error.message
            );

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="w-full flex items-center justify-center">

            <div className="mx-auto w-full max-w-lg rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-10">

                <div className="flex justify-center mb-3">
                    <Logo width="38px" />
                </div>

                <h2 className="text-center text-2xl font-bold">
                    Create your account
                </h2>

                <p className="text-center text-gray-500 mt-2">
                    Join Blog Mint today.
                </p>

                {
                    error &&
                    <p className="text-red-500 text-center mt-5">
                        {error}
                    </p>
                }

                <form
                    onSubmit={handleSubmit(createAccount)}
                    className="mt-8 space-y-5"
                >

                    <Input
                        label="Username"
                        placeholder="Enter username"
                        {...register("username", {
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message: "Minimum 3 characters"
                            }
                        })}
                    />

                    {errors.username && (
                        <p className="text-sm text-red-500">
                            {errors.username.message}
                        </p>
                    )}

                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value:
                                    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                message: "Invalid email"
                            }
                        })}
                    />

                    {errors.email && (
                        <p className="text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Minimum 8 characters"
                            }
                        })}
                    />

                    {errors.password && (
                        <p className="text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm password"
                        {...register("confirmPassword", {
                            required: "Confirm your password",
                            validate: value =>
                                value === password ||
                                "Passwords do not match"
                        })}
                    />

                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {
                            loading
                                ? "Creating Account..."
                                : "Create Account"
                        }
                    </Button>

                </form>

                <p className="text-center mt-6">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-blue-600 ml-1 hover:underline"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default SignUp;