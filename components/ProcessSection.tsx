"use client"

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { FaLeaf, FaSeedling, FaSpa } from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

const processSteps = [
  {
    icon: <FaLeaf className="text-white text-4xl md:text-6xl bg-[#71BF45] p-2 rounded-full" />,
    title: "Sourced",
    text: "Pure, natural herbs handpicked from trusted farms to ensure quality from the very start."
  },
  {
    icon: <FaSeedling className="text-white text-4xl md:text-6xl bg-[#71BF45] p-2 rounded-full" />,
    title: "Processed",
    text: "Cleaned, dried, and processed carefully to retain natural essence and potency.",
  },
  {
    icon: <FaSpa className="text-white text-4xl md:text-6xl bg-[#71BF45] p-2 rounded-full" />,
    title: "Packaged",
    text: "Packed in eco-friendly containers ensuring freshness and long-lasting aroma."
  }
]

export default function ProcessSection() {
  const divRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const iconRefs = useRef<HTMLDivElement[]>([])
  const textRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = divRef.current;
      const path = pathRef.current;
      if (!container || !path) return;

      // Detect if desktop (screen width >= 1024px)
      const isDesktop = window.innerWidth >= 1024;

      // ---- TUNABLES ----
      const STEP_DUR = 1.8; // timeline time units per step (affects pacing)
      const MOTION_DUR = 1.8; // how long icon moves along path (in timeline units)

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

      // Main timeline mapped to scroll (no pinning for smooth experience)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%", // start animation when section is 80% down viewport
          end: "bottom 20%", // end when bottom of section is 20% from top
          scrub: isDesktop ? 0.8 : 0.5, // smooth scrubbing
          toggleActions: "play none none reverse", // play forward on enter, reverse on leave
          invalidateOnRefresh: true,
        },
      });

      //Build timeline: each step gets a label at stepStart
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
      });

      // refresh to ensure sizes & pin spacer are calculated
      ScrollTrigger.refresh();
    }, divRef);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      ctx.revert()
    }
  }, []);

  return (
    <section ref={divRef} className="flex flex-col items-center justify-center h-screen relative w-full overflow-hidden md:pt-36">
      <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-[#093C16] mb-8">
        Our Process
      </h3>

      {/* Responsive Curve Wrapper */}
      <div className="relative w-full h-fit overflow-hidden max-w-[1600px] mx-auto aspect-[1440/632]">
        <svg
          viewBox="-100 -80 1640 792"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
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
            <linearGradient
              id="paint0_linear"
              x1="-644"
              y1="423"
              x2="1489.73"
              y2="268.492"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="#71BF45" />
            </linearGradient>
          </defs>
        </svg>

        {/* ICONS FOLLOWING PATH */}
        {processSteps.map((step, i) => (
          <div
            key={i}
            ref={(el) => { if (el) iconRefs.current[i] = el }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl text-[#71BF45]">{step.icon}</div>
          </div>
        ))}
      </div>

      {/* TEXTS (below curve, responsive widths) */}
      <div className="absolute w-full flex items-start justify-center">
        {processSteps.map((step, i) => (
          <div
            key={i}
            ref={(el) => { if (el) textRefs.current[i] = el }}
            className="absolute left-1/2 -translate-x-1/2 text-center w-[85%] sm:w-[70%] md:w-[55%] max-w-[640px] opacity-0 pointer-events-none"
          >
            <h4 className="font-bold text-lg sm:text-xl md:text-2xl text-[#093C16]">
              {step.title}
            </h4>
            <p className="text-base sm:text-lg text-[#093C16]">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
