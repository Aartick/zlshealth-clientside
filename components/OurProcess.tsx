"use client"
import { gsap } from 'gsap'
import MotionPathPlugin from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'
import { FaLeaf, FaSeedling, FaSpa } from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

const processSteps = [
    {
        icon: <FaLeaf className="text-white text-6xl bg-[#71BF45] p-2 rounded-full" />,
        title: "Sourced",
        text: "Pure, natural herbs handpicked from trusted farms to ensure quality from the very start."
    },
    {
        icon: <FaSeedling className="text-white text-6xl bg-[#71BF45] p-2 rounded-full" />,
        title: "Processed",
        text: "Cleaned, dried, and processed carefully to retain natural essence and potency.",
    },
    {
        icon: <FaSpa className="text-white text-6xl bg-[#71BF45] p-2 rounded-full" />,
        title: "Packaged",
        text: "Packed in eco-friendly containers ensuring freshness and long-lasting aroma."
    }
]

function OurProcess() {
    const divRef = useRef<HTMLDivElement>(null)
    const pathRef = useRef<SVGPathElement>(null)
    const iconRefs = useRef<HTMLDivElement[]>([])
    const textRefs = useRef<HTMLDivElement[]>([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            const path = pathRef.current
            if (!path) return

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: divRef.current,
                    start: "top top",
                    end: "+=4000",
                    scrub: true,
                    pin: true,
                    anticipatePin: 1
                },
            })

            gsap.set(iconRefs.current, { opacity: 0 })
            gsap.set(textRefs.current, { opacity: 0 })

            processSteps.forEach((_, i) => {
                const icon = iconRefs.current[i]
                const text = textRefs.current[i]
                if (!icon || !text) return

                const delay = i * 2 // timeline offset for each step

                // Icon fade-in from left
                tl.fromTo(
                    icon,
                    { opacity: 0, xPercent: -100 },
                    { opacity: 1, xPercent: 0, duration: 0.3, ease: "power2.out" },
                    delay
                )

                // Text fade-in
                tl.fromTo(
                    text,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                    delay + 0.2
                )

                // Icon moves along full path
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
                        duration: 1.6,
                        ease: "none",
                    },
                    delay + 0.4
                )

                // Icon + Text fade-out to right
                tl.to(
                    icon,
                    { opacity: 0, xPercent: 100, duration: 0.4, ease: "power2.inOut" },
                    delay + 1.8
                )
                tl.to(
                    text,
                    { opacity: 0, y: -20, duration: 0.4, ease: "power2.inOut" },
                    delay + 1.8
                )
            })
        }, divRef)

        return () => ctx.revert()
    }, [])

    return (
        <div
            ref={divRef}
            className='relative overflow-hidden h-screen pt-36'
        >
            <h3 className='font-semibold text-3xl text-[#093C16] text-center mb-20'>Our Process</h3>

            <div className="relative w-full h-full">
                <svg
                    width="100%"
                    height="632"
                    viewBox="0 0 1440 632"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%]'
                >
                    <path
                        ref={pathRef}
                        id='motionPath'
                        d="M1892 1062.5C1892 780.708 1768.47 510.456 1548.58 311.199C1328.7 111.942 1030.47 2.12747e-05 719.5 0C408.534 -2.12747e-05 110.304 111.942 -109.583 311.199C-329.469 510.456 -453 780.707 -453 1062.5L719.5 1062.5H1892Z"
                        stroke="url(#paint0_linear_1974_9843)"
                        strokeWidth="16"
                    />
                    <defs>
                        <linearGradient id="paint0_linear_1974_9843" x1="-644" y1="423" x2="1489.73" y2="268.492" gradientUnits="userSpaceOnUse">
                            <stop stopColor="white" />
                            <stop offset="1" stopColor="#71BF45" />
                        </linearGradient>
                    </defs>
                </svg>

                {processSteps.map((step, i) => (
                    <div
                        key={i}
                        ref={(el) => { if (el) iconRefs.current[i] = el }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0"
                    >
                        {step.icon}
                    </div>
                ))}
            </div>

            {/* TEXTS */}
            <div className="absolute top-1/2 w-full h-[60px] overflow-hidden text-center">
                {processSteps.map((step, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            if (el) textRefs.current[i] = el
                        }}
                        className="absolute left-1/2 -translate-x-1/2 w-96 opacity-0"
                    >
                        <h4 className="font-bold text-xl text-[#093C16]">{step.title}</h4>
                        <p className="text-xl text-[#093C16]">{step.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OurProcess