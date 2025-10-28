"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react"
import { IoIosCheckmark } from "react-icons/io";
import HumanOrgansSvg from "@/components/HumanOrgansSvg";

gsap.registerPlugin(ScrollTrigger);

const tableData = [
  {
    col1: "Absorption Rate",
    col2: "",
    col3: "-30% (low cellular uptake)"
  },
  {
    col1: "Effective Timeline",
    col2: "-30% (low cellular uptake)",
    col3: "2-4 weeks for visible, lasting results"
  },
  {
    col1: "Approach",
    col2: "3-6 months before noticeable results",
    col3: "Targets root causes via multi-pathway healing"
  },
  {
    col1: "Science + Tradition",
    col2: "",
    col3: "5,000 years of herbal wisdom + cutting-edge nanoscience"
  },
  {
    col1: "Immune System Expertise",
    col2: "Generalized support only",
    col3: "Specialized formulas for chronic & complex conditions"
  },
  {
    col1: "Nutrient Synergy",
    col2: "Ingredients work in isolation",
    col3: "Holistic synergy - minerals, vitamins, enzymes & hormones optimized together"
  },
  {
    col1: "Side Effects",
    col2: "Possible digestive discomfort, fatigue",
    col3: "Zero - gentle, safe, and effective"
  },
  {
    col1: "User Experience",
    col2: "Slow, inconsistent results",
    col3: "Fast, consistent, and transformative healing"
  }
]

