/**
 * Navbar Component
 * 
 * This component renders the main navigation bar for the website.
 * It includes the logo, location info, search bar with animated placeholder,
 * cart and wishlist icons with product counts, login/logout button, and sidebar for mobile.
 * The cart and wishlist counts update dynamically from the Redux store.
 * The sidebar and cart popups are shown conditionally.
 */

"use client"

// Import required modules and components
import { IoLocationOutline, IoSearchOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { VscSettings } from "react-icons/vsc";
import { BsCart2, BsSuitHeart } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { getItem, KEY_ACCESS_TOKEN, removeItem } from "@/utils/localStorageManager";
import { axiosClient } from "@/utils/axiosClient";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getCart } from "@/lib/thunks/cartThunks";
import { resetCart } from "@/lib/features/cartSlice";
import { usePathname } from "next/navigation";
import { MdKeyboardArrowDown } from "react-icons/md";
import ShopLink from "../topBar/ShopLink";
import { isHiddenPath } from "@/utils/hiddenPaths";

const placeholderTexts = [
    "Stress Relief Syrup",
    "Immunity Booster Capsules",
    "Ashwagandha Supplements",
    "Diabetes Management",
    "Anti-Acne Cream",
];

// Navigation link interfaces
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

// Initial navigation links
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
    // State for search input value
    const [inputValue, setInputValue] = useState("");
    // State for animated placeholder index
    const [currentIndex, setCurrentIndex] = useState(0);
    // State for animation trigger
    const [isAnimating, setIsAnimating] = useState(false);
    // State for sidebar open/close
    const [openSidebar, setOpenSidebar] = useState<boolean>(false)
    // State for navigation links
    const [navLinks,] = useState(initialLinks)
    // State for shop dropdown open/close
    const [open, setOpen] = useState(false);

    const pathname = usePathname();

    // Check if user is logged in
    const isUser = getItem(KEY_ACCESS_TOKEN)
    const dispatch = useAppDispatch()
    // Get cart items from Redux store
    const cart = useAppSelector((state) => state.cartSlice.cart) || []
    // Calculate total products in cart
    let totalProducts = 0;
    Array.isArray(cart) && cart?.forEach((pro) => (totalProducts += pro.quantity))

    // Get wishlist products from Redux store
    const wishlist = useAppSelector((state) => state.wishlistSlice.products)
    // Calculate total wishlist products
    const totalWishlistProducts = wishlist.length;

    // Animated placeholder effect for search bar
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

    // Sync cart with backend or reset for guest
    useEffect(() => {
        const syncCart = async () => {
            if (isUser) {
                // await dispatch(mergeGuestCart());
                await dispatch(getCart());
            } else {
                dispatch(resetCart());
            }
        };
        syncCart()
    }, [isUser, dispatch])

    // Handle logout action
    const handleLogout = async () => {
        try {
            if (isUser) {
                const response = await axiosClient.get("/api/auth?type=logout")
                removeItem(KEY_ACCESS_TOKEN)
                toast.success(response.data.result)
            }
        } catch { }
    }

    return (
        <div className="z-40 fixed w-full">
            <div className={`py-[10px] sm:py-2 px-4 sm:px-10 drop-shadow-[0px_4px_15.8px_rgba(0,0,0,0.06)] ${pathname === "/" ? "bg-transparent backdrop-blur-md" : "bg-white"} text-black`}>
                <div className="container mx-auto w-full flex justify-between items-center sm:gap-[40px]">
                    {/* Logo and location section */}
                    <div className="flex flex-col lg:flex-row gap-[21px]">
                        <Link
                            className="relative flex items-center gap-3"
                            href="/"
                        >
                            {/* Hamburger menu for sidebar (mobile) */}
                            <RxHamburgerMenu
                                size={24}
                                className="text-[#71BF45] lg:hidden cursor-pointer"
                                onClick={() => setOpenSidebar(!openSidebar)}
                            />
                            {/* Company logo */}
                            <Image src="/logo.png" alt="logo" className="w-[68px] h-[37px] sm:w-[85px] sm:h-[47px]" width={85} height={47} />
                        </Link>

                        {/* Location info */}
                        <div className="flex items-center gap-[10px]">
                            <div className={`${pathname === "/" ? "bg-white" : "bg-[#71BF451A]"} text-[#36810B] p-1 rounded-full`}>
                                <IoLocationOutline size={24} />
                            </div>
                            <div>
                                <p className={`text-xs ${pathname === "/" ? "text-[#e4e4e4]" : ""}`}>Delivered to</p>
                                <div className={`flex items-center ${pathname === "/" ? "text-[#f9f9f9]" : "text-[#36810B]"}`}>
                                    <p>Suryapet 508206</p>
                                    <IoIosArrowDown size={12} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search bar section (desktop only) */}
                    <div className="hidden relative flex-1 lg:flex justify-between bg-[#f3f3f3] border-[0.5px] border-[#71BF45] rounded-[10px] py-5 px-2.5 drop-shadow-[0px_4px_15.8px_rgba(132, 132, 132, 0.2)]">
                        <div className="flex items-center gap-[10px] relative">
                            <div className="p-[2px] rounded-full bg-[#71bf45] text-[#ffffff]">
                                <IoSearchOutline size={15} />
                            </div>
                            <div className="relative">
                                {/* Search input */}
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
                                            &quot;{placeholderTexts[currentIndex]}&quot;
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-[#848484] border-l border-[#848484] pl-1">
                            <VscSettings size={24} />
                        </div>
                    </div>

                    {/* Cart, wishlist, and login/logout section */}
                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className="flex items-center gap-3 text-lg sm:text-2xl">
                            {/* Cart icon with product count */}
                            <Link
                                href="/cart"
                                className={`
                                    relative p-2 sm:p-5 rounded-full 
                                    ${pathname === "/"
                                        ? "text-white bg-[#ffffff]/10"
                                        : "text-[#71BF45] bg-[#ffffff] shadow-[0px_4px_15.8px_0px_#0000000F_inset,4px_0px_15.8px_0px_#DADADA08_inset]"
                                    }
                                `}
                            >
                                <BsCart2 />
                                {totalProducts > 0 && (
                                    <span className="absolute top-3 right-3 flex items-center justify-center">
                                        <span className="absolute inline-flex h-5 w-5 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                                        <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                            {totalProducts}
                                        </span>
                                    </span>
                                )}
                            </Link>
                            {/* Wishlist icon with product count */}
                            <Link
                                href="/wishlist"
                                className={`
                                    relative p-2 sm:p-5 rounded-full
                                     ${pathname === "/"
                                        ? "text-white bg-[#ffffff]/10"
                                        : "text-[#71BF45] bg-[#ffffff] shadow-[0px_4px_15.8px_0px_#0000000F_inset,4px_0px_15.8px_0px_#DADADA08_inset]"
                                    }
                                `}
                            >
                                <BsSuitHeart />
                                {totalWishlistProducts > 0 && (
                                    <span className="absolute top-3 right-3 flex items-center justify-center">
                                        <span className="absolute inline-flex h-5 w-5 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                                        <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                            {totalWishlistProducts}
                                        </span>
                                    </span>
                                )}
                            </Link>
                        </div>
                        {/* Login/Logout button */}
                        <Link
                            className={`
                                flex items-center gap-[6px] 
                                text-xs sm:text-base 
                                rounded-[4px] sm:rounded-[43px]
                                 p-2 sm:p-4 ${pathname === "/"
                                    ? "bg-[#71BF45]"
                                    : "bg-[#093C16]"
                                }
                                 text-[#ffffff]
                                 `}
                            href={isUser ? "" : "/login"}
                            onClick={handleLogout}
                        >
                            <p className="font-semibold">{isUser ? "Logout" : "Login"}</p>
                            <CgProfile size={16} />
                        </Link>
                    </div>
                </div>

                {/* Sidebar popup (mobile) */}
                {openSidebar && (
                    <Sidebar
                        links={navLinks}
                        onClose={() => {
                            setOpenSidebar(false)
                        }}
                    />
                )}
            </div>

            {/* TOP BAR: Navigation and shop dropdown */}
            <section className={isHiddenPath(pathname) ? "hidden" : "relative w-full"}>
                <div className="hidden lg:flex justify-center">
                    <div className={`flex items-center gap-5 rounded-br-xl rounded-bl-xl ${pathname === "/" ? "bg-transpare backdrop-blur-md" : "bg-[#71BF45]/10"} py-5 px-2.5`}>
                        <Link
                            href="/"
                            className={
                                pathname === "/"
                                    ? "text-[#71BF45]" // active color
                                    : pathname !== "/" && pathname // when not home page
                                        ? "text-black"
                                        : "text-[#d0d0d0]" // on home but inactive
                            }
                        >
                            Home
                        </Link>

                        {/* SHOP DROPDOWN */}
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className={`
                                ${open
                                        ? "text-[#71BF45]"
                                        : pathname !== "/" && pathname
                                            ? "text-black"
                                            : "text-[#d0d0d0]"}
                                        flex items-center gap-[5px]
                            `}
                            >
                                Shop
                                <span>
                                    <MdKeyboardArrowDown size={24} />
                                </span>
                            </button>

                            {/* ShopLink dropdown menu */}
                            <div
                                className={`absolute top-[140%] -left-[430px] transition-all duration-300 ease-in-out ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                    } z-50`}
                            >
                                <ShopLink />
                            </div>
                        </div>

                        <Link
                            href="/wellnessNeeds"
                            className={`
                                ${pathname === "/wellnessNeeds"
                                    ? "text-[#71BF45]"
                                    : pathname !== "/" && pathname
                                        ? "text-black"
                                        : "text-[#d0d0d0]"}
                                        flex items-center gap-[5px]
                            `}
                        >
                            Wellness Needs
                            <span>
                                <MdKeyboardArrowDown size={24} />
                            </span>
                        </Link>
                        <Link
                            href="/science"
                            className={`
                                ${pathname === "/science"
                                    ? "text-[#71BF45]"
                                    : pathname !== "/" && pathname
                                        ? "text-black"
                                        : "text-[#d0d0d0]"}
                                        flex items-center gap-[5px]
                            `}
                        >
                            Science
                            <span>
                                <MdKeyboardArrowDown size={24} />
                            </span>
                        </Link>
                        <Link
                            href="/blogs"
                            className={
                                pathname === "/blogs"
                                    ? "text-[#71BF45]" // active
                                    : pathname !== "/" && pathname // when not home page
                                        ? "text-black"
                                        : "text-[#d0d0d0]" // on home but inactive
                            }
                        >
                            Blogs
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Navbar;
