/**
 * User Signup Page
 * 
 * This component renders the signup form for new users.
 * It provides fields for email and password, validates input (including password strength),
 * and requires agreement to Terms & Conditions and Privacy Policy.
 * Users can toggle password visibility and sign up using Google.
 * On successful signup, a confirmation message is shown.
 */

"use client"

// Import required modules and components
import { googleLogIn } from '@/app/actions';
import { axiosClient } from '@/utils/axiosClient';
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from "react-icons/fi";

function Page() {
    // State for password visibility toggle
    const [togglePassword, setTogglePassword] = useState<boolean>(false)
    // State for email input
    const [email, setEmail] = useState("")
    // State for password input
    const [password, setPassword] = useState("")
    // State for terms and conditions checkbox
    const [termsAndCondition, setTermsAndCondition] = useState(false)
    // State for loading status
    const [loading, setLoading] = useState(false)

    // Handles signup form submission
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate email presence
        if (!email) {
            return toast.error("Email is required.")
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return toast.error("Please enter a valid email address.")
        }

        // Validate password presence
        if (!password) {
            return toast.error("Password is required.")
        }

        // Validate password length
        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters long.")
        }

        // Validate password strength
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return toast.error(
                "Password must contain at least one special character, one uppercase letter, one lowercase letter, and one number."
            );
        }

        // Validate terms and conditions agreement
        if (!termsAndCondition) {
            return toast.error(
                "Please agree to Terms & Condition."
            )
        }

        try {
            setLoading(true)
            // Send signup request to backend
            const response = await axiosClient.post("/api/auth?type=register", {
                email,
                password
            })

            // Reset form fields
            setEmail("")
            setPassword("")
            // Show success message
            toast.success(response.data.result)
        } catch { }
        finally {
            setLoading(false)
        }
    }

    // Handles Google signup button click
    const handleGoogleLogin = async () => {
        toast.success("By continuing you'll be agree to Zealous's Terms of Condition and Privacy Policy.")
        googleLogIn("google")
    }

    return (
        <div className='flex flex-col md:flex-row items-center gap-6 md:gap-[42px] pt-[30px] px-4 sm:px-[30px] md:px-[60px] pb-[60px]'>

            {/* FIRST COLUMN: Signup form and actions */}
            <div className="w-full max-w-md space-y-[30px] rounded-[20px] border-3 border-[#e3e3e3] p-5 sm:p-[30px]">
                <form onSubmit={handleSignUp} className='space-y-[30px]'>
                    <p className="text-center font-semibold text-2xl">Sign Up</p>

                    {/* Email input field */}
                    <div className='space-y-2.5'>
                        <input
                            type="text"
                            value={email}
                            disabled={loading}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter mobile No. or Email'
                            className={`py-2.5 px-4 rounded-[10px] border border-[#cdcdcd] w-full focus:outline-none ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        />
                        <p className='font-normal text-[#676767] text-xs'>*You will receive a code for confirmation.</p>
                    </div>

                    {/* Password input field with toggle visibility */}
                    <div
                        className={`flex items-center justify-between px-4 py-2.5 border border-[#cdcdcd] rounded-[10px] w-full`}
                    >
                        <input
                            type={togglePassword ? `text` : `password`}
                            value={password}
                            disabled={loading}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create Password"
                            className={`w-full focus:outline-none ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        />
                        {/* Toggle password visibility icon */}
                        <p
                            className="cursor-pointer"
                            onClick={() => setTogglePassword(!togglePassword)}
                        >
                            {togglePassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                        </p>
                    </div>

                    {/* Terms and Conditions checkbox */}
                    <div className="flex items-center gap-5">
                        <input
                            type="checkbox"
                            className={`text-[#71BF45] ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            checked={termsAndCondition}
                            disabled={loading}
                            onChange={(e) => setTermsAndCondition(e.target.checked)}
                        />
                        <p >By continuing, I agree to Zealous&apos;s {" "}
                            <span className="underline font-semibold decoration-solid text-[#71BF45]">Terms of Condition</span>
                            {" "} and {" "}
                            <span className="underline font-semibold decoration-solid text-[#71BF45]">Privacy Policy.</span>
                        </p>
                    </div>

                    {/* Submit button and login page link */}
                    <div className='space-y-2.5'>
                        <input
                            type="submit"
                            value="Sign Up"
                            disabled={loading}
                            className={`bg-[#092C16] py-2.5 px-4 text-white border border-[#CDCDCD] rounded-[10px] w-full ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                        />

                        <div className="flex items-center justify-center gap-2.5 text-sm sm:text-base flex-wrap">
                            <p className='text-[#71BF45] font-medium'>Already have an account?</p>
                            <Link
                                href="/login"
                                className='font-semibold underline decoration-solid'
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                </form>

                {/* Google signup button and help link */}
                <div className='space-y-2.5'>
                    <button
                        disabled={loading}
                        onClick={handleGoogleLogin}
                        className={`flex items-center justify-center gap-2.5 px-3 py-[11px] border-2 border-[#71BF45] rounded-lg drop-shadow-[0_2px_12px_rgba(63,137,249,0.08)] w-full ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}>
                        <p className="text-base font-semibold">Continue With Google</p>
                    </button>
                    <div className="flex items-center gap-2.5 justify-center text-sm sm:text-base flex-wrap">
                        <p>Have trouble logging in?</p>
                        <p className='text-[#71BF45] font-extrabold cursor-pointer'>Get Help</p>
                    </div>
                </div>
            </div>

            {/* SECOND COLUMN: Signup image, hidden on mobile */}
            <div className='hidden md:block relative w-full md:w-[819px] h-[400px] md:h-[732px]'>
                <Image
                    src="/login.png"
                    alt='loginImg'
                    fill
                    className='rounded-[20px] object-cover'
                />
            </div>
        </div>
    )
}

export default Page
