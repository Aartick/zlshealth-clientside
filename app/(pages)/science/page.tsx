"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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

const steps = [
  {
    title: "Protection",
    text: "Our nano-cage wraps around nutrients like a protective bubble.",
    image: "/science/protection.jpg"
  },
  {
    title: "Transport",
    text: "Smart delivery system navigates your digestive system like GPS.",
    image: "/science/protection.jpg"
  },
  {
    title: "Release",
    text: "Nutrients are released exactly where and when your cells need them.",
    image: "/science/protection.jpg"
  },
  {
    title: "Results",
    text: "Experience real benefits because your body actually uses what you take!",
    image: "/science/protection.jpg"
  }
]

export default function Page() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null)

  const panel5Ref = useRef<HTMLDivElement>(null)
  const stepsContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = scrollContainerRef.current;
    const panel5 = panel5Ref.current;
    const stepsContainer = stepsContainerRef.current;

    if (!container || !panel5 || !stepsContainer) return;

    ScrollTrigger.getAll().forEach(t => t.kill())

    // compute sizes (re-evaluated on refresh)
    const getSizes = () => {
      const totalWidth = container.scrollWidth;
      const viewportWidth = window.innerWidth;
      const panel5Width = panel5.offsetWidth;
      return { totalWidth, viewportWidth, panel5Width };
    };

    // ---- HORIZONTAL TIMELINE (main scroller) ----
    const { totalWidth } = getSizes();
    const horizontalTL = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${totalWidth}`, // total horizontal distance maps to scroll length
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Move the container left by the difference (this is the horizontal scroll)
    horizontalTL.to(container, {
      x: () => -(getSizes().totalWidth - getSizes().viewportWidth),
    });

    // ---- PANEL 5 VERTICAL TIMELINE (takes over while horizontal timeline is at panel 5) ----
    const stepsCount = steps.length;
    // make sure stepsContainer has the proper height equal to stepsCount * 100vh
    // we animate by yPercent, so we set the container height accordingly by CSS below

    const verticalTL = gsap.timeline({
      scrollTrigger: {
        trigger: panel5,
        start: "left center", // when panel5's left hits the left of the viewport in the horizontal scroller
        end: () => `+=${panel5.offsetWidth}`, // the horizontal width of panel5 is the span used to drive vertical timeline
        scrub: 1,
        horizontal: true, // important: this trigger lives inside a horizontal scroller
        containerAnimation: horizontalTL, // tie it to the main horizontal timeline
        pin: true, // pin panel5 while verticalTL plays
        anticipatePin: 1,
        onEnter: () => horizontalTL.pause(),
        onLeave: () => horizontalTL.play(),
        onEnterBack: () => horizontalTL.pause(),
        onLeaveBack: () => horizontalTL.play()
      },
    });

    // animate stepsContainer by yPercent: each step is 100vh tall so total translate = -(stepsCount-1)*100%
    verticalTL.to(stepsContainer, {
      yPercent: -100 * (stepsCount - 1),
      ease: "none",
    });

    // Access the horizontal ScrollTrigger directly
    const horizontalST = horizontalTL.scrollTrigger;
    const verticalST = verticalTL.scrollTrigger;

    if (horizontalST && verticalST) {
      // Update its callbacks directly
      verticalST.vars.onEnter = () => horizontalST.disable();
      verticalST.vars.onLeave = () => horizontalST.enable();
      verticalST.vars.onEnterBack = () => horizontalST.disable();
      verticalST.vars.onLeaveBack = () => horizontalST.enable();

      // Re-initialize the ScrollTrigger with new vars
      verticalST.refresh();
    }

    // refresh to ensure all sizes are correct
    ScrollTrigger.refresh();

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
      ScrollTrigger.getAll().forEach((t) => t.kill())
      horizontalTL.kill()
      verticalTL.kill();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = false;
            video.play().catch(() => {
              console.warn("Autoplay with sound blocked by browser.")
            })
          } else {
            video.pause();
            video.muted = true;
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(video)

    return () => observer.unobserve(video)
  }, [])

  // =============== MODAL LOGICS ================
  const [selectedCard, setSelectedCard] = useState<null | string>(null)

  const cardDetails: Record<
    string,
    { title: string; description: string; image: string }
  > = {
    "Multi-Pathway Disease Targeting": {
      title: "Multi-Pathway Disease Targeting",
      description:
        "Pioneered formulation design that targets multiple pathways of disease progression for long-term resolution.",
      image: "/science/science.jpg",
    },
    "Immune-Mediated Disorder Focus": {
      title: "Immune-Mediated Disorder Focus",
      description:
        "Specialized application of immunological knowledge for complex immune-mediated chronic disorders.",
      image: "/science/science.jpg",
    },
    "Phospholipids & Charged Nanoemulsion": {
      title: "Phospholipids & Charged Nanoemulsion",
      description: "Integration of phospholipids and charged nanoemulsion technology alongside nanoparticles.",
      image: "/science/science.jpg"
    },
    "Herbal Molecule Enhancement": {
      title: "Herbal Molecule Enhancement",
      description: "Specific focus on making \"tough herbal molecules\" reach cellular levels with higher efficacy",
      image: "/science/science.jpg"
    },
    "Responsive Smart Release": {
      title: "Responsive Smart Release",
      description: "BioCage's intelligent dissociation at cells for optimal mineral release.",
      image: "/science/science.jpg"
    },
    "Electrochemical Balance": {
      title: "Electrochemical Balance",
      description: "Unique ability to maintain cellular electrochemical balance during nutrient transport.",
      image: "/science/science.jpg"
    },
    "Synergistic Nutrient Utilization": {
      title: "Synergistic Nutrient Utilization",
      description: "Enhancement of vitamins, coenzymes, and hormones alongside minerals.",
      image: "/science/science.jpg"
    }
  }

  const closeModal = () => setSelectedCard(null)

  return (
    <div className="bg-[#191717]">
      <div
        ref={sectionRef}
        className="container mx-auto my-auto relative h-screen overflow-hidden text-white -mt-24 sm:-mt-28 lg:-mt-36 cursor-none"
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
          <section className="panel h-screen flex items-center justify-center px-8 py-5">
            <div className="flex items-center justify-between h-full w-full">
              <div className="flex flex-col justify-around pb-10 h-full">
                <div>
                  <h5 className="font-light text-xl sm:text-3xl text-white">
                    Why Zealous Health is Different
                  </h5>
                  <h1 className="font-semibold text-3xl sm:text-5xl text-white tracking-tighter text-nowrap">
                    Science Meets Ancient Wisdom
                  </h1>
                </div>

                <p className="sm:text-xl text-[#D8DED5] w-96 sm:w-[700px]">
                  Ever wonder why you take vitamins but don&apos;t feel the difference?
                  Most supplements are poorly absorbed — your body only uses about
                  10–20% of what you swallow while the rest is just expensive pee.
                </p>

                <div>
                  <h5 className="font-light text-xl sm:text-3xl text-white">
                    Our Game-Changing Solution
                  </h5>
                  <div className="flex items-center gap-4">
                    <h1 className="font-semibold text-2xl sm:text-[40px] text-white text-nowrap">
                      Nano-Tech Meets Nature
                    </h1>
                    <div className="w-[75px] sm:w-[137px] border border-white" />
                  </div>
                </div>
              </div>

              <div className="relative w-screen h-[500px] sm:w-[600px] sm:h-[600px]">
                <Image
                  src="/science/human_body.png"
                  fill
                  alt="human_body"
                />
              </div>
            </div>
          </section>

          {/* ---------- PANEL 2 ---------- */}
          <section className="panel h-screen flex items-center gap-40 text-white px-8">
            <div className="flex flex-col justify-around h-screen">
              <div className="space-y-2.5 sm:space-y-5">
                <h5 className="font-medium text-2xl sm:text-4xl text-white">
                  BIOCAGE Technology™
                </h5>
                <p className="font-light text-lg sm:text-3xl text-[#D8DED5]">
                  Think of it as a{" "}
                  <span className="font-normal italic">&quot;smart taxi&quot;</span> for your
                  nutrients
                </p>
              </div>

              {/* ====== FEATURES ====== */}
              <div>
                {/* ====== HEADING ====== */}
                <p className="text-xl sm:text-3xl text-white mb-6">What makes it special?</p>

                {/* GRID LAYOUT FOR FEATURES */}
                <div className="grid grid-cols-3 gap-4 w-[600px]">
                  {/* Small Box 1: Nano-sized bodyguard */}
                  <div className="p-3 sm:p-6 rounded-[20px] flex flex-col justify-between bg-gradient-to-b from-[#71BF45] to-[#71BF45]">
                    <h3 className="sm:text-xl font-bold mb-4 text-[#093C16]">Nano-sized bodyguards</h3>
                    <p className="text-sm sm:text-base font-light text-white">
                      That protect minerals on their journey through your body
                    </p>
                  </div>

                  {/* Small Box 2: Water-loving minerals */}
                  <div className="flex flex-col justify-between bg-gradient-to-b from-[#5B5B5B] to-[#71BF45] border rounded-[20px] p-3 sm:p-6">
                    <div>
                      <h3 className="sm:text-xl font-bold mb-4 text-[#71BF45]">
                        Water-loving minerals
                      </h3>
                      <p className="text-sm sm:text-base font-light text-white">
                        that dissolve easily (no more chalky tablets!)
                      </p>
                    </div>
                  </div>

                  {/* Large Absorption Box (Spans 1 row, 1 column here, will re-position with flex below) */}
                  <div className="col-span-1 row-span-2 p-3 sm:p-6 rounded-[20px] bg-gradient-to-b from-[#71BF45] to-[#71BF45] flex flex-col justify-between">
                    <div className="text-[#093C16]">
                      <p className="text-3xl sm:text-6xl font-bold mb-2 leading-none">5X</p>
                      <p className="sm:text-xl font-semibold mb-4">Better<br />Absorption</p>
                    </div>
                    <p className="sm:text-xl text-white">
                      Compared to regular supplements
                    </p>
                  </div>

                  {/* Smart Release System Box (Spans full width on small screens, below first two on medium) */}
                  <div className="col-span-2 p-3 sm:p-6 border border-[#5B5B5B] rounded-[20px] bg-[#71BF45] flex flex-col justify-between">
                    <div>
                      <h3 className="sm:text-xl font-bold mb-4 text-[#093C16]">Smart release system</h3>
                      <p className="text-sm sm:text-base font-light text-[#093C16]">
                        That knows exactly when to deliver nutrients to your cells
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <video
              ref={videoRef}
              className="h-[750px] w-screen sm:h-full"
              playsInline
              loop
            >
              <source
                src="/science/BioCage_Mineral_Delivery_Animation.mp4"
                type="video/mp4"
              />
            </video>
          </section>

          {/* ---------- PANEL 3 ---------- */}
          <section className="panel h-screen flex items-center justify-around px-8 py-5">
            <div className="flex flex-col justify-around h-screen">

              {/* ====== TOP HEADING ====== */}
              <div className="space-y-2.5 sm:space-y-5">
                <h5 className="font-medium text-2xl sm:text-4xl text-white">
                  PHYQUANTRIX Technology™
                </h5>
                <p className="font-light text-lg sm:text-3xl text-[#D8DED5]">
                  Your personal nutrient{" "}
                  <span className="font-bold">GPS system</span>
                </p>
              </div>

              {/* ====== FEATURES ====== */}
              <div>
                {/* ====== HEADING ====== */}
                <p className="text-xl sm:text-3xl text-white mb-6">What makes it special?</p>

                {/* GRID LAYOUT FOR FEATURES */}
                <div className="grid grid-cols-3 gap-4 w-[600px]">
                  {/* Small Box 1: Targeted Delivery */}
                  <div className="p-3 sm:p-6 rounded-[20px] flex flex-col justify-between bg-[#71BF45]">
                    <h3 className="sm:text-xl font-bold mb-4 text-[#093C16]">Targeted Delivery</h3>
                    <p className="text-sm sm:text-base font-light text-white">
                      Sends nutrients exactly where your body needs them most
                    </p>
                  </div>

                  {/* Small Box 2: Lower doses needed */}
                  <div className="flex flex-col justify-between bg-[#71BF45] border rounded-[20px] p-3 sm:p-6">
                    <div>
                      <h3 className="sm:text-xl font-bold mb-4 text-[#093C16]">
                        Lower doses needed
                      </h3>
                      <p className="text-sm sm:text-base font-light text-white">
                        More effective with less (gentle on your stomach)
                      </p>
                    </div>
                  </div>

                  {/* Large Absorption Box (Spans 1 row, 1 column here, will re-position with flex below) */}
                  <div className="col-span-1 row-span-2 p-3 sm:p-6 rounded-[20px] bg-[#71BF45] flex flex-col justify-between">
                    <div className="text-[#093C16]">
                      <p className="text-lg sm:text-xl font-bold leading-none">
                        Organ Specific Support
                      </p>
                    </div>
                    <p className="text-sm sm:text-base text-white">
                      Can target specific areas like heart, brain, or joints
                    </p>
                  </div>

                  {/* Smart Release System Box (Spans full width on small screens, below first two on medium) */}
                  <div className="col-span-2 p-3 sm:p-6 border border-[#5B5B5B] rounded-[20px] bg-[#71BF45] flex flex-col justify-between">
                    <div>
                      <h3 className="sm:text-xl font-bold mb-4 text-[#093C16]">Perfect for sensitive digestion</h3>
                      <p className="text-sm sm:text-base font-light text-[#093C16]">
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
          <section className="panel flex flex-col justify-around h-screen mx-8 sm:py-5">
            <p className="font-medium text-2xl sm:text-4xl w-[300px] sm:w-[490px]">
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
                      color: "#71BF45",
                    }}
                    className="sm:text-xl"
                  >
                    Regular Supplements
                  </th>
                  <th
                    className="p-2 font-semibold sm:text-xl text-[#093C16] bg-[#71BF45] rounded-tl-[30px] rounded-tr-[30px]"
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
                        className="text-white text-sm sm:text-xl py-2 pl-5 pr-10"
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
                        className="text-[#C6C4C4] text-sm sm:text-base py-2 pl-5 pr-24"
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
                        className="py-2 pl-5 pr-10 text-sm sm:text-base"
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
          <section
            ref={panel5Ref}
            className="panel overflow-hidden flex justify-center pl-40 w-screen"
          >
            <div
              ref={stepsContainerRef}
              className="space-y-20 w-full"
            >
              <p className="font-semibold text-2xl sm:text-4xl text-white text-nowrap">
                The Science Made Simple
              </p>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-20 items-center w-full"
                >
                  {/* === Timeline Section === */}
                  <div className="flex flex-col items-center relative">
                    {/* --- MAP THROUGH STEPS --- */}
                    <React.Fragment key={index}>
                      {/* Line above the dot */}
                      <div className="h-40 w-[2px] bg-gradient-to-b from-white to-[#71BF45]" />

                      {/* Dot + Step label */}
                      <div className="relative flex items-center gap-3 my-8">
                        <div className="w-4 h-4 rounded-full bg-gray-400 z-10" />
                        <p className="text-gray-200 text-lg text-nowrap">Step {index + 1}</p>
                      </div>

                      {/* Line below the dot (skip after last step if you want bottom gap) */}
                      <div className="h-40 w-[2px] bg-gradient-to-b from-white to-[#71BF45]" />
                    </React.Fragment>
                  </div>

                  {/* === Right Content Section === */}
                  <div className="space-y-10">
                    <div>
                      <p className="font-extrabold text-xl sm:text-3xl text-white">{step.title}</p>
                      <p className="font-light sm:text-2xl text-white max-w-xl">
                        {step.text}
                      </p>
                    </div>

                    <Image
                      src={step.image}
                      width={722}
                      height={320}
                      alt={step.title}
                      className="rounded-[32px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- PANEL 6 ---------- */}
          <section className="panel relative w-screen h-screen mx-8 py-5 overflow-hidden">
            {/* UPPER ROW */}
            <div className="flex items-center">
              <div className="flex-1 space-y-4">
                <p className="text-2xl sm:text-4xl">
                  Ready to{" "}
                  <span className="font-semibold">
                    experience what absorption should feel like?
                  </span>
                </p>
                <p className="text-[#D8DED5] sm:text-xl">
                  We&apos;ve cracked the code on making supplements
                  actually work. By combining ancient herbal wisdom with space-age nanotechnology,
                  we deliver nutrients your body can actually user -
                  so you feel the difference!
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <CircleCard
                  text="Herbal Molecule Enhancement"
                  onClick={() =>
                    setSelectedCard("Herbal Molecule Enhancement")
                  }
                />
              </div>

            </div>

            {/* ====== FLOATING CARDS ====== */}
            <div className="flex items-center gap-10">
              <div className="flex-1 flex flex-col gap-5 items-end px-10">
                <Card
                  text="Multi-Pathway Disease Targeting"
                  onClick={() =>
                    setSelectedCard("Multi-Pathway Disease Targeting")
                  }
                />
                <CircleCard
                  text="Immune-Mediated Disorder Focus"
                  onClick={() =>
                    setSelectedCard("Immune-Mediated Disorder Focus")
                  }
                />
                <Card
                  text="Multi-Pathway Disease Targeting"
                  onClick={() =>
                    setSelectedCard("Multi-Pathway Disease Targeting")}
                />
              </div>

              <div className="flex-1 flex flex-col gap-5">
                <MainCard
                  text="Phospholipids & Charged Nanoemulsion"
                  onClick={() =>
                    setSelectedCard("Phospholipids & Charged Nanoemulsion")
                  }
                />
                <div className="flex items-center gap-5 ">
                  <Card
                    text="Responsive Smart Release"
                    onClick={() => setSelectedCard("Responsive Smart Release")}
                  />
                  <Card
                    text="Synergistic Nutrient Utilization"
                    onClick={() => setSelectedCard("Synergistic Nutrient Utilization")}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {selectedCard && (
                <>
                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                  >
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center z-50 p-6"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="bg-white max-w-5xl w-full h-[60vh] overflow-hidden flex flex-col sm:flex-row gap-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* TEXT ON LEFT */}
                        <div className="flex-1 flex flex-col justify-center space-y-10 p-8">
                          <h2 className="text-2xl text-[#093C16] font-semibold">
                            {cardDetails[selectedCard].title}
                          </h2>
                          <p className="text-[#544848] leading-relaxed text-lg">
                            {cardDetails[selectedCard].description}
                          </p>
                        </div>

                        {/* IMAGE ON RIGHT */}
                        <div className="flex-1 flex items-center justify-center">
                          <div className="relative h-full w-full">
                            <Image
                              src={cardDetails[selectedCard].image}
                              alt={cardDetails[selectedCard].title}
                              fill
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </div>
  );
}


// =============== CARD COMPONENETS ================

function Card({
  text,
  onClick
}: {
  text: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="text-white rounded-full py-3 text-center text-sm md:text-base lg:text-2xl w-full border border-[#71BF45]"
    >
      {text}
    </motion.div>
  );
}

function CircleCard({
  text,
  onClick
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="text-white flex items-center justify-center text-center text-sm md:text-2xl w-56 h-56 border border-[#71BF45F] rounded-full"
    >
      {text}
    </motion.div>
  );
}

function MainCard({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="relative rounded-[40px] px-8 py-4 text-sm md:text-2xl flex flex-col items-center justify-between gap-4 w-fit border border-[#71BF45]"
    >
      <span>{text}</span>
      <div className="flex items-center justify-center w-8 h-8 rounded-full text-black bg-white transition">
        <ArrowRight size={16} />
      </div>
    </motion.div>
  );
}