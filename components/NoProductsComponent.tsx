"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export default function NoProductsComponent() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center text-gray-800 text-center">
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

            {/* Shopping bag icon */}
            <motion.div
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", duration: 1 }}
                className="mb-6 z-10"
            >
                <ShoppingBag className="w-24 h-24 text-[#71BF45]" />
            </motion.div>

            {/* Message Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl font-extrabold tracking-tight text-[#71BF45] z-10"
            >
                No Products Found
            </motion.h1>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-4 text-lg text-gray-500 text-center max-w-md z-10"
            >
                Oops! Looks like we don&apos;t have any products available right now.
            </motion.p>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-4 text-gray-500 text-center max-w-md z-10"
            >
                Tip: Try adjusting filters or check back soon for updates!
            </motion.p>

            {/* Decorative text glow */}
            <motion.div
                className="absolute text-[8rem] font-extrabold text-[#71BF45]/10 select-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
            >
                EMPTY
            </motion.div>
        </div>
    );
}
