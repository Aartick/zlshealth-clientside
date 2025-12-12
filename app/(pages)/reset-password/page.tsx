/**
 * Reset Password Page
 *
 * This component allows users to reset their password using a token from the email link.
 * Users must provide a new password and confirm it.
 */

"use client"

import { axiosClient } from '@/utils/axiosClient';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from "react-icons/fi";

function Page() {
    const [togglePassword, setTogglePassword] = useState<boolean>(false)
    const [toggleConfirmPassword, setToggleConfirmPassword] = useState<boolean>(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [tokenValid, setTokenValid] = useState<boolean | null>(null)

    const router = useRouter();
    const searchParams = useSearchParams();
    const param = searchParams.get("param");

    // Verify param on component mount
    useEffect(() => {
        const verifyParam = async () => {
            if (!param) {
                setTokenValid(false)
                toast.error("Invalid or missing reset link.")
                return
            }

            try {
                await axiosClient.get(`/api/resetpassword?param=${param}`)
                setTokenValid(true)
            } catch (error) {
                setTokenValid(false)
                toast.error("Invalid or expired reset link.")
            }
        }

        verifyParam()
    }, [param])

    // Handles reset password form submission
    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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

        // Validate confirm password
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.")
        }

        try {
            setLoading(true)
            // Send reset password request to backend
            const response = await axiosClient.post("/api/resetpassword", {
                param,
                password
            })

            // Show success message and redirect to login
            toast.success(response.data.result || "Password reset successfully!")
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } catch (error) {
            // Error is handled by axios interceptor
        } finally {
            setLoading(false)
        }
    }

    // Show loading state while verifying token
    if (tokenValid === null) {
        return (
            <div className='max-w-screen-2xl mx-auto flex items-center justify-center min-h-[500px]'>
                <p className="text-lg">Verifying reset link...</p>
            </div>
        )
    }

    // Show error if token is invalid
    if (tokenValid === false) {
        return (
            <div className='max-w-screen-2xl mx-auto flex flex-col items-center justify-center min-h-[500px] gap-4 px-4'>
                <p className="text-xl font-semibold text-center">Invalid or Expired Reset Link</p>
                <p className="text-gray-600 text-center">This password reset link is invalid or has expired.</p>
                <Link
                    href="/forgot-password"
                    className='bg-[#092C16] py-2.5 px-6 text-white rounded-[10px] mt-4'
                >
                    Request New Link
                </Link>
            </div>
        )
    }

    return (
        <div className='max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-[42px] pt-[30px] px-4 sm:px-[30px] md:px-[60px] pb-[60px]'>

            {/* FIRST COLUMN: Reset password form */}
            <div className="w-full max-w-md space-y-[30px] rounded-[20px] border-3 border-[#e3e3e3] p-5 sm:p-[30px]">
                <form onSubmit={handleResetPassword} className='space-y-[30px]'>
                    <div className="space-y-2.5">
                        <p className="text-center font-semibold text-2xl">Reset Password</p>
                        <p className="text-center text-sm text-gray-600">
                            Enter your new password below.
                        </p>
                    </div>

                    {/* New Password input field with toggle visibility */}
                    <div className='space-y-2.5'>
                        <label className="text-sm font-medium">New Password</label>
                        <div
                            className={`flex items-center justify-between px-4 py-2.5 border border-[#cdcdcd] rounded-[10px] w-full`}
                        >
                            <input
                                type={togglePassword ? `text` : `password`}
                                value={password}
                                disabled={loading}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className={`w-full focus:outline-none ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            />
                            <p
                                className="cursor-pointer"
                                onClick={() => setTogglePassword(!togglePassword)}
                            >
                                {togglePassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                            </p>
                        </div>
                    </div>

                    {/* Confirm Password input field with toggle visibility */}
                    <div className='space-y-2.5'>
                        <label className="text-sm font-medium">Confirm Password</label>
                        <div
                            className={`flex items-center justify-between px-4 py-2.5 border border-[#cdcdcd] rounded-[10px] w-full`}
                        >
                            <input
                                type={toggleConfirmPassword ? `text` : `password`}
                                value={confirmPassword}
                                disabled={loading}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className={`w-full focus:outline-none ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            />
                            <p
                                className="cursor-pointer"
                                onClick={() => setToggleConfirmPassword(!toggleConfirmPassword)}
                            >
                                {toggleConfirmPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                            </p>
                        </div>
                    </div>

                    {/* Password requirements hint */}
                    <div className="text-xs text-gray-600 space-y-1">
                        <p>Password must:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Be at least 8 characters long</li>
                            <li>Contain at least one uppercase letter</li>
                            <li>Contain at least one lowercase letter</li>
                            <li>Contain at least one number</li>
                            <li>Contain at least one special character</li>
                        </ul>
                    </div>

                    {/* Submit button and back to login link */}
                    <div className='space-y-2.5'>
                        <input
                            type="submit"
                            value={loading ? "Resetting..." : "Reset Password"}
                            disabled={loading}
                            className={`bg-[#092C16] py-2.5 px-4 text-white border border-[#CDCDCD] rounded-[10px] w-full ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                        />
                        <div className="flex items-center justify-center gap-2.5 text-sm sm:text-base flex-wrap">
                            <Link
                                href="/login"
                                className='text-[#71BF45] font-medium underline decoration-solid'
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

            {/* SECOND COLUMN: Image, hidden on mobile */}
            <div className='hidden md:block relative w-full md:w-[819px] h-[400px] md:h-[732px]'>
                <Image
                    src="/login.png"
                    alt='resetPasswordImg'
                    fill
                    className='rounded-[20px] object-cover'
                />
            </div>
        </div>
    )
}

export default Page
