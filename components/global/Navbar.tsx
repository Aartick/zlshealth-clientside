"use client"

import { IoLocationOutline, IoSearchOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { VscSettings } from "react-icons/vsc";
import { BsCart2, BsSuitHeart } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "./Sidebar";

const placeholderTexts = [
    "Stress Relief Syrup",
    "Immunity Booster Capsules",
    "Ashwagandha Supplements",
    "Diabetes Management",
    "Anti-Acne Cream",
];

interface Category {
    name: string;
    href: string;
}

interface SubPath {
    name: string;
    href: string;
    categories?: Category[];
}

interface NavLink {
    name: string;
    href: string;
    subPaths?: SubPath[];
}

const initialLinks: NavLink[] = [
    { name: "Home", href: "/" },
    {
        name: "Shop",
        href: "/",
        subPaths: [
            {
                name: "Shop By Category",
                href: "/"
            },
            {
                name: "Shop By Need",
                href: "/"
            }
        ]
    },
    {
        name: "Wellness Needs",
        href: "/",
    },
    {
        name: "Science",
        href: "/"
    },
    { name: "Blog", href: "/" },
];

function Navbar() {
    const [inputValue, setInputValue] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [openSidebar, setOpenSidebar] = useState<boolean>(false)
    const [navLinks, setNavLinks] = useState(initialLinks)

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
        <div className="z-40 fixed w-full py-[10px] sm:py-2 px-4 sm:px-10 drop-shadow-[0px_4px_15.8px_rgba(0,0,0,0.06)] bg-white">
            <div className="w-full flex justify-between items-center sm:gap-[40px]">
                <div className="flex flex-col lg:flex-row gap-[21px]">
                    <div className="relative flex items-center gap-3">
                        <RxHamburgerMenu
                            size={24}
                            className="text-[#71BF45] lg:hidden cursor-pointer"
                            onClick={() => setOpenSidebar(!openSidebar)}
                        />
                        <Image src="/logo.png" alt="logo" className="w-[68px] h-[37px] sm:w-[85px] sm:h-[47px]" width={85} height={47} />
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-[10px]">
                        <div className="bg-[#71BF451A] text-[#36810B] p-1 rounded-full">
                            <IoLocationOutline size={24} />
                        </div>
                        <div>
                            <p className="text-xs ">Delivered to</p>
                            <div className="flex items-center text-[#36810B]">
                                <p>Suryapet 508206</p>
                                <IoIosArrowDown size={12} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="hidden relative flex-1 lg:flex justify-between bg-[#f3f3f3] border-[0.5px] border-[#71BF45] rounded-[10px] py-5 px-[10px] drop-shadow-[0px_4px_15.8px_rgba(132, 132, 132, 0.2)]">
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

                {/* Login */}
                <div className="flex items-center gap-3 sm:gap-5">
                    <div className="flex items-center gap-3 text-lg sm:text-2xl">
                        <div className="p-2 sm:p-5 rounded-[60px] text-[#71BF45] bg-[#f3f3f3]">
                            <BsCart2 />
                        </div>
                        <div className="p-2 sm:p-5 rounded-[60px] text-[#71BF45] bg-[#f3f3f3]">
                            <BsSuitHeart />
                        </div>
                    </div>
                    <button className="flex items-center gap-[6px] text-xs sm:text-base rounded-[4px] sm:rounded-[10px] p-2 sm:p-4 bg-[#093C16] text-[#ffffff]">
                        <p className="font-semibold">Login</p>
                        <CgProfile size={16} />
                    </button>
                </div>
            </div>

            {openSidebar && (
                <Sidebar
                    links={navLinks}
                    onClose={() => {
                        setOpenSidebar(false)
                    }}
                />
            )}
        </div>
    );
}

export default Navbar;
