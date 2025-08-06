'use client'

import Image from "next/image";
import { BsLungs } from "react-icons/bs";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { GoArrowUpRight } from "react-icons/go";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";
import BenefitsCard from "@/components/BenefitsCard";
import ReviewCard from "@/components/ReviewCard";
import ShopLink from "@/components/topBar/ShopLink";
import { VscSettings } from "react-icons/vsc";
import { IoSearchOutline } from "react-icons/io5";

const placeholderTexts = [
  "Stress Relief Syrup",
  "Immunity Booster Capsules",
  "Ashwagandha Supplements",
  "Diabetes Management",
  "Anti-Acne Cream",
];

const tabs = [
  "Trending Now",
  "Popular This Week",
  "Herbal Heroes",
  "Customer Favorites",
  "What Everyone's Buying",
];

const categories = [
  {
    icon: <BsLungs />,
    title: "Digestive & Gut Health",
  },
  {
    icon: <BsLungs />,
    title: "Immunity & Respiratory",
  },
  {
    icon: <BsLungs />,
    title: "Joint, Bone & Mobility",
  },
  {
    icon: <BsLungs />,
    title: "Reproductive & Hormonal Health",
  },
  {
    icon: <BsLungs />,
    title: "Holistic Health & Wellness",
  },
  {
    icon: <BsLungs />,
    title: "Mental Wellness",
  },
  {
    icon: <BsLungs />,
    title: "Supplements",
  },
  {
    icon: <BsLungs />,
    title: "Skincare",
  },
];

const benefitsOfProducts = [
  {
    img: "/Herbalmg.png",
    title: "100% Herbal Formulas",
    description:
      "Safe, plant-based wellness with no harmful chemicals or side effects.",
  },
  {
    img: "/HealthSol.png",
    title: "Targeted Health Solutions",
    description:
      "Tailored remedies for concerns like diabetes, stress, and hormonal balance.",
  },
  {
    img: "/DeliveryImg.jpg",
    title: "Fast & Reliable Delivery",
    description: "Quick shipping across India with real-time order tracking.",
  },
  {
    img: "/DeliveryImg.jpg",
    title: "Trusted by Thousands",
    description:
      "Growing community of happy, repeat customers who believe in natural healing.",
  },
  {
    img: "/DeliveryImg.jpg",
    title: "Trusted by Thousands",
    description:
      "Growing community of happy, repeat customers who believe in natural healing.",
  },
];

