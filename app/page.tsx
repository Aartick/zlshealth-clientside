/**
 * Home Page Component
 * 
 * Main landing page for Zealous Health.
 * Displays hero section, filters to search with health conditions, product cards, stats, process, and blogs.
 * Handles animated search bar, tab navigation, and fetches stats from backend.
 *
 * State:
 * - inputValue: Search bar input value.
 * - currentIndex: Index for animated search placeholder.
 * - isAnimating: Animation state for search placeholder.
 * - activeTab: Currently selected product tab.
 * - underlineStyle: Style for tab underline animation.
 * - count: Stats for users, products, years (fetched from backend).
 *
 * Effects:
 * - Animates search placeholder text.
 * - Fetches stats on mount.
 *
 * Usage:
 * - Renders all homepage sections with responsive layout and interactive UI.
 */

'use client'

import Image from "next/image";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import BlogCard from "@/components/BlogCard";
import { GoArrowRight } from "react-icons/go";
import { BiMouse } from "react-icons/bi";
import { axiosClient } from "@/utils/axiosClient";
import { product } from "@/interfaces/products";
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import MotionPathPlugin from "gsap/MotionPathPlugin";
import ProductSkeleton from "@/components/ProductSkeleton";
import { FaLeaf, FaSeedling, FaSpa } from 'react-icons/fa'
import { useNavbarColor } from "@/context/NavbarColorContext";

const tableData = [
  {
    col1: "Does your body actually use it?",
    col2: "Only 10-30% absorbed. You are literally peeing out 70% of what you paid for",
    col3: "Your cells absorb 5-10x more-precision nano-delivery ensures nutrients reach target organs."
  },
  {
    col1: "Will you actually feel different?",
    col2: "Inconsistent results. Maybe you'll notice something in 6 months?",
    col3: "You feel the energy boost within days - because nutrients actually reach your cells"
  },
  {
    col1: "Is it gentle on your stomach?",
    col2: "High doses = nausea, bloating, discomfort",
    col3: "You take 80% less yet get better results - small doses, zero gut irritation"
  },
  {
    col1: "Does it target your specific needs?",
    col2: "One-size-fits-all. Hope it helps something",
    col3: "Your nutrients go exactly where you need them - brain, joints, heart, liver - base on your body's signals"
  },
  {
    col1: "Is it actually natural?",
    col2: "Chemical compounds, synthetic fillers, binders",
    col3: "You get ancient herbal wisdom powered by modern nano-science-nature meets technology"
  },
  {
    col1: "Will it harm you long term?",
    col2: "Can stress your kidneys and liver with synthetic overload",
    col3: "Your body naturally processes and eliminates - biodegradable, zero toxic buildup, safe to use lifelong"
  },
  {
    col1: "Does it actually fix the problem?",
    col2: "Masks symptoms temporarily, then they return",
    col3: "Your body heals at the cellular level - multi-pathway repair addresses root causes"
  },
]

interface healthCondition {
  _id: string,
  name: string
}

