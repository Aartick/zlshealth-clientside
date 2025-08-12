"use client"

import { axiosClient } from '@/utils/axiosClient';
import { KEY_ACCESS_TOKEN, setItem } from '@/utils/localStorageManager';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from "react-icons/fi";

function Page() {
    const [togglePassword, setTogglePassword] = useState<Boolean>(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const handleLogIn = async (e: any) => {
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

        try {
            setLoading(true)
            const response = await axiosClient.post("/api/auth?type=login", {
                email,
                password
            })
            setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken)
            setEmail("")
            setPassword("")
            router.push("/")
        } catch (e) {
            return;
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col md:flex-row items-center gap-6 md:gap-[42px] pt-[30px] px-4 sm:px-[30px] md:px-[60px] pb-[60px] bg'>

            {/* FIRST COLUMN */}
            <form onSubmit={handleLogIn} className='w-full max-w-md space-y-[30px] rounded-[20px] border-3 border-[#e3e3e3] p-5 sm:p-[30px]'>
                <p className="text-center font-semibold text-2xl">Log In</p>

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

                <div className='space-y-2.5'>

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

                    <p className="text-center text-[#71BF45] font-medium text-sm sm:text-base cursor-pointer">Forgot password?</p>
                </div>

                <div className='space-y-2.5'>
                    <input
                        type="submit"
                        value="Log In"
                        disabled={loading}
                        className={`bg-[#092C16] py-2.5 px-4 text-white border border-[#CDCDCD] rounded-[10px] w-full ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                    />
                    <div className="flex items-center justify-center gap-2.5 text-sm sm:text-base flex-wrap">
                        <p className='text-[#71BF45] font-medium'>Don't have an account?</p>
                        <Link
                            href="/signup"
                            className='font-semibold underline decoration-solid'
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>

                <div className='space-y-2.5'>
                    <button className='flex items-center justify-center gap-2.5 px-3 py-[11px] border-2 border-[#71BF45] rounded-lg drop-shadow-[0_2px_12px_rgba(63,137,249,0.08)] w-full'>
                        <p className="text-base font-semibold">Continue With Google</p>
                    </button>
                    <div className="flex items-center gap-2.5 justify-center text-sm sm:text-base flex-wrap">
                        <p>Have trouble logging in?</p>
                        <p className='text-[#71BF45] font-extrabold cursor-pointer'>Get Help</p>
                    </div>
                </div>
            </form>

            {/* SECOND COLUMN - Hidden on Mobile */}
            <div className='hidden md:block relative w-full md:w-[819px] h-[400px] md:h-[732px]'>
                <Image
                    src="/login.png"
                    alt='loginImg'
                    fill
                    className='rounded-[20px] object-cover'
                />
            </div>
        </div >
    )
}

export default Page