const reviews = [
  {
    img: "/reviewImg.jpg",
    title: "Natural relief that works so well!",
    name: "Bhanu Priya",
    designation: "Yoga Instructor, Hyderabad",
    review:
      "I bought the Dibio supplement for my diabetic father after trying multiple alternatives. Within a few weeks, his enery levels improved noticeably. The fact that it's herbal and free from side effects gives us real peace of mind. Definitely..",
  },
  {
    img: "/reviewImg2.jpg",
    title: "💖 My Skin Feels Rejuvenated!",
    name: "Aradhya Sai",
    designation: "Salon Owner, Hyderabad",
    review:
      "I started using the anti-acne cream from Zealous a month ago, and wow - what a difference!✨ My skin feels calmer, clearer, and less irritated. I love that it's herbal🌺 and doesn't sting or dry out like chemical-based creams. Totally part of...",
  },
  {
    img: "/reviewImg3.jpg",
    title: "😴 Finally Sleeping Better!",
    name: "Rahul Reddy",
    designation: "Corporate Professional, Hyderabad",
    review:
      "Long work hours and stress had ruined my sleep cycle. I was skeptical at first, but Zealous's stress relief syrup🧪 really calms the nerves without making me groggy. I've been sleeping more soundly🛌, and it feels a natural solution I can actually rely...",
  },
];

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [open, setOpen] = useState(false);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentTab = tabRefs.current[activeTab]
    const scrollContainer = scrollRef.current;

    if (currentTab && scrollContainer) {
      const tabRect = currentTab.getBoundingClientRect()

      setUnderlineStyle({
        left: currentTab.offsetLeft - scrollContainer.scrollLeft,
        width: tabRect.width
      })

      currentTab.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      })
    }
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % placeholderTexts.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white space-y-[60px] mb-8">

      {/* TOP BAR */}
      <div className="relative z-30">
        <div className="hidden sm:flex justify-center">
          <div className="flex items-center gap-[50px] rounded-br-[40px] rounded-bl-[40px] bg-[#72bf451d] py-5 px-[10px] font-normal text-xl">
            <Link href="/">Home</Link>

            {/* SHOP DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-[5px]"
              >
                Shop
                <span>
                  <MdKeyboardArrowDown size={24} />
                </span>
              </button>

              <div
                className={`absolute top-[140%] -left-[430px] transition-all duration-300 ease-in-out ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  } z-50`}
              >
                <ShopLink />
              </div>
            </div>

            <Link href="/" className="flex items-center gap-[5px]">
              Wellness Needs
              <span>
                <MdKeyboardArrowDown size={24} />
              </span>
            </Link>
            <Link href="/" className="flex items-center gap-[5px]">
              Science
              <span>
                <MdKeyboardArrowDown size={24} />
              </span>
            </Link>
            <Link href="/">Blog</Link>
          </div>
        </div>
      </div>

      {/* SEARCH BAR FOR MOBILE VIEW */}
      <div className="relative sm:hidden flex justify-between bg-[#f3f3f3] border-[0.5px] border-[#71BF45] rounded-[10px] mx-6 py-5 px-[10px] drop-shadow-[0px_4px_15.8px_rgba(132, 132, 132, 0.2)]">
        <div className="flex items-center gap-[10px] relative">
          <div className="p-[2px] rounded-lg bg-[#71bf45] text-[#ffffff]">
            <IoSearchOutline size={15} />
          </div>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-[#f3f3f3] text-[#2e2e2e] text-xs w-[244px] focus:outline-none"
            />
            {/* Animated Placeholder */}
            {inputValue === "" && (
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center text-[#a3a3a3] text-xs overflow-hidden">
                <p>Search for&nbsp; </p>
                <div
                  className={`transition-transform duration-500 ${isAnimating
                    ? "-translate-y-full"
                    : "translate-y-0 opacity-100"
                    }`}
                  key={currentIndex}
                >
                  "{placeholderTexts[currentIndex]}"
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-[#848484]">
          <VscSettings size={24} />
        </div>
      </div>

      {/* CAROUSEL */}
      <div className="mx-6">
        <Carousel />
      </div>

      {/* CATEGORIES */}
      <div className="flex justify-between items-center px-6 sm:px-[60px]">
        <p className="font-normal text-2xl sm:text-[32px] whitespace-nowrap">
          <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
            Categ
          </span>
          ories
        </p>

        <Link href="/" className="sm:hidden flex items-center gap-[10px] text-[#71BF45]">
          <p className="text-base font-normal underline decoration-solid decoration-[#71BF45]">
            View All
          </p>
          <MdKeyboardArrowRight size={18} />
        </Link>
      </div>

      <div className="flex items-center overflow-x-scroll scrollbar-hide">
        <div className="flex items-center w-max sm:w-auto sm:grid grid-cols-4 gap-3 px-[10px] sm:px-[60px]">
          {categories.map((cat, idx) => (
            <div key={idx} className="group flex flex-col sm:flex-row items-center gap-3 border-[#e0e0e0] hover:border-[#71BF45] transition-colors duration-300 p-3 border-2 rounded-lg cursor-pointer w-[92px] min-h-[100px] sm:w-auto sm:min-h-auto">
              <p className="text-2xl">{cat.icon}</p>
              <p className="text-xs sm:text-base text-center font-medium text-[#093C16] group-hover:text-[#71BF45] transition-colors sm:text-nowrap">
                {cat.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8 sm:space-y-10 px-6 sm:px-[60px]">
        <p className="font-normal text-2xl sm:text-[32px] whitespace-nowrap">
          <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
            Our Pr
          </span>
          oducts
        </p>

        <div className="rounded-[40px] bg-white sm:shadow-2xl sm:shadow-[#bdbdbd] pt-6 sm:py-6 space-y-6">
          <div className="relative border-b border-b-[#e3e3e3]">
            <div
              className="relative flex justify-around items-center py-4 overflow-x-auto scrollbar-hide whitespace-nowrap"
              ref={scrollRef}
            >
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  ref={(el) => { tabRefs.current[idx] = el }}
                  onClick={() => setActiveTab(idx)}
                  className={`font-medium text-base text-[#2e2e2e] px-4 flex-shrink-0 ${activeTab === idx ? "text-[#093C16]" : ""
                    }`}
                >
                  {tab}
                </button>
              ))}

              <div
                className="absolute bottom-0 h-[4px] bg-[#093C16] transition-all duration-300 ease-in-out"
                style={{
                  left: underlineStyle.left,
                  width: underlineStyle.width,
                }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center sm:px-12">
            <p className="font-medium text-base sm:text-xl">See What's Hot Right Now!</p>
            <Link href="/" className="text-base flex items-center gap-[10px]">
              <p className="text-[#093C16] font-normal underline decoration-solid decoration-[#093C16]">
                View All
              </p>
              <MdKeyboardArrowRight color="#1C1B1F" />
            </Link>
          </div>

          <div className="grid grid-cols-2 w-max sm:w-auto sm:flex items-center gap-4 sm:px-12">
            {[...Array(4)].map((_, idx) => (
              <ProductCard key={idx} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <p className="font-normal text-2xl sm:text-[32px] whitespace-nowrap px-6 sm:px-[60px]">
          <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
            Benefi
          </span>
          ts of our Products
        </p>

        <div className="flex items-center gap-[30px] overflow-x-scroll py-[10px] pl-6 sm:pl-[60px] scrollbar-hide">
          <div className="flex items-center gap-[30px] w-max">
            {benefitsOfProducts.map((data, idx) => (
              <BenefitsCard key={idx} data={data} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center sm:gap-[60px]">
        <div className="border-r border-[#71BF45] sm:py-[10px] p-[10px] sm:pr-10 sm:pl-[10px] space-y-[8px] sm:space-y-[10px]">
          <p className="text-[#36810B] font-normal text-[42px] sm:text-[62px]">50 +</p>
          <p className="text-xs sm:text-2xl font-normal">Herbal Wellness Products</p>
        </div>
        <div className="border-r border-[#71BF45] sm:py-[10px] p-[10px] sm:pr-10 sm:pl-[10px] space-y-[8px] sm:space-y-[10px]">
          <p className="text-[#36810B] font-normal text-[42px] sm:text-[62px]">10k +</p>
          <p className="text-xs sm:text-2xl font-normal">Happy Customers Served</p>
        </div>
        <div className="sm:py-[10px] p-[10px] sm:pr-5 sm:pl-[10px] space-y-[8px] sm:space-y-[10px]">
          <p className="text-[#36810B] font-normal text-[42px] sm:text-[62px]">8 +</p>
          <p className="text-xs sm:text-2xl font-normal">Years of Herbal Expertise</p>
        </div>
      </div>

      <div className="space-y-10">
        <p className="font-normal text-2xl sm:text-[32px] whitespace-nowrap px-6 sm:px-[60px]">
          <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
            Our Pr
          </span>
          ocess
        </p>

        <div className="flex flex-col sm:flex-row gap-[30px] px-6 sm:px-[60px]">
          <div className="relative w-full max-w-[634px] aspect-[634/775] mx-auto">
            <Image
              src="/Process.png"
              alt="img"
              fill
              className="rounded-3xl sm:rounded-[40px] object-cover"
            />

            {/* Overlay button group positioned at the bottom center */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 items-center text-[#093C16]">
              <p className="rounded-[30px] px-9 sm:px-32 py-2 sm:py-[10px] bg-white font-medium text-base sm:text-2xl whitespace-nowrap">
                Fast & Reliable Delivery
              </p>
              <p className="p-2 sm:p-[10px] bg-white rounded-[30px]">
                <GoArrowUpRight size={22} className="sm:size-[26px]" />
              </p>
            </div>
          </div>

          <div className="space-y-[12px] sm:space-y-[30px]">
            <p className="font-normal text-center sm:text-left text-xl sm:text-[32px] text-[#093C16]">Why Choose Zealous?</p>
            <p className="font-normal text-center sm:text-left text-base sm:text-2xl">
              Natural wellness backed by tradition, science, and trust.
            </p>

            {/* FIRST ROW */}
            <div className="flex justify-between">
              <div className="py-[15px] px-5 rounded-[20px] space-y-[10px]">
                <div className="flex flex-col sm:flex-row items-center gap-[10px]">
                  <div className="p-5 rounded-[60px] shadow-inner shadow-[#dadada]">
                    <Image
                      src="/🌿.png"
                      alt="sourcedImg"
                      width={30}
                      height={30}
                    />
                  </div>
                  <p className="text-[#36810B] text-base sm:text-2xl font-normal">
                    Sourced
                  </p>
                </div>
                <p className="px-[10px] text-center sm:text-left font-normal text-base text-[#999999]">
                  Natural herbs selected from trusted farms
                </p>
              </div>
              <div className="py-[15px] px-5 rounded-[20px] space-y-[10px]">
                <div className="flex flex-col sm:flex-row items-center gap-[10px]">
                  <div className="p-5 rounded-[60px] shadow-inner shadow-[#dadada]">
                    <Image
                      src="/🧪.png"
                      alt="testedImg"
                      width={30}
                      height={30}
                    />
                  </div>
                  <p className="text-[#36810B] text-base sm:text-2xl font-normal">
                    Tested
                  </p>
                </div>
                <p className="px-[10px] text-center sm:text-left font-normal text-base text-[#999999]">
                  Every ingredient quality-checked for safety
                </p>
              </div>
            </div>

            {/* SECOND ROW */}
            <div className="flex justify-between">
              <div className="py-[15px] px-5 rounded-[20px] space-y-[10px]">
                <div className="flex flex-col sm:flex-row items-center gap-[10px]">
                  <div className="p-5 rounded-[60px] shadow-inner shadow-[#dadada]">
                    <Image
                      src="/🔬.png"
                      alt="formulatedImg"
                      width={30}
                      height={30}
                    />
                  </div>
                  <p className="text-[#36810B] text-base sm:text-2xl font-normal">
                    Formulated
                  </p>
                </div>
                <p className="px-[10px] text-center sm:text-left font-normal text-base text-[#999999]">
                  Expert blend crafted fro targeted health
                </p>
              </div>
              <div className="py-[15px] px-5 rounded-[20px] space-y-[10px]">
                <div className="flex flex-col sm:flex-row items-center gap-[10px]">
                  <div className="p-5 rounded-[60px] shadow-inner shadow-[#dadada]">
                    <Image
                      src="/🏭.png"
                      alt="manufacturedImg"
                      width={30}
                      height={30}
                    />
                  </div>
                  <p className="text-[#36810B] text-base sm:text-2xl font-normal">
                    Manufactured
                  </p>
                </div>
                <p className="px-[10px] font-normal text-center sm:text-left text-base text-[#999999]">
                  In certified, hygenic production units
                </p>
              </div>
            </div>

            {/* THIRD ROW */}
            <div className="flex justify-between">
              <div className="py-[15px] px-5 rounded-[20px] space-y-[10px]">
                <div className="flex flex-col sm:flex-row items-center gap-[10px]">
                  <div className="p-5 rounded-[60px] shadow-inner shadow-[#dadada]">
                    <Image
                      src="/📦.png"
                      alt="packedImg"
                      width={30}
                      height={30}
                    />
                  </div>
                  <p className="text-[#36810B] text-base sm:text-2xl font-normal">
                    Packed
                  </p>
                </div>
                <p className="px-[10px] text-center sm:text-left font-normal text-base text-[#999999]">
                  Sealed for freshness and purity
                </p>
              </div>
              <div className="py-[15px] px-5 rounded-[20px] space-y-[10px]">
                <div className="flex flex-col sm:flex-row items-center gap-[10px]">
                  <div className="p-5 rounded-[60px] shadow-inner shadow-[#dadada]">
                    <Image
                      src="/🚚.png"
                      alt="deliveredImg"
                      width={30}
                      height={30}
                    />
                  </div>
                  <p className="text-[#36810B] text-base sm:text-2xl font-normal">
                    Delivered
                  </p>
                </div>
                <p className="px-[10px] text-center sm:text-left font-normal text-base text-[#999999]">
                  Shipped quickly across India
                </p>
              </div>
            </div>

            <Link href="/" className="flex items-center gap-1">
              <IoIosLink className="text-base sm:text-2xl" />
              <p className="text-base sm:text-2xl underline text-[#36810B] font-light">
                Vitinano <span className="align-super">TM</span>
              </p>
            </Link>

            <Link href="/" className="flex items-center gap-1">
              <IoIosLink className="text-base sm:text-2xl" />
              <p className="text-base sm:text-2xl underline text-[#36810B] font-light">
                Phyquantrix <span className="align-super">TM</span>
              </p>
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden sm:block space-y-6 sm:space-y-10 px-6 sm:px-[60px]">
        <p className="font-normal text-2xl sm:text-[32px] whitespace-nowrap">
          <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
            Our
          </span>
          Mission
        </p>

        <div className="space-y-[30px]">
          <p className="px-5 font-normal text-base sm:text-2xl">
            At Zealous, we believe wellness should be natural, effective, and
            accessible. Our mission is to empower every household with safe,
            herbal solutions rooted in ancient wisdom and backed by modern
            science.
          </p>

          <Image
            src="/OurMission.png"
            alt="Our Mission Img"
            height={700}
            width={100}
            className="rounded-[40px] w-full sm:h-[700px] shadow-lg shadow-[#bdbdbd]"
          />

          <div className="flex gap-[152px]">
            <div className="space-y-10">
              <div className="flex items-center gap-2">
                <p className="font-normal text-2xl sm:text-[32px] text-nowrap">
                  From Nature to Nurture
                </p>
                <Image src="/🌿.png" alt="sourceImg" width={8} height={8} className="size-8" />
              </div>
              <p className="font-normal text-2xl text-[#36810B]">
                Discover how Zealous began its wellness journey
              </p>

              <button className="py-[10px] px-5 rounded-[10px] bg-[#71BF45] font-normal text-base text-white">
                Read Our Story
              </button>
            </div>

            <div className="space-y-[30px] font-normal text-xl text-justify">
              <p>
                At Zealous, we're on a journey to bring people closer to nature
                one remedy at a time. We aim to bridge the gap between time
                tested Ayurvedic knowledge and the everyday wellness needs of
                modern life.
              </p>
              <p>
                Our mission is to offer clean, honest, and effective herbal
                products that support healing from the inside out, without
                compromise.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block space-y-3 sm:space-y-5 px-6 sm:px-[60px]">
        <p className="font-normal text-2xl sm:text-[32px] whitespace-nowrap">
          <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
            Our B
          </span>
          logs
        </p>

        <div className="space-y-1 sm:space-y-4">
          <div className="flex items-center justify-end gap-[10px] text-[#093C16]">
            <Link href="/">
              <p className="underline decoration-solid">Read All Blogs</p>
            </Link>
            <MdKeyboardArrowRight size={12} color="#1C1B1F" />
          </div>

          <div className="flex items-center gap-4">
            <div className="p-5 space-y-5">
              <div className="space-y-4">
                <Image
                  src="/Blog1.png"
                  alt="Blog1"
                  width={362}
                  height={232}
                  className="w-[362px] h-[232px] rounded-2xl shadow-md shadow-[#bdbdbd]"
                />
                <p className="font-normal text-center text-2xl">
                  Debunking Common Myths About Food Supplements
                </p>

                <div className="flex justify-center items-center gap-[10px]">
                  <p className="rounded-[30px] border border-[#d6d6d6] py-[5px] px-[10px] font-normal text-sm">
                    Supplements
                  </p>
                  <p className="rounded-[30px] border border-[#d6d6d6] py-[5px] px-[10px] font-normal text-sm">
                    Wellness
                  </p>
                  <p className="rounded-[30px] border border-[#d6d6d6] py-[5px] px-[10px] font-normal text-sm">
                    Myths
                  </p>
                </div>

                <p className="font-normal text-base text-center text-[#848484]">
                  Food supplements have gained immense popularity over the
                  years, but with this rise in interest comes a plethara of
                  misconceptions and myths.
                </p>

                <button className="w-full py-[10px] px-5 rounded-[10px] border-[2px] border-[#71BF45] bg-[#72bf4524] text-[#64a43e]">
                  Read More
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div className="space-y-4">
                <Image
                  src="/Blog2.png"
                  alt="Blog2"
                  width={362}
                  height={232}
                  className="w-[362px] h-[232px] rounded-2xl shadow-md shadow-[#bdbdbd]"
                />
                <p className="font-normal text-center text-2xl">
                  How To Choose The Best Food Supplements For Your Lifestyle
                </p>

                <div className="flex justify-center items-center gap-[10px]">
                  <p className="rounded-[30px] border border-[#d6d6d6] py-[5px] px-[10px] font-normal text-sm">
                    Nutrition
                  </p>
                  <p className="rounded-[30px] border border-[#d6d6d6] py-[5px] px-[10px] font-normal text-sm">
                    Supplement Guide
                  </p>
                  <p className="rounded-[30px] border border-[#d6d6d6] py-[5px] px-[10px] font-normal text-sm">
                    Lifestyle Fit
                  </p>
                </div>

                <p className="font-normal text-base text-center text-[#848484]">
                  Navigating the world of food supplements can be overwhelming,
                  with countless options available, each promising various
                  health benefits.
                </p>

                <button className="w-full py-[10px] px-5 rounded-[10px] border-[2px] border-[#71BF45] bg-[#72bf4524] text-[#64a43e]">
                  Read More
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div className="space-y-4">
                <Image
                  src="/Blog2.png"
                  alt="Blog3"
                  width={362}
                  height={232}
                  className="w-[362px] h-[232px] rounded-2xl shadow-md shadow-[#bdbdbd]"
                />
                <p className="font-normal text-center text-2xl">
                  How To Choose The Best Food For Your Lifestyle
                </p>

                <div className="flex justify-center items-center gap-[10px]">
                  <p className="rounded-[30px] border border-[#d6d6d6] py-[5px] px-[10px] font-normal text-sm">
                    Nutrition
                  </p>
                  <p className="rounded-[30px] border border-[#d6d6d6] py-[5px] px-[10px] font-normal text-sm">
                    Supplement Guide
                  </p>
                  <p className="rounded-[30px] border border-[#d6d6d6] py-[5px] px-[10px] font-normal text-sm">
                    Lifestyle Fit
                  </p>
                </div>

                <p className="font-normal text-base text-center text-[#848484]">
                  Navigating the world of food supplements can be overwhelming,
                  with countless options available, each promising various
                  health benefits.
                </p>

                <button className="w-full py-[10px] px-5 rounded-[10px] border-[2px] border-[#71BF45] bg-[#72bf4524] text-[#64a43e]">
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-[30px]">
        <p className="font-normal text-2xl sm:text-[32px] whitespace-nowrap px-6 sm:px-[60px]">
          <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
            What Our
          </span>{" "}
          Customers Say?
        </p>

        <div className="flex items-center w-full overflow-x-scroll scrollbar-hide gap-[30px] py-[10px] pr-5 pl-6 sm:pl-[60px]">
          <div className="flex items-center gap-5 sm:gap-[40px] w-max">
            {reviews.map((data, idx) => (
              <ReviewCard data={data} key={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