export default function Home() {
  
  // ================ HEALTH CONDITIONS LOGIC ================
  const [healthConditions, setHealthConditions] = useState<healthCondition[]>([])
  const [activeBtn, setActiveBtn] = useState<string>("")
  const [products, setProducts] = useState<product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingHealthConditions, setLoadingHealthConditions] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch products when activeBtn changes (but only if activeBtn is set)
  useEffect(() => {
    if (!activeBtn) return; // Don't fetch if no health condition is selected

    const getProducts = async () => {
      setLoadingProducts(true)

      try {
        const response = await axiosClient.get(`/api/products/healthConditions?healthCondition=${activeBtn}&limit=true`)
        setProducts(response.data.result)
        setRetryCount(0) // Reset retry count on success
      } catch (error) {
        console.error("Error fetching products:", error)

        // Retry logic: retry up to 2 times
        if (retryCount < 2) {
          console.log(`Retrying product fetch... Attempt ${retryCount + 1}`)
          setRetryCount(prev => prev + 1)
          setTimeout(() => {
            // Trigger re-fetch by toggling a dependency
          }, 1000 * (retryCount + 1)) // Exponential backoff: 1s, 2s
        }
      } finally {
        setLoadingProducts(false)
      }
    }
    getProducts()
  }, [activeBtn, retryCount])

  // Fetch health conditions first on mount
  useEffect(() => {
    const getHealthBenefits = async () => {
      setLoadingHealthConditions(true)

      try {
        const res = await axiosClient.get("/api/healthConditions")

        if (res.data.result && res.data.result.length > 0) {
          setHealthConditions(res.data.result)
          setActiveBtn(res.data.result[0]._id) // This will trigger product fetch
        } else {
          console.error("No health conditions found in database")
        }
      } catch (error) {
        console.error("Error fetching health conditions:", error)

        // Retry after 2 seconds if failed
        setTimeout(() => {
          console.log("Retrying health conditions fetch...")
          getHealthBenefits()
        }, 2000)
      } finally {
        setLoadingHealthConditions(false)
      }
    }

    getHealthBenefits()
  }, [])


  // ============== STATS ANIMATION LOGICS ================

  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

  const paragraphs = [
    "50+ Herbal Products",
    "1000+ Orders / Day",
    "50,000+ Customers",
  ];

  // Refs for section (for scroll trigger) and container (for animations)
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // GSAP context ensures scoped animations (cleanup on unmount)
    const ctx = gsap.context(() => {
      // Get all <p> tags with class "para"
      const paras = gsap.utils.toArray(".para") as HTMLElement[];

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
          start: "top top", // start when section hits top of viewport
          end: () => `+=${paras.length * 1000}`, // total scroll distance
          scrub: true, // link animation to scroll progress
          pin: true, // pin this section while animating
          anticipatePin: 0.5, // Reduced from 1 for smoother performance
          refreshPriority: 1 // Higher priority for this animation
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

  // ================ SECOND ANIMATION ================

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

  const divRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const iconRefs = useRef<HTMLDivElement[]>([])
  const textRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = divRef.current;
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

  // ================ NAVBAR TEXT COLOR LOGIC ================

  const heroRef = useRef<HTMLDivElement>(null)
  const { setDark } = useNavbarColor();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setDark(!entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    if (heroRef.current) observer.observe(heroRef.current)

    return () => observer.disconnect();
  }, [setDark])


  return (
    <div className="-mt-24 sm:-mt-28 lg:-mt-36 bg-[#FBFFF9] space-y-10 pb-8">

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative w-full h-screen">
        {/* Background Image */}
        <Image
          src="/hero.jpg"
          alt="heroImg"
          fill
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Centered Text */}
        <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center">
          <p className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white text-center px-1 sm:px-0">
            Science Backed Herbal Care
          </p>
          <Link
            href="/products"
            className="flex items-center gap-1">
            <p className="rounded-full border border-white text-white font-bold py-3 px-8">
              Explore
            </p>
            <p className="p-3 rounded-full border border-white text-white text-2xl">
              <GoArrowRight />
            </p>
          </Link>
        </div>

        <div className="absolute left-1/2 bottom-24 text-white text-3xl rotate-180">
          <BiMouse />
        </div>
      </section>

      {/* PRODUCTS HEADING */}
      <p className="text-center font-bold text-2xl">
        Browse by Health Conditions
      </p>

      {/* PRODUCTS FILTERS */}
      <section className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 px-10 text-xs md:text-base">
        {loadingHealthConditions ? (
          <>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-[15px] p-1.5 rounded-[8px] border border-[#e0e0e0] animate-pulse"
              >
                <div className="w-[52px] h-[52px] bg-gray-200 rounded-[6px]" />
                <div className="flex-1 h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveBtn(healthConditions[0]?._id)}
              disabled={!healthConditions[0]?._id}
          className={`
            flex items-center gap-[15px] 
            p-1.5 rounded-[8px] border 
            ${activeBtn === healthConditions[0]?._id
              ? "border-[#093C16]"
              : "border-[#e0e0e0]"}
            transition-all duration-500
            ease-out cursor-pointer
          `}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="52" height="52" rx="6" fill="#093C16" fillOpacity={activeBtn === healthConditions[0]?._id ? "1" : "0.04"} />
            <g clipPath="url(#clip0_181_630)">
              <path d="M28.3592 20.1186C28.898 19.4863 29.5723 18.9435 30.2093 18.6295C30.4517 18.51 30.6001 18.258 30.5868 17.9879C30.5736 17.718 30.4013 17.4816 30.1483 17.3864C28.7043 16.8428 27.4953 15.7385 26.8312 14.3565C26.3888 13.4358 26.1927 12.3889 26.2629 11.3564H28.512C28.5324 12.4726 28.8502 13.9831 30.1973 15.0516C31.2025 15.8489 32.6069 16.2899 33.9651 16.7164C34.8419 16.9917 35.67 17.2518 36.3793 17.5939C37.941 18.3471 39.182 20.1396 39.699 22.3888C40.4404 25.6115 39.2872 29.5108 37.902 31.7699C35.8316 35.147 32.3593 37.1631 28.6136 37.1631C26.2955 37.1631 25.1772 36.2284 24.1906 35.4037C24.0648 35.2986 23.9218 35.1539 23.7562 34.9864C23.0715 34.2936 22.0368 33.2467 20.2683 33.1649C18.4461 33.0807 16.8826 33.6947 15.7484 34.9405C14.461 36.3547 13.8402 38.5044 14.1286 40.5509C14.1329 40.5818 14.1374 40.6127 14.142 40.6436H12.1455C11.9506 39.1314 12.1002 37.6923 12.5992 36.2605C13.6518 33.2406 17.0082 30.799 20.2406 30.702C20.4559 30.6955 20.6719 30.6921 20.9005 30.6884C22.5058 30.6631 24.3253 30.6343 25.6202 29.4505C26.4351 28.7057 26.776 27.6201 26.9185 26.8406L25.5842 26.5967C25.4357 27.4089 25.1235 28.0669 24.705 28.4494C23.7896 29.2862 22.31 29.3096 20.879 29.3322C20.6557 29.3357 20.4248 29.3394 20.1999 29.3462C16.3818 29.4608 12.5636 32.2413 11.3184 35.8141C10.6882 37.6222 10.5466 39.5162 10.8977 41.4434C10.9564 41.7658 11.2373 42.0001 11.565 42.0001H14.9554C15.1606 42.0001 15.3548 41.9072 15.4836 41.7473C15.6123 41.5876 15.6618 41.3781 15.6181 41.1776C15.5591 40.9063 15.5097 40.6317 15.4716 40.3616C15.2417 38.7296 15.7441 36.9603 16.7514 35.8538C17.6171 34.9028 18.7796 34.4537 20.2056 34.5201C21.4445 34.5773 22.1601 35.3013 22.7914 35.94C22.9734 36.1241 23.1453 36.2981 23.3205 36.4446C24.3683 37.3203 25.8032 38.5196 28.6136 38.5196C30.5706 38.5196 32.5378 38.011 34.3023 37.0488C36.2231 36.0014 37.8677 34.4212 39.0584 32.4791C40.6343 29.909 41.8524 25.6983 41.021 22.0849C40.4126 19.4383 38.8977 17.3027 36.9687 16.3723C36.1705 15.9873 35.256 15.7001 34.3716 15.4224C33.1312 15.0329 31.8486 14.6302 31.0402 13.9889C29.8623 13.0547 29.8144 11.5535 29.8908 10.7418C29.9086 10.5517 29.8456 10.3629 29.717 10.2218C29.5885 10.0804 29.4064 10 29.2155 10H25.6597C25.3278 10 25.0446 10.2402 24.9905 10.5677C24.7456 12.0507 24.9651 13.6049 25.6085 14.944C26.2379 16.2537 27.2662 17.3599 28.5175 18.1017C28.0931 18.4291 27.6881 18.8146 27.3267 19.2388L28.3592 20.1186Z" fill={activeBtn === healthConditions[0]?._id ? "white" : "black"} />
              <path d="M31.0105 34.9725C30.7066 34.9725 30.4026 34.8942 30.1315 34.7378L27.7236 33.3475C27.1814 33.0345 26.8446 32.4512 26.8446 31.8251V29.0447C26.8446 28.4187 27.1814 27.8353 27.7235 27.5222L30.1314 26.132C30.6737 25.8189 31.3473 25.819 31.8895 26.1321L34.2973 27.5222V27.5223C34.8395 27.8353 35.1764 28.4187 35.1764 29.0448V31.8251C35.1764 32.4512 34.8395 33.0347 34.2973 33.3477L31.8895 34.7378C31.6184 34.8942 31.3145 34.9725 31.0105 34.9725ZM31.0104 27.2531C30.9411 27.2531 30.8716 27.271 30.8097 27.3067L28.4019 28.6969C28.278 28.7684 28.2011 28.9017 28.2011 29.0447V31.8251C28.2011 31.9681 28.278 32.1013 28.4019 32.1728L30.8097 33.563C30.9335 33.6345 31.0875 33.6345 31.2113 33.5629L33.6191 32.1728C33.743 32.1012 33.82 31.9681 33.82 31.8251V29.0447C33.82 28.9017 33.743 28.7684 33.6191 28.6969L31.2113 27.3068C31.1493 27.271 31.0799 27.2531 31.0104 27.2531Z" fill="#71BF45" />
              <path d="M29.6861 19.9581L27.2783 18.568C26.736 18.2548 26.0624 18.255 25.5202 18.5679L23.1124 19.9581C23.039 20.0005 22.9698 20.0482 22.9043 20.0999L20.8996 18.8787C20.5796 18.6838 20.1624 18.7852 19.9675 19.1051C19.7726 19.425 19.8739 19.8422 20.1939 20.0371L22.245 21.2866C22.2378 21.3507 22.2333 21.4154 22.2333 21.4807V24.2609C22.2333 24.8871 22.5702 25.4705 23.1124 25.7835L25.5202 27.1736C25.7913 27.3302 26.0952 27.4085 26.3993 27.4085C26.7032 27.4085 27.0073 27.3302 27.2784 27.1736L29.6861 25.7835C30.2284 25.4705 30.5652 24.8871 30.5652 24.2609V21.4807C30.5651 20.8545 30.2283 20.2711 29.6861 19.9581ZM29.2087 24.2609C29.2087 24.4039 29.1318 24.5371 29.0079 24.6087L26.6001 25.9988C26.4763 26.0703 26.3224 26.0704 26.1985 25.9988L23.7906 24.6086C23.6668 24.5371 23.5899 24.4039 23.5899 24.2608V21.4805C23.5899 21.4288 23.6002 21.3785 23.6189 21.3319C23.6193 21.3313 23.6198 21.3307 23.6202 21.33C23.6342 21.3072 23.6461 21.2837 23.657 21.26C23.6909 21.2086 23.7358 21.1644 23.7906 21.1328L26.1985 19.7425C26.2604 19.7068 26.3299 19.689 26.3993 19.689C26.4687 19.689 26.5382 19.7068 26.6001 19.7426L29.0079 21.1326C29.1317 21.2042 29.2087 21.3375 29.2087 21.4805V24.2609Z" fill="#71BF45" />
              <path d="M19.0285 20.927C17.6346 20.927 16.5005 19.7929 16.5005 18.399C16.5005 17.0051 17.6346 15.8711 19.0285 15.8711C20.4224 15.8711 21.5564 17.0051 21.5564 18.399C21.5564 19.7929 20.4224 20.927 19.0285 20.927ZM19.0285 17.2275C18.3825 17.2275 17.857 17.753 17.857 18.3989C17.857 19.0449 18.3825 19.5705 19.0285 19.5705C19.6744 19.5705 20.1999 19.0449 20.1999 18.3989C20.1999 17.753 19.6744 17.2275 19.0285 17.2275Z" fill="#71BF45" />
            </g>
            <defs>
              <clipPath id="clip0_181_630">
                <rect width="32" height="32" fill="white" transform="translate(10 10)" />
              </clipPath>
            </defs>
          </svg>

          <p className="font-medium">
            {healthConditions[0]?.name || "Digestive & Gut Health"}
          </p>
        </button>

        <button
          onClick={() => setActiveBtn(healthConditions[1]?._id)}
          disabled={!healthConditions[1]?._id}
          className={`
            flex items-center gap-[15px]
            p-1.5 rounded-[8px] border
            ${activeBtn === healthConditions[1]?._id
              ? "border-[#093C16]"
              : "border-[#e0e0e0]"}
            transition-all duration-500
            ease-out cursor-pointer
          `}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="52" height="52" rx="6" fill="#093C16" fillOpacity={activeBtn === healthConditions[1]?._id ? "1" : "0.04"} />
            <g clipPath="url(#clip0_2_2518)">
              <path d="M38.4064 42C37.7886 42 37.1683 41.9531 36.5621 41.8606C34.217 41.5026 32.077 40.2701 30.5363 38.3902C29.0221 36.5427 28.1883 34.2032 28.1883 31.8028V19.3923C28.1883 17.4367 29.7795 15.8458 31.735 15.8456C33.5558 15.8455 35.2773 16.5219 36.5825 17.75C37.9624 19.0484 39.0486 20.5821 39.8108 22.3084C40.5999 24.0958 41 26.0006 41 27.9698V39.4065C41 40.8323 39.8531 41.9957 38.4435 42C38.4311 42 38.4188 42 38.4064 42ZM31.735 17.2206C30.5376 17.2206 29.5633 18.1948 29.5633 19.3923V31.8028C29.5633 36.1346 32.6613 39.8741 36.7696 40.5013C37.3181 40.5851 37.8813 40.6266 38.4394 40.625C39.0931 40.623 39.625 40.0764 39.625 39.4065V27.9698C39.625 24.443 38.2098 21.1692 35.6402 18.7514C34.5911 17.7642 33.2042 17.2205 31.735 17.2206Z" fill="#71BF45" />
              <path d="M11.5936 42C11.5812 42 11.5689 42 11.5565 41.9999C10.1469 41.9956 9 40.8322 9 39.4065V27.9697C9 26.0005 9.40012 24.0957 10.1892 22.3083C10.9514 20.582 12.0376 19.0483 13.4175 17.7499C14.7226 16.5218 16.4443 15.8455 18.2649 15.8455H18.265C20.2206 15.8455 21.8117 17.4365 21.8117 19.3921V31.8026C21.8117 34.2031 20.9778 36.5426 19.4637 38.3901C17.923 40.27 15.783 41.5025 13.4379 41.8605C12.8318 41.9531 12.2114 42 11.5936 42ZM18.265 17.2205C16.7958 17.2205 15.4089 17.7641 14.3598 18.7514C11.7902 21.1691 10.375 24.443 10.375 27.9697V39.4065C10.375 40.0763 10.9069 40.623 11.5607 40.6249C12.1193 40.6265 12.6819 40.585 13.2304 40.5013C17.3387 39.874 20.4368 36.1345 20.4368 31.8027V19.3922C20.4367 18.1947 19.4624 17.2205 18.265 17.2205Z" fill="#71BF45" />
              <path d="M36.5003 31.0945H34.3953L33.5266 26.7511H36.5003C36.8799 26.7511 37.1878 26.4433 37.1878 26.0636C37.1878 25.6839 36.8799 25.3761 36.5003 25.3761H32.8491L25.6875 21.8249V10.6876C25.6875 10.3079 25.3797 10.0001 25 10.0001C24.6203 10.0001 24.3125 10.3079 24.3125 10.6876V21.8249L17.1509 25.3762H13.4998C13.1201 25.3762 12.8123 25.684 12.8123 26.0637C12.8123 26.4434 13.1201 26.7512 13.4998 26.7512H16.4734L15.6047 31.0946H13.4997C13.12 31.0946 12.8122 31.4024 12.8122 31.7821C12.8122 32.1617 13.12 32.4696 13.4997 32.4696H15.3296L14.7316 35.4595C14.6572 35.8318 14.8986 36.194 15.2709 36.2684C15.3165 36.2776 15.3618 36.2819 15.4065 36.2819C15.7275 36.2819 16.0146 36.0559 16.0799 35.7291L16.8411 31.9231C16.8414 31.9212 16.8418 31.9194 16.8422 31.9175L17.9198
               26.5296L25 23.0188L32.0801 26.5296L33.1576 31.9176C33.158 31.9194 33.1584 31.9213 33.1588 31.9232L33.9199 35.7292C33.9853 36.056 34.2723 36.282 34.5933 36.282C34.638 36.282 34.6834 36.2776 34.7289 36.2685C35.1012 36.1941 35.3426 35.8319 35.2682 35.4596L34.6702 32.4696H36.5002C36.8799 32.4696 37.1877 32.1618 37.1877 31.7821C37.1877 31.4024 36.8799 31.0945 36.5003 31.0945Z" fill={activeBtn === healthConditions[1]?._id ? "white" : "black"} />
            </g>
            <defs>
              <clipPath id="clip0_2_2518">
                <rect width="32" height="32" fill="white" transform="translate(9 10)" />
              </clipPath>
            </defs>
          </svg>

          <p>{healthConditions[1]?.name || "Respiratory"}</p>
        </button>

        <button
          onClick={() => setActiveBtn(healthConditions[2]?._id)}
          disabled={!healthConditions[2]?._id}
          className={`
            flex items-center gap-[15px]
            p-1.5 rounded-[8px] border
            ${activeBtn === healthConditions[2]?._id
              ? "border-[#093C16]"
              : "border-[#e0e0e0]"}
            transition-all duration-500
            ease-out cursor-pointer
          `}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="52" height="52" rx="6" fill="#093C16" fillOpacity={activeBtn === healthConditions[2]?._id ? "1" : "0.04"} />
            <path d="M36.7134 11.1989C35.4213 9.73498 33.181 9.59228 31.7135 10.8779L30.7101 11.7012C30.7036 11.7064 30.6974 11.7118 30.6911 11.7172C29.9007 12.4109 29.4616 13.4241 29.4922 14.4751C27.6806 13.8425 25.4421 14.5735 24.1214 16.0345L18.5279 22.0177C17.6484 22.8811 17.1416 24.0325 17.1013 25.2626C17.0977 25.3663 17.0976 25.4706 17.1009 25.5747V32.2518C17.1009 32.3951 17.0704 32.5389 17.0125 32.6686L13.8725 38.5525C13.5062 39.3046 13.5601 40.1863 14.0104 40.8909C14.9273 42.3545 17.1095 42.3639 18.045 40.9142C18.0492 40.9121 21.7112 35.4204 21.715 35.4174C21.8626 35.1903 21.9705 34.9417 22.0359 34.6771L22.6174 32.307L24.1489 33.3634C25.0064 33.979 25.5514 34.9344 25.6446 35.9858L25.9556 39.9683C26.0037 40.5212 26.2554 41.0336 26.6657 41.4124C28.0791 42.7157 30.3959 41.7091 30.3999 39.7831L30.3999 33.8338C30.4036 33.1264 30.253 32.4297 29.9709 31.7906C30.9896 31.5839 31.758 30.7096 31.7981 29.6298L32.4562 19.3243C32.5177 18.8376 32.4987 18.3432 32.4034 17.8673C33.4553 18.0564 34.5335 17.7834 35.3787 17.0478L36.3821 16.2247C37.8551 14.9974 38.0116 12.6091 36.7134 11.1989ZM20.7007 34.3482C20.6728 34.4611 20.6268 34.5677 20.564 34.6651C20.5628 34.6693 16.8969 40.1555 16.8953 40.1599C16.7111 40.4463 16.376 40.6275 16.035 40.625C15.3069 40.6422 14.7846 39.8388 15.0959 39.1808C15.1142 39.1471 18.2389 33.2935 18.2524 33.2639C18.3987 32.9497 18.4761 32.5997 18.4761 32.2517V28.8684C19.2576 29.8878 20.3114 30.758 21.4065 31.4717L20.7007 34.3482ZM28.7723 40.3795C28.2673 40.881 27.3879 40.5627 27.3261 39.8551C27.3255 39.8485 27.0154 35.8748 27.0148 35.8688C26.887 34.4137 26.1324 33.0918 24.9445 32.2419C24.9408 32.2349 22.6038 30.6301 22.5975 30.6228L21.5328 29.8883C20.5751 29.2111 19.771 28.3901 19.143 27.4483C18.2487 26.1965 18.2597 24.6741 19.0932 23.4656L27.9337 31.2171C28.633 31.9002 29.0305 32.8509 29.0248 33.8283C29.0267 33.8305 29.0237 39.7764 29.025 39.7794C29.0237 40.0065 28.9339 40.2196 28.7723 40.3795ZM27.2124 28.7558L25.4561 27.2158L27.0373 25.5769L27.2124 25.4281V28.7558ZM30.4241 29.5738C30.3503 30.7685 28.6269 30.741 28.5875 29.5433V20.6168C28.555 19.7082 27.2467 19.7039 27.2124 20.6168V23.6235L26.1209 24.551C26.1037 24.5657 26.0871 24.5813 26.0714 24.5976L24.421 26.3082L20.0128 22.443L25.126 16.9735C26.5568 15.3752 29.2595 15.0324 30.5046 16.8945C30.8986 17.4317 31.1103 18.0675 31.1163 18.7292C31.1083 18.7532 30.4294 29.5518 30.4241 29.5738ZM36.2223 13.6828C36.1471 14.8874 35.287 15.3116 34.4785 16.0083C33.563 16.8198 32.1398 16.7074 31.364 15.7625C30.6222 14.9016 30.7281 13.4956 31.5924 12.7559L32.5947 11.9337C32.6012 11.9284 32.6074 11.923 32.6137 11.9176C34.042 10.6402 36.3576 11.772 36.2223 13.6828Z" fill={activeBtn === healthConditions[2]?._id ? "white" : "black"} />
            <path d="M35.1351 28.6245C34.8266 28.6245 34.5461 28.4155 34.4683 28.1026C34.3768 27.7341 34.6012 27.3612 34.9697 27.2695L37.5183 26.6361C38.4098 26.449 38.7263 27.7178 37.85 27.9705L35.3014 28.604C35.2458 28.6178 35.1899 28.6245 35.1351 28.6245Z" fill="#71BF45" />
            <path d="M34.9339 37.9908C34.7591 37.9908 34.5843 37.9245 34.4502 37.7918L32.584 35.9442C31.9606 35.2802 32.8797 34.3497 33.5515 34.967L35.4177 36.8146C35.8549 37.2408 35.5371 37.9974 34.9339 37.9908Z" fill="#71BF45" />
            <path d="M37.676 33.3667C37.6156 33.3667 37.5543 33.3587 37.4933 33.342L34.8309 32.6098C33.9622 32.3364 34.3076 31.075 35.1956 31.284L37.8579 32.0162C38.224 32.1169 38.4392 32.4953 38.3385 32.8614C38.2546 33.1664 37.9778 33.3667 37.676 33.3667Z" fill="#71BF45" />
          </svg>

          <p>{healthConditions[2]?.name || "Pain Relief"}</p>
        </button>

        <button
          onClick={() => setActiveBtn(healthConditions[3]?._id)}
          disabled={!healthConditions[3]?._id}
          className={`
            flex items-center gap-[15px]
            p-1.5 rounded-[8px] border
            ${activeBtn === healthConditions[3]?._id
              ? "border-[#093C16]"
              : "border-[#e0e0e0]"}
            transition-all duration-500
            ease-out cursor-pointer
          `}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="52" height="52" rx="6" fill="#093C16" fillOpacity={activeBtn === healthConditions[3]?._id ? "1" : "0.04"} />
            <g clipPath="url(#clip0_2_2540)">
              <path d="M41.9704 30.1962L39.7061 22.7283C39.6798 19.3759 38.3722 16.2189 36.0173 13.8279C33.641 11.4151 30.4691 10.0563 27.086 10.0017C26.0653 9.98532 25.0483 10.0878 24.0629 10.3064L24.3609 11.6488C25.2413 11.4534 26.1503 11.3621 27.0638 11.3765C30.0841 11.4253 32.916 12.6385 35.0377 14.7928C37.1617 16.9493 38.3315 19.8043 38.3315 22.8316C38.3315 22.8992 38.3415 22.9664 38.3612 23.0311L40.3857 29.7082H37.6782C37.2985 29.7082 36.9907 30.016 36.9907 30.3957V34.8881C36.9907 36.1997 35.9236 37.2668 34.612 37.2668H29.4085C29.0288 37.2668 28.721 37.5746 28.721 37.9543V40.6249H17.9256L18.4365 36.9898C18.7898 34.4748 18.352 31.9683 17.1705 29.7415C16.0352 27.6019 15.3808 24.9442 15.4201 22.6319C15.4242 22.3858 15.4364 22.1364 15.456 21.8905L14.0854 21.7808C14.0634 22.0553 14.05 22.3339 14.0453 22.6086C14.0016 25.1807 14.6979 28.0155 15.9558 30.3861C17.0006 32.3551 17.3875 34.5725 17.0748 36.7985L16.4539 41.2168C16.4262 41.4139 16.4853 41.6133 16.6158 41.7636C16.7464 41.9138 16.9356 42 17.1347 42H29.4085C29.7881 42 30.096 41.6922 30.096 41.3125V38.6418H34.612C36.6817 38.6418 38.3656 36.9579 38.3656 34.8882V31.0833H41.3125C41.5301 31.0833 41.735 30.9802 41.8647 30.8053C41.9944 30.6304 42.0336 30.4045 41.9704 30.1962Z" fill={activeBtn === healthConditions[3]?._id ? "white" : "black"} />
              <path d="M19.064 26.6909C18.8817 26.6909 18.7067 26.6185 18.5779 26.4896L11.6386 19.5502C10.5819 18.4936 10 17.0887 10 15.5944C10 14.1001 10.5819 12.6952 11.6386 11.6386C12.6952 10.5819 14.1001 10 15.5944 10C16.8699 10 18.0801 10.4239 19.0644 11.2053C21.2583 9.46831 24.4638 9.61281 26.4896 11.6386C27.5463 12.6952 28.1282 14.1001 28.1282 15.5944C28.1282 17.0887 27.5463 18.4936 26.4896 19.5502L19.5503 26.4896C19.4212 26.6185 19.2463 26.6909 19.064 26.6909ZM15.5944 11.375C14.4674 11.375 13.4078 11.8139 12.6109 12.6108C11.8139 13.4077 11.375 14.4674 11.375 15.5944C11.375 16.7214 11.8139 17.781 12.6108 18.5779L19.064 25.0311L25.5173 18.5779C26.3142 17.781 26.7531 16.7214 26.7531 15.5944C26.7531 14.4674 26.3142 13.4077 25.5173 12.6108C23.8722 10.9657 21.1954 10.9656 19.5501 12.6108C19.4212 12.7397 19.2463 12.8122 19.064 12.8122C18.8816 12.8122 18.7067 12.7397 18.5779 12.6108C17.7809 11.8139 16.7214 11.375 15.5944 11.375Z" fill="#71BF45" />
            </g>
            <defs>
              <clipPath id="clip0_2_2540">
                <rect width="32" height="32" fill="white" transform="translate(10 10)" />
              </clipPath>
            </defs>
          </svg>

          <p>{healthConditions[3]?.name || "Mental Health Relief"}</p>
        </button>

        <button
          onClick={() => setActiveBtn(healthConditions[4]?._id)}
          disabled={!healthConditions[4]?._id}
          className={`
            flex items-center gap-[15px]
            p-1.5 rounded-[8px] border
            ${activeBtn === healthConditions[4]?._id
              ? "border-[#093C16]"
              : "border-[#e0e0e0]"}
            transition-all duration-500
            ease-out cursor-pointer
          `}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="52" height="52" rx="6" fill="#093C16" fillOpacity={activeBtn === healthConditions[4]?._id ? "1" : "0.04"} />
            <g clipPath="url(#clip0_2_2550)">
              <path d="M12.9319 41.999C11.3152 41.999 10 40.6838 10 39.0672C10 38.4467 10.2027 38.0253 10.4218 37.6623L12.4124 34.3645C12.5386 34.1555 12.7659 34.0287 13.0102 34.0323C13.2543 34.0355 13.4784 34.168 13.5989 34.3804L15.4817 37.6978C15.7459 38.1633 15.8637 38.5856 15.8637 39.0671C15.8638 40.6838 14.5486 41.999 12.9319 41.999ZM12.9827 36.0804L11.599 38.3729C11.4294 38.6538 11.375 38.8225 11.375 39.0672C11.375 39.9256 12.0734 40.624 12.9319 40.624C13.7904 40.624 14.4888 39.9256 14.4888 39.0672C14.4888 38.8243 14.4338 38.6372 14.2859 38.3766L12.9827 36.0804Z" fill="#71BF45" />
              <path d="M37.9224 35.6041C37.2159 35.6041 36.5135 35.4035 35.8934 35.007C35.1246 34.5155 34.1599 34.5001 33.3759 34.9669L33.2663 35.0321C31.9715 35.8028 30.3461 35.7301 29.1253 34.8468L27.8989 33.9594L28.705 32.8455L29.9314 33.7328C30.7072 34.2942 31.7402 34.3405 32.5629 33.8506L32.6725 33.7854C33.9062 33.051 35.4241 33.0751 36.634 33.8485C37.3357 34.2971 38.2037 34.3512 38.9558 33.9932L40.8036 33.1135L41.3946 34.355L39.5467 35.2347C39.0279 35.4818 38.4739 35.6041 37.9224 35.6041Z" fill="#71BF45" />
              <path d="M40.3125 24.6809L40.0026 23.4098C39.9276 23.1019 39.6516 22.8851 39.3346 22.8851H38.3933V19.7985C38.3933 19.4188 38.0855 19.111 37.7058 19.111H31.6138C31.2341 19.111 30.9263 19.4188 30.9263 19.7985V22.8851H30.1366C29.8228 22.8851 29.5489 23.0976 29.4708 23.4015L29.1869 24.5062C27.9478 29.3268 27.3196 34.2948 27.3196 39.2721V41.3115C27.3196 41.6912 27.6274 41.999 28.0071 41.999H41.3125C41.6922 41.999 42 41.6912 42 41.3115V38.729C42 34.001 41.4322 29.2745 40.3125 24.6809ZM32.3013 20.486H37.0183V22.8851H32.3013V20.486ZM40.625 40.624H28.6946V39.2721C28.6946 34.4103 29.3083 29.5574 30.5186 24.8485L30.6698 24.2602H31.6138H37.7058H38.7946L38.9766 25.0065C40.0704 29.4937 40.625 34.1106 40.625 38.729V40.624Z" fill={activeBtn == healthConditions[4]?._id ? "white" : "black"} />
              <path d="M26.895 17.8539L24.2865 15.2454C24.018 14.9769 23.5827 14.9769 23.3142 15.2454L20.4541 18.1056C18.3868 20.1729 16.5483 22.4753 14.9897 24.9489L12.761 28.4859L11.6636 29.5834C11.3952 29.8519 11.3952 30.2872 11.6636 30.5557C11.7979 30.6899 11.9738 30.7571 12.1497 30.7571C12.3257 30.7571 12.5016 30.6899 12.6359 30.5557L13.7364 29.4552L17.4369 27.0573C19.7497 25.5586 21.9105 23.8106 23.8591 21.8619L26.8949 18.8262C27.0237 18.6973 27.0962 18.5224 27.0962 18.3401C27.0962 18.1578 27.0239 17.9828 26.895 17.8539ZM22.8869 20.8896C21.0064 22.7702 18.9212 24.4571 16.6892 25.9033L15.5472 26.6433L16.153 25.6819C17.657 23.2948 19.4312 21.0729 21.4264 19.0778L23.8004 16.7038L25.4365 18.34L22.8869 20.8896Z" fill={activeBtn == healthConditions[4]?._id ? "white" : "black"} />
              <path d="M27.262 19.8806C27.0797 19.8806 26.9048 19.8082 26.7759 19.6793L22.54 15.4433C22.2715 15.1748 22.2715 14.7395 22.54 14.471L25.9333 11.0776C27.3692 9.64176 29.7056 9.64176 31.1415 11.0776C31.8371 11.7732 32.2202 12.6981 32.2202 13.6818C32.2202 14.6655 31.8371 15.5903 31.1415 16.2859L27.7482 19.6793C27.6192 19.8082 27.4443 19.8806 27.262 19.8806ZM23.9983 14.9572L27.262 18.2209L30.1692 15.3136C30.6051 14.8778 30.8451 14.2983 30.8451 13.6818C30.8451 13.0654 30.6051 12.4859 30.1692 12.05C29.2694 11.1502 27.8053 11.1503 26.9055 12.05L23.9983 14.9572Z" fill="#71BF45" />
            </g>
            <defs>
              <clipPath id="clip0_2_2550">
                <rect width="32" height="32" fill="white" transform="translate(10 10)" />
              </clipPath>
            </defs>
          </svg>

          <p>{healthConditions[4]?.name || "Skin Care Routine"}</p>
        </button>
          </>
        )}
      </section>

      {/* PRODUCTS */}
      <section className="max-w-screen-2xl mx-auto space-y-4 px-3 md:px-10">
        <div className="flex items-center justify-between text-sm md:text-base">
          <p className="font-semibold">Gut Improve Suplements</p>
          <Link href="/products" className="flex items-center gap-1 hover:text-[#71BF45]">
            <p>View More</p>
            <MdKeyboardArrowRight />
          </Link>
        </div>

        {loadingProducts
          ? <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {Array.from({ length: 4 }).map((_, key) => (
              <ProductSkeleton key={key} />
            ))}
          </div>
          : products.length !== 0
            ? <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </div>
            : <p className="text-center text-lg text-[#919191] pt-10">No products found</p>
        }
      </section>

      {/* STATS SECTION */}
      <section
        ref={sectionRef}
        className="flex flex-col items-center justify-center h-screen w-full md:overflow-hidden">
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

        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 pt-32 lg:pt-20 flex flex-col-reverse h-fit md:h-auto md:flex-row items-center gap-20 md:justify-around">
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

      {/* COMPARISION TABLE */}
      <div className="max-w-screen-2xl mx-auto pt-24 px-2.5 sm:px-[30px] md:px-[60px]">
        <div className="overflow-hidden rounded-2xl shadow-lg border border-[#093C16]">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="py-2 sm:p-4 text-base sm:text-xl font-semibold text-white bg-[#71BF45] rounded-tl-2xl">
                  What you care about
                </th>
                <th className="py-2 sm:p-4 text-base sm:text-xl font-semibold text-white bg-[#71BF45] border-l border-[#093C16]">
                  Regular Supplements
                  <br />
                  <span className="text-sm sm:text-base font-normal">
                    (What you&apos;re getting now)
                  </span>
                </th>
                <th className="py-2 sm:p-4 text-base sm:text-xl font-semibold text-white bg-[#71BF45] border-l border-[#093C16] rounded-tr-2xl">
                  Zealous Health
                  <br />
                  <span className="text-sm sm:text-base font-normal">
                    (What you deserve)
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {tableData.map((data, idx) => (
                <tr
                  key={idx}
                  className={`${idx % 2 === 0 ? "bg-[#f8fff4]" : "bg-[#eaf8e3]"
                    } hover:bg-[#d7f2ca] transition-colors duration-200`}
                >
                  {/* Column 1 */}
                  <td className="text-xs sm:text-base px-2 py-4 sm:pl-6 border-t border-[#093C16]">
                    {data.col1}
                  </td>

                  {/* Column 2 */}
                  <td className="text-xs sm:text-base px-2 py-4 sm:pl-6 border-t border-l border-[#093C16]">
                    {data.col2}
                  </td>

                  {/* Column 3 */}
                  <td className="text-xs sm:text-base px-2 py-4 sm:pl-6 border-t border-l border-[#093C16]">
                    <div className="flex items-center gap-2">{data.col3}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OUR PROCESS */}
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

      {/* SCIENCE AT WORK SECTION */}
      <section className="max-w-screen-2xl mx-auto px-[30px] md:px-[60px] space-y-6">
        <div className="space-y-3 text-center">
          <p className="font-semibold text-2xl md:text-[32px] text-[#093C16]">
            Our Science at Work
          </p>
          <p>
            Our proprietary technologies ensure herbal
            nutrients reach deeper, work faster, and last longer.
          </p>
        </div>

        <div className="flex items-center flex-col md:flex-row gap-[50px]">
          {/* IMAGE ON LEFT */}
          <div className="block md:flex-1 relative w-full h-[320px] md:h-[720px] rounded-40px">
            <Image
              src="/scienceAtWork.png"
              fill
              alt="img"
              className="rounded-[40px]"
            />
          </div>

          {/* DESCRIPTION ON RIGHT */}
          <div className="flex-1 rounded-[40px] p-4 md:p-[30px] space-y-3 bg-gradient-to-b from-[#FBFFF9] to-[#79D347]">
            <p className="font-semibold text-lg md:text-3xl text-[#71BF45]">
              Where Science Meets Nature 🌿
            </p>

            <div className="space-y-4">
              <div className="border border-[#e3e3e3] bg-white rounded-[20px] p-5 space-y-5">
                <div className="border-b border-[#e3e3e3] py-2.5 space-y-4">
                  <p className="font-semibold md:text-xl text-[#093C16]">
                    1. Vitinano™ Technology
                  </p>
                  <p className="text-sm md:text-base">
                    Revolutionary Nano Emulsified BioCage (NEB)
                    system that improves solubility, absorption,
                    and effectiveness of herbs.
                  </p>
                </div>

                <Link
                  href="/science"
                  className="flex items-center gap-2 text-[#919191] hover:text-[#71BF45] font-medium text-xs">
                  <p>
                    Learn More
                  </p>
                  <MdKeyboardArrowRight />
                </Link>
              </div>

              <div className="border border-[#e3e3e3] bg-white rounded-[20px] p-5 space-y-5">
                <div className="border-b border-[#e3e3e3] py-2.5 space-y-4">
                  <p className="font-semibold md:text-xl text-[#093C16]">
                    2. Phyquantrix™ Technology
                  </p>
                  <p className="text-sm md:text-base">
                    Phytosome Quantum Nano Matrix that protects herbal activities
                    and ensures bioavability at the cellular level.
                  </p>
                </div>

                <Link
                  href="/science"
                  className="flex items-center gap-2 text-[#919191] hover:text-[#71BF45] font-medium text-xs">
                  <p>
                    Learn More
                  </p>
                  <MdKeyboardArrowRight />
                </Link>
              </div>

              <div className="border border-[#e3e3e3] bg-white rounded-[20px] p-5 space-y-5">
                <div className="border-b border-[#e3e3e3] py-2.5 space-y-4">
                  <p className="font-semibold md:text-xl text-[#093C16]">
                    3. Science That Cares
                  </p>
                  <p className="text-sm md:text-base">
                    Blending modern nanotech with ancient herbal wisdom to
                    provide safe, effective alternatives to pharmaceuticals.
                  </p>
                </div>

                <Link
                  href="/science"
                  className="flex items-center gap-2 text-[#919191] hover:text-[#71BF45] font-medium text-xs">
                  <p>
                    Learn More
                  </p>
                  <MdKeyboardArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOGS SECTION */}
      <section className="max-w-screen-2xl mx-auto space-y-3 sm:space-y-4 px-6 sm:px-[60px]">
        <p className="font-semibold text-2xl sm:text-[32px] text-[#093C16] text-center">
          Our Blogs
        </p>

        {/* Blog cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <BlogCard key={idx} />
          ))}
        </div>
      </section>
    </div >
  );
}
