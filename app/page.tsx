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
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { FaLeaf, FaHeartbeat, FaBrain, FaShieldAlt, FaSeedling, FaRecycle, FaHandHoldingHeart } from "react-icons/fa";
import { axiosClient } from "@/utils/axiosClient";
import { product } from "@/interfaces/products";
import ProductSkeleton from "@/components/ProductSkeleton";
import { useNavbarColor } from "@/context/NavbarColorContext";
import StatsSection from "@/components/StatsSection";
import ProcessSection from "@/components/ProcessSection";

const comparisonData = [
  {
    icon: <FaLeaf className="text-3xl md:text-4xl" />,
    question: "Does your body actually use it?",
    regular: "Only 10-30% absorbed. You are literally peeing out 70% of what you paid for",
    zealous: "Your cells absorb 5-10x more-precision nano-delivery ensures nutrients reach target organs."
  },
  {
    icon: <FaHeartbeat className="text-3xl md:text-4xl" />,
    question: "Will you actually feel different?",
    regular: "Inconsistent results. Maybe you'll notice something in 6 months?",
    zealous: "You feel the energy boost within days - because nutrients actually reach your cells"
  },
  {
    icon: <FaShieldAlt className="text-3xl md:text-4xl" />,
    question: "Is it gentle on your stomach?",
    regular: "High doses = nausea, bloating, discomfort",
    zealous: "You take 80% less yet get better results - small doses, zero gut irritation"
  },
  {
    icon: <FaBrain className="text-3xl md:text-4xl" />,
    question: "Does it target your specific needs?",
    regular: "One-size-fits-all. Hope it helps something",
    zealous: "Your nutrients go exactly where you need them - brain, joints, heart, liver - base on your body's signals"
  },
  {
    icon: <FaSeedling className="text-3xl md:text-4xl" />,
    question: "Is it actually natural?",
    regular: "Chemical compounds, synthetic fillers, binders",
    zealous: "You get ancient herbal wisdom powered by modern nano-science-nature meets technology"
  },
  {
    icon: <FaRecycle className="text-3xl md:text-4xl" />,
    question: "Will it harm you long term?",
    regular: "Can stress your kidneys and liver with synthetic overload",
    zealous: "Your body naturally processes and eliminates - biodegradable, zero toxic buildup, safe to use lifelong"
  },
  {
    icon: <FaHandHoldingHeart className="text-3xl md:text-4xl" />,
    question: "Does it actually fix the problem?",
    regular: "Masks symptoms temporarily, then they return",
    zealous: "Your body heals at the cellular level - multi-pathway repair addresses root causes"
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
      <StatsSection />

      {/* COMPARISION TABLE */}
      {/* COMPARISON SECTION */}
      <div className="max-w-screen-2xl mx-auto pt-24 px-[30px] md:px-[60px]">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 space-y-3">
          <p className="font-semibold text-2xl md:text-[32px] text-[#093C16]">
            The Real Difference
          </p>
          <p className="text-sm md:text-base">
            See why thousands are switching from regular supplements to Zealous Health
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="space-y-6 md:space-y-8">
          {comparisonData.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Mobile Layout */}
              <div className="md:hidden">
                {/* Question Header with Icon */}
                <div className="bg-gradient-to-r from-[#71BF45] to-[#5da937] p-6 text-white flex items-center gap-4">
                  <div className="flex-shrink-0 bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    {item.icon}
                  </div>
                  <p className="font-semibold text-lg flex-1">{item.question}</p>
                </div>

                {/* Regular Supplements */}
                <div className="p-5 bg-red-50/50 border-b border-gray-200">
                  <div className="flex items-start gap-3 mb-2">
                    <IoCloseCircle className="text-2xl text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Regular Supplements
                      </p>
                      <p className="text-sm text-gray-700">{item.regular}</p>
                    </div>
                  </div>
                </div>

                {/* Zealous Health */}
                <div className="p-5 bg-green-50/50">
                  <div className="flex items-start gap-3">
                    <IoCheckmarkCircle className="text-2xl text-[#71BF45] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#71BF45] uppercase tracking-wide mb-1">
                        Zealous Health
                      </p>
                      <p className="text-sm text-gray-700">{item.zealous}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:block">
                <div className="flex items-stretch">
                  {/* Question Column */}
                  <div className="w-1/3 bg-gradient-to-br from-[#71BF45] to-[#5da937] p-8 flex items-center gap-5 text-white">
                    <div className="flex-shrink-0 bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                      {item.icon}
                    </div>
                    <p className="font-semibold text-lg md:text-xl">{item.question}</p>
                  </div>

                  {/* Regular Supplements Column */}
                  <div className="w-1/3 p-8 bg-red-50/30 border-l border-r border-gray-200 flex items-start gap-4">
                    <IoCloseCircle className="text-3xl text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Regular Supplements
                      </p>
                      <p className="text-sm leading-relaxed text-gray-700">{item.regular}</p>
                    </div>
                  </div>

                  {/* Zealous Health Column */}
                  <div className="w-1/3 p-8 bg-green-50/30 flex items-start gap-4">
                    <IoCheckmarkCircle className="text-3xl text-[#71BF45] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-semibold text-[#71BF45] uppercase tracking-wide mb-2">
                        Zealous Health
                      </p>
                      <p className="text-sm leading-relaxed text-gray-700">{item.zealous}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#71BF45] text-white px-8 py-3 rounded-full font-bold hover:bg-[#5da937] transition-colors duration-300"
          >
            Experience The Difference
            <GoArrowRight />
          </Link>
        </div>
      </div>

      {/* OUR PROCESS */}
      <ProcessSection />

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
            <BlogCard />
        </div>
      </section>
    </div >
  );
}
