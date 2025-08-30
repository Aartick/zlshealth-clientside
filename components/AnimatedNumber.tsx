"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

type AnimatedNumberProps = {
    data: number | undefined | null;
};

function formatNumber(num: number) {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toLocaleString();
}

export default function AnimatedNumber({ data }: AnimatedNumberProps) {
    const safeValue = typeof data === "number" && !isNaN(data) ? data : 0;

    const spring = useSpring(safeValue, {
        stiffness: 120,
        damping: 16,
        mass: 1,
    });

    const display = useTransform(spring, (val) => {
        const rounded = Math.round(val);
        return isNaN(rounded) ? "0" : formatNumber(rounded)
    });

    const [text, setText] = useState("0");

    useEffect(() => {
        spring.set(safeValue);
    }, [safeValue]);

    useEffect(() => {
        const unsubscribe = display.on("change", (v) => {
            setText(v);
        });

        return () => unsubscribe();
    }, [display]);

    return (
        <motion.span
            className="text-[#36810B] font-normal text-[38px] sm:text-[44px] lg:text-[62px]"
        >
            {text} +
        </motion.span>
    );
}
