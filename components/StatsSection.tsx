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
  const statsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mmVar: any = null
    ScrollTrigger.normalizeScroll(true)
    const ctx = gsap.context(() => {
      const paras = gsap.utils.toArray(".para") as HTMLElement[];

      // Set initial position - all paragraphs stacked
      gsap.set(paras, {
        position: "absolute",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        whiteSpace: "nowrap",
        force3D: true,
        willChange: "transform, opacity"
      })

      // Split all paragraphs into letters
      const allLetters: HTMLElement[][] = paras.map((para) => {
        const letters = para.textContent!.split("").map((char) => {
          const span = document.createElement("span");
          if (char === " ") {
            span.innerHTML = "&nbsp;";
          } else {
            span.textContent = char
          }
          span.style.display = "inline-block";
          span.style.willChange = "transform, opacity";
          span.style.backfaceVisibility = "hidden";
          return span;
        });

        para.textContent = "";
        letters.forEach((l) => para.appendChild(l))
        return letters;
      });

      // Set initial states for all letters
      allLetters.forEach((letters, i) => {
        if (i === 0) {
          gsap.set(letters, { y: 0, opacity: 1, force3D: true })
        } else {
          gsap.set(letters, { y: 80, opacity: 0, force3D: true })
        }
      });

      // Set initial state for section - below viewport
      gsap.set(sectionRef.current, { 
        y: "100vh"
      });

      const buildTimeline = (endValue: string, startValue: string) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: startValue,
          end: endValue,
          scrub: 1,
          pin: true,
          pinSpacing: false,
          anticipatePin: 2,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        }
      });

        tl.to(
          sectionRef.current,
          {
            y: 0,
            duration: 2,
            ease: "power2.out"
          },
          0
        );

        tl.to({}, { duration: 1 }, 1);

        tl.to(
          allLetters[0],
          {
            y: -80,
            opacity: 0,
            stagger: 0.015,
            duration: 0.8,
            ease: "power2.in",
            force3D: true
          },
          2
        );

        tl.to(
          allLetters[1],
          {
            y: 0,
            opacity: 1,
            stagger: 0.02,
            duration: 0.8,
            ease: "power2.out",
            force3D: true
          },
          2.5
        );

        tl.to({}, { duration: 1 }, 3.3);

        tl.to(
          allLetters[1],
          {
            y: -80,
            opacity: 0,
            stagger: 0.015,
            duration: 0.8,
            ease: "power2.in",
            force3D: true
          },
          4.3
        );

        tl.to(
          allLetters[2],
          {
            y: 0,
            opacity: 1,
            stagger: 0.02,
            duration: 0.8,
            ease: "power2.out",
            force3D: true
          },
          4.8
        );

        tl.to({}, { duration: 1 }, 5.6);

        tl.to(
          sectionRef.current,
          {
            y: "-100vh",
            duration: 2,
            ease: "power2.in"
          },
          5
        );

        return tl;
      };

      mmVar = gsap.matchMedia();
      mmVar.add("(min-width: 768px)", () => {
        gsap.set(sectionRef.current, { y: "100vh" });
        buildTimeline("+=325%", "top bottom");
      });
      mmVar.add("(max-width: 767px)", () => {
        gsap.set(sectionRef.current, { y: "70vh" });
        buildTimeline("+=220%", "top 80%");
      });

      

    }, containerRef)

    return () => {
      ctx.revert();
      mmVar?.revert();
    };
  }, [])
  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen -mt-[200px] md:-mt-[200px] mb-[800px] md:mb-[1900px]"
    >
      {/* Fixed container that holds everything */}
      <div
        ref={statsContainerRef}
        className="flex flex-col items-center justify-center h-screen w-full"
      >
        {/* LEFT SHADOW */}
        <svg
          className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
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
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
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

        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 flex flex-col-reverse h-fit md:h-auto md:flex-row items-center gap-12 md:gap-20 md:justify-around">
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

        {/* STATS TEXT CONTAINER */}
        <div
          ref={containerRef}
          className="relative z-20 w-full h-[100px] overflow-hidden mt-8"
        >
          {paragraphs.map((text, i) => {
            return (
              <p key={i} className="para font-semibold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-center">
                {text}
              </p>
            )
          })}
        </div>
      </div>
    </section>
  )
}
