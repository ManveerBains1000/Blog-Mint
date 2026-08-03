import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Logo, OTPInput } from "../components";
import authService from "../api/auth";

function VerifyEmail() {

    const navigate = useNavigate();
    const location = useLocation();

    const email =
        location.state?.email ||
        sessionStorage.getItem("verificationEmail");

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [seconds, setSeconds] = useState(30);

    useEffect(() => {

        if (!email) {
            navigate("/signup");
        }

    }, []);

    useEffect(() => {

        if (seconds === 0) return;

        const timer = setInterval(() => {

            setSeconds(prev => prev - 1);

        }, 1000);

        return () => clearInterval(timer);

    }, [seconds]);

    const verifyOTP = async () => {

        setError("");
        setSuccess("");

        const otpCode = otp.join("");

        if (otpCode.length !== 6) {
            return setError("Please enter all six digits.");
        }

        try {

            setLoading(true);

            const response = await authService.verifyEmail({
                email,
                otp: otpCode,
            });

            setSuccess(response.message);

            sessionStorage.removeItem("verificationEmail");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                error.message
            );

        } finally {

            setLoading(false);

        }
    };

    const resendOTP = async () => {

        try {

            setResending(true);
            setError("");

            const response =
                await authService.resendVerificationOTP(
                    email
                );

            setSuccess(response.message);

            setSeconds(30);

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                error.message
            );

        } finally {

            setResending(false);

        }

    };

    return (

        <div className="flex justify-center items-center w-full">

            <div className="w-full max-w-lg rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-10">

                <div className="flex justify-center mb-4">
                    <Logo width="35px" />
                </div>

                <h2 className="text-2xl font-bold text-center">
                    Verify your Email
                </h2>

                <p className="text-center text-gray-500 mt-3">
                    Enter the 6-digit OTP sent to
                </p>

                <p className="text-center font-semibold mt-1">
                    {email}
                </p>

                <div className="mt-8">

                    <OTPInput
                        value={otp}
                        onChange={setOtp}
                    />

                </div>

                {
                    error &&

                    <p className="text-red-500 text-center mt-5">
                        {error}
                    </p>
                }

                {
                    success &&

                    <p className="text-green-600 text-center mt-5">
                        {success}
                    </p>
                }

                <Button
                    className="w-full mt-8"
                    onClick={verifyOTP}
                    disabled={loading}
                >
                    {
                        loading
                            ? "Verifying..."
                            : "Verify Email"
                    }
                </Button>

                <div className="text-center mt-6">

                    {
                        seconds > 0 ?

                            <p className="text-gray-500">

                                Resend OTP in

                                <span className="font-semibold">

                                    {" "}
                                    {seconds}s

                                </span>

                            </p>

                            :

                            <button
                                onClick={resendOTP}
                                disabled={resending}
                                className="text-blue-600 hover:underline"
                            >
                                {
                                    resending
                                        ? "Sending..."
                                        : "Resend OTP"
                                }
                            </button>

                    }

                </div>

            </div>

        </div>

    );
}

export default VerifyEmail;