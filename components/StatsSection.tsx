"use client"

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const paragraphs = [
  "50+ Herbal Products",
  "1000+ Orders / Day",
  "50,000+ Customers",
]

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // GSAP context ensures scoped animations (cleanup on unmount)
    const ctx = gsap.context(() => {
      // Get all <p> tags with class "para"
      const paras = gsap.utils.toArray(".para") as HTMLElement[];

      // Detect if desktop (screen width >= 1024px)
      const isDesktop = window.innerWidth >= 1024;

      // Step 1: Place all paragraphs on top of each other with GPU acceleration hints
      gsap.set(paras, {
        position: "absolute",
        top: "50%",
        left: "50%",
        xPercent: -50, // centers horizontally
        yPercent: -50, // centers vertically
        whiteSpace: "nowrap", // ensures text stays in one line
        opacity: 1,
        force3D: true, // Enable GPU acceleration
        willChange: "transform" // Hint browser for optimization
      })

      // Step 2: Create the main GSAP timeline that runs as user scrolls
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current, // element to watch
          start: "top 80%", // start animation when section is 80% down viewport
          end: "bottom 30%", // end when bottom of section is 30% from top
          scrub: isDesktop ? 0.8 : 0.5, // smooth scrubbing
          toggleActions: "play none none reverse", // play forward on enter, reverse on leave
          invalidateOnRefresh: true, // Recalculate on resize/orientation change
        }
      });

      // Step 3: Loop over each paragraph for sequential animation
      paras.forEach((para, i) => {
        // Split paragraph text into spans (each letter)
        const letters = para.textContent!.split("").map((char) => {
          const span = document.createElement("span");

          if (char === " ") {
            span.innerHTML = "&nbsp;";
          } else {
            span.textContent = char
          }
          span.style.display = "inline-block";
          span.style.willChange = "transform"; // Optimize each letter
          span.style.backfaceVisibility = "hidden"; // Force compositing layer
          span.style.transform = "translateY(100px)" // move down for entrance effect
          return span;
        }
        );

        // Replace original text with these span letters
        para.textContent = ""; // clear old text
        letters.forEach((l) => para.appendChild(l)) // append new spans

        if (i === 0) {
          gsap.set(letters, { y: 0, force3D: true })
        } else {
          // Fade in letter by letter quickly with GPU acceleration
          tl.to(
            letters,
            {
              y: 0, // move to normal position
              stagger: 0.03, //small delay between each letter
              duration: 0.4, // fast fade
              ease: "power3.out",
              force3D: true // Enable GPU acceleration
            },
            `step${i}` // label for syncing animations
          )
        }

        // Step 5: Hold paragraph for a short time while scrolling
        tl.to({}, { duration: 0.5 }); // just a delay (empty tween)

        if (i !== paras.length - 1) {
          // Step 6: Fade out letter by letter (move upward & vanish) with GPU acceleration
          tl.to(
            letters,
            {
              y: -120, // move upward
              stagger: 0.02,
              duration: 0.3,
              ease: "power3.in",
              force3D: true // Enable GPU acceleration
            },
            `step${i}+=0.8`
          )
        }
      })
    }, containerRef)

    // Cleanup GSAP animations when component unmounts
    return () => ctx.revert();
  }, [])

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center justify-center h-screen w-full md:overflow-hidden"
    >
      {/* LEFT SHADOW */}
      <svg
        className="absolute left-0 top-1/2 -translate-y-1/2"
        width="317"
        height="798"
        viewBox="0 0 317 798"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.25" filter="url(#filter0_f_2_2678)">
          <path
            d="M43.1538 557.284C96.3306 527.095 99.2293 431.794 49.6282 344.424C0.0271053 257.053 -83.2908 210.698 -136.468 240.887C-189.644 271.076 -192.543 366.377 -142.942 453.748C-93.3409 541.118 -10.023 587.473 43.1538 557.284Z"
            fill="#71BF45"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_2_2678"
            x="-409.469"
            y="0.521866"
            width="725.624"
            height="797.127"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="115.571"
              result="effect1_foregroundBlur_2_2678"
            />
          </filter>
        </defs>
      </svg>

      {/* RIGHT SHADOW */}
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2"
        width="320"
        height="798"
        viewBox="0 0 320 798"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.25" filter="url(#filter0_f_2_2682)">
          <path
            d="M453.154 557.284C506.331 527.095 509.229 431.794 459.628 344.424C410.027 257.053 326.709 210.698 273.532 240.887C220.356 271.076 217.457 366.377 267.058 453.748C316.659 541.118 399.977 587.473 453.154 557.284Z"
            fill="#71BF45"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_2_2682"
            x="0.530899"
            y="0.521866"
            width="725.624"
            height="797.127"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="115.571"
              result="effect1_foregroundBlur_2_2682"
            />
          </filter>
        </defs>
      </svg>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 pt-16 md:pt-24 lg:pt-20 flex flex-col-reverse h-fit md:h-auto md:flex-row items-center gap-12 md:gap-20 md:justify-around">
        {/* LEFT TEXT */}
        <p className="font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-xl">
          A brand rooted in <span className="font-extralight">nature.</span>
        </p>

        {/* RIGHT LEAF + STEM */}
        <div className="relative w-[150px] h-[150px] md:w-[300px] md:h-[300px]">
          {/* STEM */}
          <svg
            className="absolute -bottom-24 left-8 md:bottom-12 md:left-28 -translate-x-1/2 w-[160px] h-[130px]"
            viewBox="0 0 163 127"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.3958 116.492C8.96965 82.7262 32.452 55.4198 75.1056 46.917C107.062 40.5409 139.589 22.4273 152.413 10.7699"
              stroke="url(#paint0_linear_2_2665)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2_2665"
                x1="1130.46"
                y1="-866.664"
                x2="198.397"
                y2="280.34"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#71BF45" />
                <stop offset="1" stopColor="#355920" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* LEAF */}
          <svg
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[240px] h-[230px]"
            viewBox="0 0 246 227"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M107.619 216.616C84.2678 217.382 61.4295 210.694 43.6333 197.877C25.8372 185.06 14.3831 167.05 11.5427 147.421C8.70241 127.791 14.6834 107.976 28.2993 91.9033C41.9153 75.8311 62.1718 64.6766 85.0511 60.6521C160.336 45.9782 180.038 39.5221 205.459 10.8047C219.709 32.9127 234.045 57.0466 235.861 100.041C238.476 161.945 177.043 214.516 107.619 216.616Z"
              stroke="url(#paint0_linear_2_2664)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2_2664"
                x1="240.434"
                y1="-47.0908"
                x2="26.4903"
                y2="193.888"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#71BF45" />
                <stop offset="1" stopColor="#355920" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* STATS */}
      <div
        ref={containerRef}
        className="relative z-20 w-full h-[100px] overflow-hidden"
      >
        {paragraphs.map((text, i) => {
          return (
            <p key={i} className="para font-semibold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-center">
              {text}
            </p>
          )
        })}
      </div>
    </section>
  )
}
