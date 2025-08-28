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
import Link from "next/link";
import { getItem, KEY_ACCESS_TOKEN, removeItem } from "@/utils/localStorageManager";
import { axiosClient } from "@/utils/axiosClient";
import toast from "react-hot-toast";
import Cart from "../Cart";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getCart, mergeGuestCart } from "@/lib/thunks/cartThunks";
import { resetCart } from "@/lib/features/cartSlice";

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
    const [openCart, setOpenCart] = useState(false);

    const isUser = getItem(KEY_ACCESS_TOKEN)
    const dispatch = useAppDispatch()
    const cart: any[] = useAppSelector((state) => state.cartSlice.cart) || []
    var totalProducts = 0;
    Array.isArray(cart) && cart?.forEach((pro) => (totalProducts += pro.quantity))

    const wishlist = useAppSelector((state) => state.wishlistSlice.products)
    const totalWishlistProducts = wishlist.length;

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

    const handleLogout = async () => {
        try {
            if (isUser) {
                const response = await axiosClient.get("/api/auth?type=logout")
                removeItem(KEY_ACCESS_TOKEN)
                toast.success(response.data.result)
            }
        } catch (e) {
            return
        }
    }

    return (
        <div className="z-40 fixed w-full py-[10px] sm:py-2 px-4 sm:px-10 drop-shadow-[0px_4px_15.8px_rgba(0,0,0,0.06)] bg-white">
            <div className="w-full flex justify-between items-center sm:gap-[40px]">
                <div className="flex flex-col lg:flex-row gap-[21px]">
                    <Link
                        className="relative flex items-center gap-3"
                        href="/"
                    >
                        <RxHamburgerMenu
                            size={24}
                            className="text-[#71BF45] lg:hidden cursor-pointer"
                            onClick={() => setOpenSidebar(!openSidebar)}
                        />
                        <Image src="/logo.png" alt="logo" className="w-[68px] h-[37px] sm:w-[85px] sm:h-[47px]" width={85} height={47} />
                    </Link>

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
                        <div
                            onClick={() => setOpenCart(!openCart)}
                            className="relative p-2 sm:p-5 rounded-[60px] text-[#71BF45] bg-[#f3f3f3]">
                            <BsCart2 />
                            {totalProducts > 0 && (
                                <span className="absolute top-3 right-3 flex items-center justify-center">
                                    <span className="absolute inline-flex h-5 w-5 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                        {totalProducts}
                                    </span>
                                </span>
                            )}
                        </div>
                        <Link href="/wishlist" className="relative p-2 sm:p-5 rounded-[60px] text-[#71BF45] bg-[#f3f3f3]">
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
                    <Link
                        className="flex items-center gap-[6px] text-xs sm:text-base rounded-[4px] sm:rounded-[10px] p-2 sm:p-4 bg-[#093C16] text-[#ffffff]"
                        href={isUser ? "" : "/login"}
                        onClick={handleLogout}
                    >
                        <p className="font-semibold">{isUser ? "Logout" : "Login"}</p>
                        <CgProfile size={16} />
                    </Link>
                </div>
            </div>

            {openCart && <Cart onClose={() => setOpenCart(false)} />}

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
