/**
 * AnimatedNumber Component
 * 
 * This component animates a number from its previous value to a new value using framer-motion springs.
 * It formats large numbers with K/M/B suffixes and displays them with a "+" sign.
 * Used for visually appealing stats or counters.
 */

"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

type AnimatedNumberProps = {
    data: number | undefined | null;
};

// Format number with K/M/B suffixes for thousands, millions, billions
function formatNumber(num: number) {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toLocaleString();
}

export default function AnimatedNumber({ data }: AnimatedNumberProps) {
    // Ensure value is a valid number, fallback to 0
    const safeValue = typeof data === "number" && !isNaN(data) ? data : 0;

    // Create a spring animation for the number
    const spring = useSpring(safeValue, {
        stiffness: 120,
        damping: 16,
        mass: 1,
    });

    // Transform spring value to formatted display string
    const display = useTransform(spring, (val) => {
        const rounded = Math.round(val);
        return isNaN(rounded) ? "0" : formatNumber(rounded)
    });

    // State to hold the animated text
    const [text, setText] = useState("0");

    // Update spring value when data changes
    useEffect(() => {
        spring.set(safeValue);
    }, [safeValue]);

    // Subscribe to display value changes and update text
    useEffect(() => {
        const unsubscribe = display.on("change", (v) => {
            setText(v);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [display]);

    return (
        // Render the animated number with styling and "+" sign
        <motion.span
            className="text-[#36810B] font-normal text-[38px] sm:text-[44px] lg:text-[62px]"
        >
            {text} +
        </motion.span>
    );
}