export default function Page() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const totalWidth = container?.scrollWidth || 0;
    const viewportWidth = window.innerWidth;

    // Horizontal scroll setup
    gsap.to(container, {
      x: () => -(totalWidth - viewportWidth),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Mouse-follow glowing gradient
    const glow = glowRef.current;
    const moveGlow = (e: MouseEvent) => {
      if (!glow) return;
      gsap.to(glow, {
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
        duration: 0.6,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", moveGlow);

    const cursor = cursorRef.current;
    const moveCursor = (e: MouseEvent) => {
      if (!cursor) return;
      gsap.to(cursor, {
        x: e.clientX - 6,
        y: e.clientY - 6,
        duration: 0.1,
        ease: "power3.out"
      })
    }
    window.addEventListener("mousemove", moveCursor)

    return () => {
      window.removeEventListener("mousemove", moveGlow);
      window.removeEventListener("mousemove", moveCursor)
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-[#191717] text-white -mt-24 sm:-mt-28 lg:-mt-36 cursor-none"
      style={{ backgroundColor: "#191717", paddingTop: "80px" }}
    >
      {/* Small white circular cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-50 w-4 h-4 rounded-full bg-white mix-blend-difference"
        style={{
          transform: "translate(-50%, -50%)",
          transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s ease"
        }}
      />

      {/* Glowing background (behind everything but visible) */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60
        blur-[120px] z-0"
        style={{
          filter: "blur(100px)",
          width: "400px",
          height: "400px",
          background:
            "linear-gradient(180deg, #5CFF00 0%, #F58A25 100%, #3A00FF 100%)",
        }}
      />

      {/* Eclipse background (bottom-left shadow) */}
      <div
        className="pointer-events-none fixed rounded-full z-0"
        style={{
          width: "820px",
          height: "820px",
          top: "131px",
          left: "159px",
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(9, 60, 22, 0.8) 100%)",
          filter: "blur(200px)",
          borderRadius: "50%",
          opacity: 1
        }}
      />

      {/* Horizontal scroll container */}
      <div ref={scrollContainerRef} className="flex h-screen w-max relative z-10">
        {/* ---------- PANEL 1 ---------- */}
        <section className="panel flex-shrink-0 w-screen h-screen flex items-center justify-center px-8 py-5">
          <div className="relative flex items-center justify-between h-full w-full">
            <div className="flex flex-col justify-around pb-10 h-full">
              <div>
                <h5 className="font-light text-3xl text-white">
                  Why Zealous Health is Different
                </h5>
                <h1 className="font-semibold text-5xl text-white tracking-tighter text-nowrap">
                  Science Meets Ancient Wisdom
                </h1>
              </div>

              <p className="text-xl text-[#D8DED5] w-fit">
                Ever wonder why you take vitamins but don&apos;t feel the difference?
                Most supplements are poorly absorbed — your body only uses about
                10–20% of what you swallow while the rest is just expensive pee.
              </p>

              <div>
                <h5 className="font-light text-3xl text-white">
                  Our Game-Changing Solution
                </h5>
                <div className="flex items-center gap-4">
                  <h1 className="font-semibold text-[40px] text-white text-nowrap">
                    Nano-Tech Meets Nature
                  </h1>
                  <div className="w-[137px] border border-white" />
                </div>
              </div>
            </div>

            <Image
              src="/science/human_body.png"
              width={600}
              height={600}
              alt="human_body"
            />
          </div>
        </section>

        {/* ---------- PANEL 2 ---------- */}
        <section className="panel flex-shrink-0 h-screen flex items-center gap-40 text-white px-8">
          <div className="flex flex-col justify-around h-screen">
            <div className="space-y-5">
              <h5 className="font-medium text-4xl text-white">
                BIOCAGE Technology™
              </h5>
              <p className="font-light text-3xl text-[#D8DED5]">
                Think of it as a{" "}
                <span className="font-normal italic">&quot;smart taxi&quot;</span> for your
                nutrients
              </p>
            </div>

            {/* ====== FEATURES ====== */}
            <div>
              {/* ====== HEADING ====== */}
              <p className="text-3xl text-white mb-6">What makes it special?</p>

              {/* GRID LAYOUT FOR FEATURES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-[600px]">
                {/* Small Box 1: Nano-sized bodyguard */}
                <div className="p-6 rounded-[20px] flex flex-col justify-between bg-gradient-to-b from-[#71BF45] to-[#71BF45]">
                  <h3 className="text-xl font-bold mb-4 text-[#093C16]">Nano-sized bodyguards</h3>
                  <p className="font-light text-white">
                    That protect minerals on their journey through your body
                  </p>
                </div>

                {/* Small Box 2: Water-loving minerals */}
                <div className="flex flex-col justify-between bg-gradient-to-b from-[#5B5B5B] to-[#71BF45] border rounded-[20px] p-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-[#71BF45]">
                      Water-loving minerals
                    </h3>
                    <p className="font-light text-white">
                      That protect minerals on their journey through your body
                    </p>
                  </div>
                </div>

                {/* Large Absorption Box (Spans 1 row, 1 column here, will re-position with flex below) */}
                <div className="md:col-span-1 md:row-span-2 p-6 rounded-[20px] bg-gradient-to-b from-[#71BF45] to-[#71BF45] flex flex-col justify-between">
                  <div className="text-[#093C16]">
                    <p className="text-6xl font-bold mb-2 leading-none">5X</p>
                    <p className="text-xl font-semibold mb-4">Better<br />Absorption</p>
                  </div>
                  <p className="text-xl text-white">
                    Compared to regular supplements
                  </p>
                </div>

                {/* Smart Release System Box (Spans full width on small screens, below first two on medium) */}
                <div className="md:col-span-2 p-6 border border-[#5B5B5B] rounded-[20px] bg-[#71BF45] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-[#093C16]">Smart release system</h3>
                    <p className="font-light text-[#093C16]">
                      That knows exactly when to deliver nutrients to your cells
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <video
            className="h-full"
            controls
            autoPlay
            muted
            loop
          >
            <source
              src="/science/BioCage_Mineral_Delivery_Animation.mp4"
              type="video/mp4"
            />
          </video>
        </section>

        {/* ---------- PANEL 3 ---------- */}
        <section className="panel flex-shrink-0 w-screen h-screen flex items-center justify-around px-8 py-5">
          <div className="flex flex-col justify-around h-screen">

            {/* ====== TOP HEADING ====== */}
            <div className="space-y-5">
              <h5 className="font-medium text-4xl text-white">
                PHYQUANTRIX Technology™
              </h5>
              <p className="font-light text-3xl text-[#D8DED5]">
                Your personal nutrient{" "}
                <span className="font-bold">GPS system</span>
              </p>
            </div>

            {/* ====== FEATURES ====== */}
            <div>
              {/* ====== HEADING ====== */}
              <p className="text-3xl text-white mb-6">What makes it special?</p>

              {/* GRID LAYOUT FOR FEATURES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-[600px]">
                {/* Small Box 1: Targeted Delivery */}
                <div className="p-6 rounded-[20px] flex flex-col justify-between bg-[#71BF45]">
                  <h3 className="text-xl font-bold mb-4 text-[#093C16]">Targeted Delivery</h3>
                  <p className="font-light text-white">
                    Sends nutrients exactly where your body needs them most
                  </p>
                </div>

                {/* Small Box 2: Lower doses needed */}
                <div className="flex flex-col justify-between bg-[#71BF45] border rounded-[20px] p-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-[#093C16]">
                      Lower doses needed
                    </h3>
                    <p className="font-light text-white">
                      More effective with less (gentle on your stomach)
                    </p>
                  </div>
                </div>

                {/* Large Absorption Box (Spans 1 row, 1 column here, will re-position with flex below) */}
                <div className="md:col-span-1 md:row-span-2 p-6 rounded-[20px] bg-[#71BF45] flex flex-col justify-between">
                  <div className="text-[#093C16]">
                    <p className="text-xl font-bold leading-none">
                      Organ Specific Support
                    </p>
                  </div>
                  <p className="text-white">
                    Can target specific areas like heart, brain, or joints
                  </p>
                </div>

                {/* Smart Release System Box (Spans full width on small screens, below first two on medium) */}
                <div className="md:col-span-2 p-6 border border-[#5B5B5B] rounded-[20px] bg-[#71BF45] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-[#093C16]">Perfect for sensitive digestion</h3>
                    <p className="font-light text-[#093C16]">
                      Ideal if you have absorption issues
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <HumanOrgansSvg />
        </section>

        {/* ---------- PANEL 4 ---------- */}
        <section className="panel flex-shrink-0 flex flex-col justify-around h-screen mx-8 py-5">
          <p className="font-medium text-4xl w-[490px]">
            Ancient Wisdom + Modern Science = {" "}
            <span className="font-light italic">Magic</span>
          </p>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th></th>
                <th
                  style={{
                    border: "1px solid transparent",
                    borderRadius: "30px 30px 0 0",
                    background:
                      "linear-gradient(#171717, #171717) padding-box, linear-gradient(90deg, #71BF45 0%, #355920 100%) border-box",
                    backgroundClip: "padding-box, border-box",
                    padding: "8px",
                    fontWeight: "500",
                    fontSize: "20px",
                    color: "#71BF45",
                  }}
                >
                  Regular Supplements
                </th>
                <th
                  className="p-2 font-semibold text-xl text-[#093C16] bg-[#71BF45] rounded-tl-[30px] rounded-tr-[30px]"
                >
                  Zealous Health
                </th>
              </tr>
            </thead>

            <tbody className="bg-[#093c16]">
              {tableData.map((data, idx) => {
                const isFirstRow = idx === 0;
                const isLastRow = idx === tableData.length - 1;

                return (
                  <tr key={idx}>
                    {/* Column 1 */}
                    <td
                      className="text-white text-xl py-2 pl-5 pr-10"
                      style={{
                        border: "0.5px solid transparent",
                        borderRadius: `${isFirstRow ? "30px 0 0 0" : isLastRow ? "0 0 0 30px" : "0"}`,
                        background:
                          "linear-gradient(#171717, #171717) padding-box, linear-gradient(90deg, #71BF45 0%, #FFFFFF 23%) border-box",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                      }}
                    >
                      {data.col1}
                    </td>

                    {/* Column 2 */}
                    <td
                      className="text-[#C6C4C4] py-2 pl-5 pr-24"
                      style={{
                        border: "0.5px solid transparent",
                        background:
                          "linear-gradient(#171717, #171717) padding-box, linear-gradient(90deg, #71BF45 0%, #FFFFFF 23%) border-box",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                      }}
                    >
                      {data.col2}
                    </td>

                    {/* Column 3 */}
                    <td
                      className="py-2 pl-5 pr-10"
                      style={{
                        border: "0.5px solid transparent",
                        borderRadius: isLastRow ? "0 0 30px 0" : "0",
                        background:
                          "linear-gradient(#171717, #171717) padding-box, linear-gradient(90deg, #71BF45 0%, #FFFFFF 23%) border-box",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                      }}
                    >
                      <div className="flex items-center gap-2 text-[#C6C4C4]">
                        <IoIosCheckmark className="bg-gradient-to-b from-[#71BF45] to-[#093C16] rounded-full size-5" />
                        {data.col3}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* ---------- PANEL 5 ---------- */}
        <section className="panel flex-shrink-0 w-screen h-screen space-y-8 px-8 py-5">
          <div className="flex justify-around">
            <p className="font-semibold text-4xl text-white">
              The Science Made Simple
            </p>
            <div />
          </div>

          <div className="flex justify-around items-center w-full">
            {/* === Timeline Section === */}
            <div className="flex flex-col items-center relative">
              {/* --- MAP THROUGH STEPS --- */}
              {["Step-1", "Step-2", "Step-3"].map((step, index) => (
                <React.Fragment key={index}>
                  {/* Line above the dot */}

                  <div className="h-40 w-[2px] bg-gradient-to-b from-white to-[#71BF45]" />

                  {/* Dot + Step label */}
                  <div className="relative flex items-center gap-3 my-8">
                    <div className="w-4 h-4 rounded-full bg-gray-400 z-10" />
                    <p className="text-gray-200 text-lg">{step}</p>
                  </div>

                  {/* Line below the dot (skip after last step if you want bottom gap) */}
                  {index !== 2 && (
                    <div className="h-40 w-[2px] bg-gradient-to-b from-white to-[#71BF45]" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* === Right Content Section === */}
            <div className="space-y-10">
              <div>
                <p className="font-extrabold text-3xl text-white">Protection</p>
                <p className="font-light text-2xl text-white max-w-xl">
                  Our nano-cage wraps around nutrients like a protective bubble.
                </p>
              </div>

              <Image
                src="/science/protection.jpg"
                width={722}
                height={420}
                alt="protection-img"
                className="rounded-[32px]"
              />
            </div>
          </div>
        </section>

        {/* ---------- PANEL 6 ---------- */}
        <section className="panel w-screen h-screen mx-8 py-5">
          {/* UPPER ROW */}
          <div className="flex items-center">
            <div className="flex-1 space-y-4">
              <p className="text-4xl">
                Ready to{" "}
                <span className="font-semibold">
                  experience what absorption should feel like?
                </span>
              </p>
              <p className="text-[#D8DED5] text-xl">
                We&apos;ve cracked the code on making supplements
                actually work. By combining ancient herbal wisdom with space-age nanotechnology,
                we deliver nutrients your body can actually user -
                so you feel the difference!
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <p className="flex items-center text-center rounded-full border border-[#71BF45] text-2xl w-[240px] h-[240px]">
                Herbal Molecule Enhancement
              </p>
            </div>
          </div>

          {/* ====== FLOATING CARDS ====== */}
          <div className="flex items-center gap-10">
            <div className="flex-1 flex flex-col gap-5 items-end px-10">
              <Card text="Multi-Pathway Disease Targeting" />
              <CircleCard text="Immune-Mediated Disorder Focus" />
              <Card text="Multi-Pathway Disease Targeting" />
            </div>

            <div className="flex-1 flex flex-col gap-5">
              <MainCard text="Phospholipids & Charged Nanoemulsion" />
              <div className="flex items-center justify-between w-full">
                <Card text="Responsive Smart Release" />
                <Card text="Synergistic Nutrient Utilization" />
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}


function Card({ text }: { text: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="text-white rounded-full py-3 text-center text-sm md:text-base lg:text-2xl w-full"
      style={{
        border: "1px solid transparent",
        background:
          "linear-gradient(#000, #000) padding-box, linear-gradient(90deg, rgba(255,255,255,0.4) 0%, #71BF45 100%) border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {text}
    </motion.div>
  );
}


function CircleCard({ text }: { text: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="text-white flex items-center justify-center text-center text-sm md:text-2xl w-56 h-56"
      style={{
        border: "1px solid transparent",
        borderRadius: "50%",
        background: "linear-grardient(#000, #000) padding-box, linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, #71BF45 100%) border-box",
        backgroundClip: "padding-box border-box"
      }}
    >
      {text}
    </motion.div>
  );
}

function MainCard({ text }: { text: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-[40px] px-8 py-4 text-sm md:text-2xl flex flex-col items-center justify-between gap-4 w-fit"
      style={{
        border: "1px solid transparent",
        background: "linear-gradient(#000, #000) padding-box, linear-gradient(90deg, #ffffff 40%, #71BF45 0%) border-box"
      }}
    >
      <span>{text}</span>
      <div className="flex items-center justify-center w-8 h-8 rounded-full text-black bg-white transition">
        <ArrowRight size={16} />
      </div>
    </motion.div>
  );
}