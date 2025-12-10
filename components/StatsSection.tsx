"use client"

import { useEffect, useRef, useState } from 'react'
import { TextAnimate } from '@/components/ui/text-animate'

const paragraphs = [
  "50+ Herbal Products",
  "1000+ Orders / Day",
  "50,000+ Customers",
]

export default function StatsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [phase, setPhase] = useState<'before'|'pinned'|'after'>('before')
  const [wrapperHeight, setWrapperHeight] = useState(0)

useEffect(() => {
    const update = () => {
      if (!wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      const vh = window.innerHeight

      const isPinned = rect.top <= 0 && rect.bottom >= vh
      const nextPhase = isPinned ? 'pinned' : rect.top > 0 ? 'before' : 'after'
      setPhase((prev) => (prev === nextPhase ? prev : nextPhase))

      const total = rect.height - vh
      if (total > 0) {
        const progress = Math.max(0, Math.min(1, (-rect.top) / total))
        let idx = 0
        if (progress < 0.33) idx = 0
        else if (progress < 0.66) idx = 1
        else idx = 2
        setActiveIndex((prev) => (prev === idx ? prev : idx))
      } else {
        setActiveIndex(0)
      }
    }
    const measure = () => {
      if (!wrapperRef.current) return
      setWrapperHeight(wrapperRef.current.offsetHeight)
      update()
    }
    measure()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative h-[230vh] md:h-[260vh]">
      <div
        className={`${phase === 'pinned' ? 'fixed top-0 left-0 right-0' : phase === 'before' ? 'absolute top-0 left-0 right-0' : 'absolute left-0 right-0'} h-screen flex items-center overflow-hidden w-full`}
        style={phase === 'after' ? { top: `${Math.max(0, wrapperHeight - (typeof window !== 'undefined' ? window.innerHeight : 0))}px` } : undefined}
      >
        <div
          className="flex flex-col items-center justify-center h-screen w-full"
        >
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
            <p className="font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-xl">
              A brand rooted in <span className="font-extralight">nature.</span>
            </p>

            <div className="relative w-[150px] h-[150px] md:w-[300px] md:h-[300px]">
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

          <div
            className="relative z-20 w-full h-[90px] sm:h-[100px] md:h-[140px] overflow-hidden mt-6"
          >
            {paragraphs.map((text, i) => (
              activeIndex === i ? (
                <TextAnimate
                  key={i}
                  animation="blurInUp"
                  by="character"
                  once
                  startOnView={false}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-center whitespace-nowrap"
                >
                  {text}
                </TextAnimate>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
