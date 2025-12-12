/**
 * Forgot Password Page
 *
 * This component allows users to request a password reset link.
 * Users enter their email address, and a reset link is sent to their email.
 */

"use client"

import { axiosClient } from '@/utils/axiosClient';
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function Page() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    // Handles forgot password form submission
    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate email input
        if (!email) {
            return toast.error("Email is required.")
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return toast.error("Please enter a valid email address.")
        }

        try {
            setLoading(true)
            // Send forgot password request to backend
            const response = await axiosClient.post("/api/forgetpassword", {
                email
            })

            // Show success message
            toast.success(response.data.result || "Password reset link sent to your email!")
            setEmailSent(true)
        } catch (error) {
            // Error is handled by axios interceptor
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-[42px] pt-[30px] px-4 sm:px-[30px] md:px-[60px] pb-[60px]'>

            {/* FIRST COLUMN: Forgot password form */}
            <div className="w-full max-w-md space-y-[30px] rounded-[20px] border-3 border-[#e3e3e3] p-5 sm:p-[30px]">
                {!emailSent ? (
                    <form onSubmit={handleForgotPassword} className='space-y-[30px]'>
                        <div className="space-y-2.5">
                            <p className="text-center font-semibold text-2xl">Forgot Password?</p>
                            <p className="text-center text-sm text-gray-600">
                                Enter your email address and we&apos;ll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Email input field */}
                        <div className='space-y-2.5'>
                            <input
                                type="email"
                                value={email}
                                disabled={loading}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Enter your email'
                                className={`py-2.5 px-4 rounded-[10px] border border-[#cdcdcd] w-full focus:outline-none ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            />
                        </div>

                        {/* Submit button and back to login link */}
                        <div className='space-y-2.5'>
                            <input
                                type="submit"
                                value={loading ? "Sending..." : "Send Reset Link"}
                                disabled={loading}
                                className={`bg-[#092C16] py-2.5 px-4 text-white border border-[#CDCDCD] rounded-[10px] w-full ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                            />
                            <div className="flex items-center justify-center gap-2.5 text-sm sm:text-base flex-wrap">
                                <p className='text-[#71BF45] font-medium'>Remember your password?</p>
                                <Link
                                    href="/login"
                                    className='font-semibold underline decoration-solid'
                                >
                                    Log In
                                </Link>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className='space-y-[30px]'>
                        <div className="space-y-2.5">
                            <p className="text-center font-semibold text-2xl">Check Your Email</p>
                            <p className="text-center text-sm text-gray-600">
                                We&apos;ve sent a password reset link to <span className="font-semibold text-[#71BF45]">{email}</span>
                            </p>
                            <p className="text-center text-sm text-gray-600 mt-4">
                                Didn&apos;t receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="text-[#71BF45] font-semibold underline"
                                >
                                    try again
                                </button>
                            </p>
                        </div>

                        <div className='space-y-2.5'>
                            <Link
                                href="/login"
                                className='block text-center bg-[#092C16] py-2.5 px-4 text-white border border-[#CDCDCD] rounded-[10px] w-full'
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* SECOND COLUMN: Image, hidden on mobile */}
            <div className='hidden md:block relative w-full md:w-[819px] h-[400px] md:h-[732px]'>
                <Image
                    src="/login.png"
                    alt='forgotPasswordImg'
                    fill
                    className='rounded-[20px] object-cover'
                />
            </div>
        </div>
    )
}

export default Page
