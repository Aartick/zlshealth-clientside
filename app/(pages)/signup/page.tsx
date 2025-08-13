"use client"

import { googleLogIn } from '@/app/actions';
import { axiosClient } from '@/utils/axiosClient';
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from "react-icons/fi";

function Page() {
    const [togglePassword, setTogglePassword] = useState<Boolean>(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [termsAndCondition, setTermsAndCondition] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSignUp = async (e: any) => {
        e.preventDefault();

        if (!email) {
            return toast.error("Email is required.")
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return toast.error("Please enter a valid email address.")
        }

        if (!password) {
            return toast.error("Password is required.")
        }

        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters long.")
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return toast.error(
                "Password must contain at least one special character, one uppercase letter, one lowercase letter, and one number."
            );
        }

        if (!termsAndCondition) {
            return toast.error(
                "Please agree to Terms & Condition."
            )
        }

        try {
            setLoading(true)
            const response = await axiosClient.post("/api/auth?type=register", {
                email,
                password
            })

            setEmail("")
            setPassword("")
            toast.success(response.data.result)
        } catch (e) {
            return;
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        toast.success("By continuing you'll be agree to Zealous's Terms of Condition and Privacy Policy.")
        googleLogIn("google")
    }

    return (
        <div className='flex flex-col md:flex-row items-center gap-6 md:gap-[42px] pt-[30px] px-4 sm:px-[30px] md:px-[60px] pb-[60px]'>

            {/* FIRST COLUMN */}
            <div className="w-full max-w-md space-y-[30px] rounded-[20px] border-3 border-[#e3e3e3] p-5 sm:p-[30px]">
                <form onSubmit={handleSignUp} className='space-y-[30px]'>
                    <p className="text-center font-semibold text-2xl">Sign Up</p>

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
                        <p
                            className="cursor-pointer"
                            onClick={() => setTogglePassword(!togglePassword)}
                        >
                            {togglePassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                        </p>
                    </div>

                    <div className="flex items-center gap-5">
                        <input
                            type="checkbox"
                            className={`text-[#71BF45] ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            checked={termsAndCondition}
                            disabled={loading}
                            onChange={(e) => setTermsAndCondition(e.target.checked)}
                        />
                        <p >By continuing, I agree to Zealous's {" "}
                            <span className="underline font-semibold decoration-solid text-[#71BF45]">Terms of Condition</span>
                            {" "} and {" "}
                            <span className="underline font-semibold decoration-solid text-[#71BF45]">Privacy Policy.</span>
                        </p>
                    </div>

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

            {/* SECOND COLUMN - Hidden on Mobile */}
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
