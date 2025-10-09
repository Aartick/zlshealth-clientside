"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Ghost, Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-white text-gray-800 overflow-hidden">
            {/* Floating background circles */}
            <motion.div
                className="absolute top-20 left-10 w-40 h-40 bg-[#71BF45]/20 rounded-full blur-3xl"
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-52 h-52 bg-[#71BF45]/20 rounded-full blur-3xl"
                animate={{ y: [0, 30, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            />

            {/* Ghost Icon */}
            <motion.div
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", duration: 1 }}
                className="mb-6 z-10"
            >
                <Ghost className="w-24 h-24 text-[#71BF45]" />
            </motion.div>

            {/* 404 Text */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-6xl font-extrabold tracking-tight text-[#71BF45] z-10"
            >
                404
            </motion.h1>

            {/* Message */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-4 text-lg text-gray-500 text-center max-w-md z-10"
            >
                Oops! The page you&apos;re looking for doesn&apos;t exist.
                Maybe it was moved or deleted — let&apos;s get you back home safely.
            </motion.p>

            {/* Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-8 z-10"
            >
                <Link
                    href="/"
                    className="flex items-center gap-2 bg-[#71BF45] hover:bg-[#63aa3c] text-white shadow-lg rounded-xl px-6 py-3 transition-all duration-300"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </motion.div>

            {/* Decorative text glow */}
            <motion.div
                className="absolute text-[8rem] font-extrabold text-[#71BF45]/10 select-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
            >
                LOST
            </motion.div>
        </div >
    )
}
