"use client"

import { useEffect, useRef, useState } from 'react'
import { FaLeaf, FaSeedling, FaSpa } from 'react-icons/fa'

const processSteps = [
  {
    icon: <FaLeaf className="text-white text-3xl sm:text-4xl md:text-6xl bg-[#71BF45] p-1 sm:p-2 rounded-full" />,
    title: "Sourced",
    text: "Pure, natural herbs handpicked from trusted farms to ensure quality from the very start."
  },
  {
    icon: <FaSeedling className="text-white text-3xl sm:text-4xl md:text-6xl bg-[#71BF45] p-1 sm:p-2 rounded-full" />,
    title: "Processed",
    text: "Cleaned, dried, and processed carefully to retain natural essence and potency.",
  },
  {
    icon: <FaSpa className="text-white text-3xl sm:text-4xl md:text-6xl bg-[#71BF45] p-1 sm:p-2 rounded-full" />,
    title: "Packaged",
    text: "Packed in eco-friendly containers ensuring freshness and long-lasting aroma."
  }
]

export default function ProcessSection() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const travelPathRef = useRef<SVGPathElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [phase, setPhase] = useState<'before'|'pinned'|'after'>('before')
  const [activeIndex, setActiveIndex] = useState(0)
  const [wrapperHeight, setWrapperHeight] = useState(0)
  const [iconXY, setIconXY] = useState<{x:number, y:number}>({ x: 0, y: 0 })
  const [hasPos, setHasPos] = useState(false)
  const [pinnedOffset, setPinnedOffset] = useState(100)

  useEffect(() => {
    const update = () => {
      if (!wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      const vh = Math.round(window.visualViewport?.height || window.innerHeight)
      const vw = window.innerWidth
      const pinned = vw < 640 ? 0 : vw < 768 ? 100 : 120
      if (pinnedOffset !== pinned) setPinnedOffset(pinned)
      const bottomBeyond = rect.bottom > vh
      setPhase((current) => {
        if (current === 'before') {
          if (rect.top <= 0) return 'pinned'
          return 'before'
        }
        if (current === 'pinned') {
          if (rect.top > 0) return 'before'
          if (!bottomBeyond) return 'after'
          return 'pinned'
        }
        if (current === 'after') {
          if (bottomBeyond) return 'pinned'
          if (rect.top > 0) return 'before'
          return 'after'
        }
        return current
      })

      setWrapperHeight(wrapperRef.current.offsetHeight)
      const total = rect.height - vh
      if (total > 0) {
        const progress = Math.max(0, Math.min(1, (-rect.top) / total))
        const steps = processSteps.length
        const idx = Math.max(0, Math.min(steps - 1, Math.floor(progress * steps)))
        setActiveIndex((prev) => (prev === idx ? prev : idx))

        if (travelPathRef.current && svgRef.current) {
          const path = travelPathRef.current
          const svg = svgRef.current
          const totalLen = path.getTotalLength()
          const localT = Math.max(0, Math.min(1, ((progress * steps) - idx)))
          const curLen = localT * totalLen
          const pt = path.getPointAtLength(curLen)

          const vb = svg.viewBox.baseVal
          const svgRect = svg.getBoundingClientRect()
          const scale = Math.min(svgRect.width / vb.width, svgRect.height / vb.height)
          const offsetX = (svgRect.width - vb.width * scale) / 2
          const offsetY = (svgRect.height - vb.height * scale) / 2
          const xPx = offsetX + (pt.x - vb.x) * scale
          const yPx = offsetY + (pt.y - vb.y) * scale
          setIconXY({ x: xPx, y: yPx })
          if (!hasPos) setHasPos(true)
        }
      } else {
        setActiveIndex(0)
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative h-[220vh] sm:h-[240vh] md:h-[280vh]">
      <div
        className={`${phase === 'pinned' ? 'fixed left-0 right-0' : phase === 'before' ? 'absolute left-0 right-0' : 'absolute left-0 right-0'} h-screen flex flex-col items-center justify-center overflow-hidden w-full will-change-transform`}
        style={
          phase === 'pinned'
            ? { top: pinnedOffset }
            : phase === 'after'
            ? { top: Math.max(0, Math.round((wrapperHeight - (typeof window !== 'undefined' ? (window.visualViewport?.height || window.innerHeight) : 0)) + pinnedOffset)) }
            : { top: pinnedOffset }
        }
      >
        <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-[#093C16] mt-16 sm:mt-20 md:mt-24 mb-8">
          Our Process
        </h3>

        <div className="relative w-full h-fit overflow-hidden max-w-[1600px] mx-auto aspect-[1440/632]">
          <svg
            ref={svgRef}
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
            <path
              ref={travelPathRef}
              d="M1892 1062.5C1892 780.708 1768.47 510.456 1548.58 311.199C1328.7 111.942 1030.47 0 719.5 0C408.534 0 110.304 111.942 -109.583 311.199C-329.469 510.456 -453 780.707 -453 1062.5"
              stroke="transparent"
              fill="none"
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

          {hasPos && (
            <div
              className="absolute pointer-events-none"
              style={{ left: 0, top: 0, transform: `translate3d(${iconXY.x}px, ${iconXY.y}px, 0) translate3d(-50%, -50%, 0)`, willChange: 'transform' }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl text-[#71BF45]">
                {processSteps[activeIndex].icon}
              </div>
            </div>
          )}
        </div>

        <div className="absolute w-full flex items-start justify-center">
          {processSteps.map((step, i) => (
            <div
              key={i}
              className="absolute mt-7 sm:mt-0 lg:-mt-10 left-1/2 -translate-x-1/2 text-center w-[72%] sm:w-[75%] md:w-[55%] max-w-[640px] pointer-events-none transition-opacity duration-300 px-2"
              style={{ opacity: activeIndex === i ? 1 : 0 }}
            >
              <h4 className="font-bold text-md sm:text-xl md:text-2xl text-[#093C16]">
                {step.title}
              </h4>
              <p className="text-sm sm:text-lg text-[#093C16]">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
