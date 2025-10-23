"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { FaLeaf, FaSeedling, FaSpa } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const processSteps = [
    {
        icon: <FaLeaf className="text-white text-5xl bg-[#71BF45] p-3 rounded-full" />,
        title: "Sourced",
        text: "Pure, natural herbs handpicked from trusted farms to ensure quality from the very start.",
    },
    {
        icon: <FaSeedling className="text-white text-5xl bg-[#71BF45] p-3 rounded-full" />,
        title: "Processed",
        text: "Cleaned, dried, and processed carefully to retain natural essence and potency.",
    },
    {
        icon: <FaSpa className="text-white text-5xl bg-[#71BF45] p-3 rounded-full" />,
        title: "Packaged",
        text: "Packed in eco-friendly containers ensuring freshness and long-lasting aroma.",
    },
];

export default function OurProcess() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const pathRef = useRef<SVGPathElement | null>(null);
    const iconRefs = useRef<HTMLDivElement[]>([]);
    const textRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const container = containerRef.current;
            const path = pathRef.current;
            if (!container || !path) return;

            // ---- TUNABLES ----
            const STEP_DUR = 1.8; // timeline time units per step (affects pacing)
            const MOTION_DUR = 1.8; // how long icon moves along path (in timeline units)
            const SCROLL_PIXELS_PER_STEP = 900; // how many px of scroll map to each step
            const totalSteps = processSteps.length;
            const totalScroll = SCROLL_PIXELS_PER_STEP * totalSteps; // used for pin end

            // Reset / initial styles
            gsap.set(iconRefs.current, { opacity: 0, xPercent: 0, yPercent: 0 });
            processSteps.forEach((_, i) => {
                if (i === 0) {
                    // faint hint for first text before its icon reaches center
                    gsap.set(textRefs.current[i], { opacity: 0.25, y: 24 });
                } else {
                    gsap.set(textRefs.current[i], { opacity: 0, y: 24 });
                }
            });

            // Section subtle fade-in when entering
            gsap.from(container, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom-=80",
                    end: "top center",
                    scrub: true,
                },
            });

            // Main timeline mapped to scroll and pinned
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: `+=${totalScroll}`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            // Build timeline: each step gets a label at stepStart
            processSteps.forEach((_, i) => {
                const icon = iconRefs.current[i];
                const text = textRefs.current[i];
                if (!icon || !text) return;

                const stepStart = i * STEP_DUR;
                const stepLabel = `step${i}`;
                tl.addLabel(stepLabel, stepStart);

                // Ensure icon visible at start of its motion
                tl.set(icon, { opacity: 1 }, stepLabel);

                // ICON MOTION: move along entire path between 0->1, but we offset the start time so icons are spaced
                tl.to(
                    icon,
                    {
                        motionPath: {
                            path,
                            align: path,
                            alignOrigin: [0.5, 0.5],
                            start: 0,
                            end: 1,
                        },
                        ease: "none",
                        duration: MOTION_DUR,
                        immediateRender: false,
                    },
                    stepLabel // start moving at label
                );

                // ---- TEXT BEHAVIOUR ----
                // Text fades in sooner (as icon enters visible region)
                const fadeInStart = stepStart + MOTION_DUR * 0.1; // start earlier
                const fadeInDur = MOTION_DUR * 0.25;
                // const holdEnd = stepStart + MOTION_DUR * 0.58; // hold until about 60%
                const fadeOutStart = stepStart + MOTION_DUR * 0.7;
                const fadeOutDur = MOTION_DUR * 0.25;

                // Fade in from bottom
                tl.fromTo(
                    text,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: fadeInDur, ease: "power2.out" },
                    fadeInStart
                );

                // Hold full visibility until near the exit phase
                // tl.to(text, { opacity: 1, y: 0, duration: holdEnd - (fadeInStart + fadeInDur) }, fadeInStart + fadeInDur);

                // Fade out upward (not sideways)
                if (i !== processSteps.length - 1) {
                    tl.to(
                        text,
                        { opacity: 0, y: -30, duration: fadeOutDur, ease: "power2.inOut" },
                        fadeOutStart
                    );
                } else {
                    // last stays visible
                    tl.to(text, { opacity: 1, y: 0, duration: 0.05 }, fadeOutStart);
                }


                // small no-op to advance timeline if there's leftover time before next label
                // const gap = STEP_DUR - MOTION_DUR;
                // if (gap > 0) tl.to({}, { duration: gap }, `>${0}`);
            });

            // Ensure last step is locked visible when container passes (both directions)
            const lastIcon = iconRefs.current[totalSteps - 1];
            const lastText = textRefs.current[totalSteps - 1];
            if (lastIcon && lastText) {
                ScrollTrigger.create({
                    trigger: container,
                    start: "bottom center",
                    onEnter: () => gsap.set([lastIcon, lastText], { opacity: 1 }),
                    onEnterBack: () => gsap.set([lastIcon, lastText], { opacity: 1 }),
                });
            }

            // refresh to ensure sizes & pin spacer are calculated
            ScrollTrigger.refresh();
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full overflow-hidden pt-36 scrollbar-hide">
            <h3 className="text-center text-3xl font-semibold text-[#093C16] pt-10 mb-6">Our Process</h3>

            {/* VISIBLE CURVE */}
            <div className="relative w-full h-[632px]">
                <svg
                    width="100%"
                    height="632"
                    viewBox="0 0 1440 632"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[48%] pointer-events-none"
                >
                    <path
                        ref={pathRef}
                        d="M1892 1062.5C1892 780.708 1768.47 510.456 1548.58 311.199C1328.7 111.942 1030.47 2.12747e-05 719.5 0C408.534 -2.12747e-05 110.304 111.942 -109.583 311.199C-329.469 510.456 -453 780.707 -453 1062.5L719.5 1062.5H1892Z"
                        stroke="url(#paint0_linear)"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <defs>
                        <linearGradient id="paint0_linear" x1="-644" y1="423" x2="1489.73" y2="268.492" gradientUnits="userSpaceOnUse">
                            <stop stopColor="white" />
                            <stop offset="1" stopColor="#71BF45" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* ICONS (absolute; motionPath will move them) */}
                {processSteps.map((step, i) => (
                    <div
                        key={i}
                        ref={(el) => { if (el) iconRefs.current[i] = el }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ willChange: "transform, opacity" }}
                    >
                        {step.icon}
                    </div>
                ))}
            </div>

            {/* TEXTS (stacked, centered below curve) */}
            <div className="absolute top-1/2 w-full h-[120px] flex items-start justify-center pointer-events-none">
                {processSteps.map((step, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            if (el) textRefs.current[i] = el
                        }}
                        className="absolute left-1/2 -translate-x-1/2 w-[640px] text-center"
                    >
                        <h4 className="font-bold text-xl text-[#093C16]">{step.title}</h4>
                        <p className="text-lg text-[#093C16]">{step.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
