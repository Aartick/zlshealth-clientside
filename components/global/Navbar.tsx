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
import { BsCart2, BsSuitHeart } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { getItem, KEY_ACCESS_TOKEN, MERGE_DONE_KEY, removeItem, setItem } from "@/utils/localStorageManager";
import { axiosClient } from "@/utils/axiosClient";
import toast from "react-hot-toast";

import Sidebar from "./Sidebar";
import ShopLink from "./ShopLink";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getCart } from "@/lib/thunks/cartThunks";
import { resetCart } from "@/lib/features/cartSlice";
import { getWishlist } from "@/lib/thunks/wishlistThunks";
import { resetWishlist } from "@/lib/features/wishlistSlice";
import { getMyAddress, getMyInfo } from "@/lib/thunks/userThunks";
import { useNavbarColor } from "@/context/NavbarColorContext";
import { product } from "@/interfaces/products";
import { removeMyInfo } from "@/lib/features/appConfigSlice";
import { persistor } from "@/lib/store";

const placeholderTexts = [
    "Stress Relief Syrup",
    "Immunity Booster Capsules",
    "Ashwagandha Supplements",
    "Diabetes Management",
    "Anti-Acne Cream",
];

function Navbar() {
    const { dark } = useNavbarColor();

    // States for search bar
    const [inputValue, setInputValue] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchResults, setSearchResults] = useState<product[]>([]);
    const desktopSearchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const [showResults, setShowResults] = useState(false);

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

    // Fetch products from backend based on search input
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (inputValue.trim() === "") {
                return setShowResults(false)
            };

            try {
                const response = await axiosClient.get(`/api/products/search?keyword=${inputValue}`)
                setSearchResults(response.data.result);
            } catch { }
        }

        // Debounce the search input to avoid excessive API calls
        const debounceTimeout = setTimeout(() => {
            fetchSearchResults();
        }, 400);

        return () => clearTimeout(debounceTimeout);

    }, [inputValue])

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                desktopSearchRef.current &&
                !desktopSearchRef.current.contains(target) &&
                mobileSearchRef.current &&
                !mobileSearchRef.current.contains(target)
            ) {
                setShowResults(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


    // ================= Sidebar and navigation logics ================

    // States for sidebar and navigation links
    const [openSidebar, setOpenSidebar] = useState<boolean>(false)
    const [open, setOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null)

    const pathname = usePathname();
    const dispatch = useAppDispatch()
    const isUser = getItem(KEY_ACCESS_TOKEN) // Check if user is logged in

    // Check if desktop on mount and resize
    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        checkDesktop();
        window.addEventListener('resize', checkDesktop);

        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    // Close dropdown when clicking outside and Escape(Esc) key
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false)
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [])

    // Close shop dropdown when navigating to products page (desktop only)
    useEffect(() => {
        if (pathname === "/products" && isDesktop) {
            setOpen(false);
        }
    }, [pathname, isDesktop])


    // ================ User Related Info. logics ================

    // Get cart products from Redux store and calculate total products
    const cart = useAppSelector((state) => state.cartSlice.cart)
    let totalProducts = 0;
    cart.forEach((pro) => (totalProducts += pro.quantity))

    // Get wishlist products from Redux store and calculate number of products
    const wishlist = useAppSelector((state) => state.wishlistSlice.products)
    const totalWishlistProducts = wishlist.length;

    // Get user profile and address from redux store and found the default address
    const myProfile = useAppSelector((state) => state.appConfig.myProfile)
    const myAddress = useAppSelector((state) => state.appConfig.myAddress)
    const address = myAddress?.find((adrs) => adrs.isDefault)

    // Sync user info, address, cart and wishlist with backend
    useEffect(() => {
        let bootstrapped = false;

        const unsubscribe = persistor.subscribe(() => {
            if (persistor.getState().bootstrapped && !bootstrapped) {
                bootstrapped = true;
                runSync(); // run ONCE on initial load
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (persistor.getState().bootstrapped) {
            runSync(); // run every time user logs in/out
        }
    }, [isUser]);

    const runSync = () => {
        if (isUser) {
            dispatch(getMyInfo());
            dispatch(getMyAddress());
            dispatch(getCart());
            dispatch(getWishlist());
        }
    };


    // ================= Handle logout action ================
    const handleLogout = async () => {
        try {
            if (isUser) {
                const response = await axiosClient.get("/api/auth?type=logout")
                removeItem(KEY_ACCESS_TOKEN)
                dispatch(removeMyInfo());
                dispatch(resetCart())
                dispatch(resetWishlist())
                signOut({ redirect: false })
                setItem(MERGE_DONE_KEY, "false")
                toast.success(response.data.result)
            }
        } catch { }
    }

    const currentPath = window.location.pathname + window.location.search;
    const path = `/login?redirect=${encodeURIComponent(currentPath)}`



    // ================ Scroll detection logics ================

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide when scrolling down
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            }
            // Show when scrolling up
            else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <nav className="z-40 fixed w-full">

            {/* ================ Navbar Section ================ */}
            <section className={`py-[10px] sm:py-2 px-4 sm:px-10 drop-shadow-[0px_4px_15.8px_rgba(0,0,0,0.06)] 
            transition-all duration-300 ease-in-out
                 ${pathname === "/"
                    ? (dark ? "bg-white text-black" : "bg-transparent backdrop-blur-md text-white")
                    : (pathname === "/science"
                        ? "bg-transparent backdrop-blur-md text-white"
                        : "bg-white text-black")
                }`}
            >
                <div className="max-w-screen-2xl mx-auto w-full flex justify-between items-center sm:gap-[40px]">
                    {/* ====== Company Logo and location section ====== */}
                    <div className="flex flex-row gap-[21px]">
                        <Link
                            className="relative"
                            href="/"
                        >
                            {/* Company logo */}
                            <Image src="/logo.png" alt="logo" className="w-[68px] h-[37px] sm:w-[85px] sm:h-[47px]" width={85} height={47} />
                        </Link>

                        {/* Location info */}
                        <Link
                            href={isUser ? "/profile" : "/login"}
                            className="flex items-center gap-[10px]"
                        >
                            <div className={`${pathname === "/" ? (dark ? "bg-[#71BF451A]" : "bg-white")
                                : (pathname === "/science" ? "bg-white" : "bg-[#71BF451A]")} text-[#36810B] p-1 rounded-full`}
                            >
                                <IoLocationOutline size={24} />
                            </div>
                            <div>
                                <p className={`text-xs ${pathname === "/" ? (dark ? "" : "text-[#e4e4e4]")
                                    : pathname === "/science" ? "text-[#e4e4e4]" : ""}`}>
                                    Delivered to
                                </p>
                                <div className={`flex items-center ${pathname === "/"
                                    ? (!dark ? "text-[#f9f9f9]" : "text-[#36810B]")
                                    : (pathname === "/science"
                                        ? "text-[#f9f9f9]" : "text-[#36810B]")
                                    }`}
                                >
                                    <p>{address?.cityTown || "Suryapet"} {address?.pinCode || "508206"}</p>
                                    <IoIosArrowDown size={12} />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* ====== Search bar section (desktop only) ====== */}
                    <div ref={desktopSearchRef} className="hidden lg:flex-1 lg:flex flex-col relative z-50">
                        <div className="flex justify-between items-center border-[0.5px] border-[#71BF45] rounded-[50px] py-2 px-2.5">
                            <div className="flex items-center gap-2.5 relative w-full">
                                <div className="relative w-full">
                                    {/* Search input */}
                                    <input
                                        id='search'
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => {
                                            setInputValue(e.target.value)
                                            setShowResults(true)
                                        }}
                                        className={`${dark ? "text-black" : "text-white"} text-xs w-full focus:outline-none`}
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

                                <label htmlFor='search' className="p-1 rounded-[27px] bg-[#71bf45] text-[#ffffff]">
                                    <IoSearchOutline size={15} />
                                </label>
                            </div>
                        </div>

                        {/* Search Results */}
                        {showResults && inputValue && searchResults.length > 0 && (
                            <div
                                className="absolute top-[105%] left-0 w-full bg-white/95 backdrop-blur-xl border-2 border-[#71BF45]/30 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] max-h-96 overflow-y-auto scrollbar-hide z-50 transition-all duration-200 ease-out animate-fadeInSearchResults"
                            >
                                {searchResults.map((product) => {
                                    const discountedPrice = (product.price - (product.price * product.discount / 100)).toFixed(2);
                                    return (
                                        <Link
                                            href={`/productDescription/${product._id}`}
                                            onClick={() => {
                                                setShowResults(false);
                                                setInputValue("");
                                            }}
                                            key={product._id}
                                            className="flex items-center gap-4 p-3 border-b border-gray-200/50 last:border-b-0 hover:bg-white/80 cursor-pointer transition-all duration-200 group backdrop-blur-sm"
                                        >
                                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-[#71BF45]/40 transition-colors duration-200 shadow-sm">
                                                <Image
                                                    src={product.productImg?.url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[#093C16] group-hover:text-[#71BF45] transition-colors duration-200 truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                                                    {product.about}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-sm font-bold text-[#093C16]">
                                                        ₹{discountedPrice}
                                                    </span>
                                                    {product.discount > 0 && (
                                                        <>
                                                            <span className="text-xs text-gray-500 line-through">
                                                                ₹{product.price}
                                                            </span>
                                                            <span className="text-xs font-medium text-[#71BF45] bg-[#71BF45]/15 px-1.5 py-0.5 rounded">
                                                                {product.discount}% off
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                {product.category?.name && (
                                                    <span className="inline-block text-xs text-gray-500 mt-1">
                                                        in {product.category.name}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {/* No products found message */}
                        {showResults && inputValue && searchResults.length === 0 && (
                            <div
                                className="absolute top-[105%] left-0 w-full bg-white/95 backdrop-blur-xl border-2 border-[#71BF45]/30 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] p-4 text-center z-50 transition-all duration-200 ease-out animate-fadeInSearchResults"
                            >
                                <p className="text-sm text-gray-600">No products found for &quot;{inputValue}&quot;</p>
                                <p className="text-xs text-gray-500 mt-1">Try searching with different keywords</p>
                            </div>
                        )}
                    </div>

                    {/* ====== Cart, wishlist, and login/logout section ====== */}
                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className="flex items-center gap-3 text-lg sm:text-2xl">
                            {/* Cart icon with product count */}
                            <Link
                                href="/cart"
                                className={`
                                    relative p-2 sm:p-5 rounded-full 
                                    ${pathname === "/"
                                        ? (dark ? "text-[#71BF45] bg-[#ffffff] shadow-[0px_4px_15.8px_0px_#0000000F_inset,4px_0px_15.8px_0px_#DADADA08_inset]"
                                            : "text-white bg-[#ffffff]/10")
                                        : (pathname === "/science"
                                            ? "text-white bg-[#ffffff]/10" : "text-[#71BF45] bg-[#ffffff] shadow-[0px_4px_15.8px_0px_#0000000F_inset,4px_0px_15.8px_0px_#DADADA08_inset]")
                                    }
                                `}
                            >
                                <BsCart2 />
                                {totalProducts > 0 && (
                                    <span className="absolute top-0 sm:top-3 right-0 sm:right-3 flex items-center justify-center">
                                        <span className="absolute inline-flex h-4 sm:h-5 w-4 sm:w-5 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                                        <span className="relative inline-flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] sm:text-xs font-bold">
                                            {totalProducts}
                                        </span>
                                    </span>
                                )}
                            </Link>

                            {/* Wishlist icon with product count */}
                            <Link
                                href="/wishlist"
                                className={`
                                    hidden lg:block relative p-2 sm:p-5 rounded-full
                                     ${pathname === "/"
                                        ? (dark ? "text-[#71BF45] bg-[#ffffff] shadow-[0px_4px_15.8px_0px_#0000000F_inset,4px_0px_15.8px_0px_#DADADA08_inset]"
                                            : "text-white bg-[#ffffff]/10")
                                        : (pathname === "/science"
                                            ? "text-white bg-[#ffffff]/10" : "text-[#71BF45] bg-[#ffffff] shadow-[0px_4px_15.8px_0px_#0000000F_inset,4px_0px_15.8px_0px_#DADADA08_inset]")
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

                            {/* Hamburger menu for sidebar (mobile) */}
                            <div className={`lg:hidden p-2 rounded-full
                                ${pathname === "/"
                                    ? (dark ? "text-[#71BF45] bg-[#ffffff] shadow-[0px_4px_15.8px_0px_#0000000F_inset,4px_0px_15.8px_0px_#DADADA08_inset]"
                                        : "text-white bg-[#ffffff]/10"
                                    ) : (pathname === "/science"
                                        ? "text-white bg-[#ffffff]/10" : "text-[#71BF45] bg-[#ffffff] shadow-[0px_4px_15.8px_0px_#0000000F_inset,4px_0px_15.8px_0px_#DADADA08_inset]")
                                }`}>
                                <RxHamburgerMenu
                                    size={18}
                                    className="text-[#71BF45] lg:hidden cursor-pointer"
                                    onClick={() => setOpenSidebar(!openSidebar)}
                                />
                            </div>
                        </div>

                        {/* Login/Logout button */}
                        <Link
                            className={`
                                hidden lg:flex items-center gap-[6px] 
                                text-xs sm:text-base 
                                rounded-[4px] sm:rounded-[43px]
                                 p-2 sm:p-4 ${pathname === "/"
                                    ? "bg-[#71BF45]"
                                    : "bg-[#093C16]"
                                }
                                 text-[#ffffff]
                                 `}
                            href={isUser ? "" : path}
                            onClick={handleLogout}
                        >
                            {/* Login based text */}
                            <p className="font-semibold">{isUser ? "Logout" : "Login"}</p>

                            {/* Login based user profile */}
                            {myProfile?.img ?
                                <div className="relative size-6">
                                    <Image
                                        src={myProfile?.img}
                                        alt={myProfile?.fullName}
                                        fill
                                        className="rounded-full"
                                    />
                                </div>
                                : <CgProfile size={20} />}
                        </Link>
                    </div>
                </div>

                {/* SEARCH BAR (Mobile Only) */}
                <div ref={mobileSearchRef} className="mt-2 lg:hidden relative">
                    <div className="w-full flex justify-between items-center border-[0.5px] border-[#71BF45] rounded-[50px] py-2 px-2.5">
                        <div className="flex items-center gap-2.5 relative w-full">
                            <div className="relative w-full">
                                {/* Search input */}
                                <input
                                    id='search'
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value)
                                        setShowResults(true)
                                    }}
                                    className={`${dark ? "text-black" : "text-white"} text-xs w-full focus:outline-none`}
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

                            <label htmlFor='search' className="p-1 rounded-[27px] bg-[#71bf45] text-[#ffffff]">
                                <IoSearchOutline size={15} />
                            </label>
                        </div>
                    </div>

                    {/* Search Results */}
                    {showResults && inputValue && searchResults.length > 0 && (
                        <div
                            className="absolute top-[105%] left-0 w-full bg-white/95 backdrop-blur-xl border-2 border-[#71BF45]/30 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] max-h-96 overflow-y-auto scrollbar-hide z-50 transition-all duration-200 ease-out animate-fadeInSearchResults"
                        >
                            {searchResults.map((product) => {
                                const discountedPrice = (product.price - (product.price * product.discount / 100)).toFixed(2);
                                return (
                                    <Link
                                        href={`/productDescription/${product._id}`}
                                        onClick={() => {
                                            setShowResults(false);
                                            setInputValue("");
                                        }}
                                        key={product._id}
                                        className="flex items-center gap-4 p-3 border-b border-gray-200/50 last:border-b-0 hover:bg-white/80 cursor-pointer transition-all duration-200 group backdrop-blur-sm"
                                    >
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-[#71BF45]/40 transition-colors duration-200 shadow-sm">
                                            <Image
                                                src={product.productImg?.url}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[#093C16] group-hover:text-[#71BF45] transition-colors duration-200 truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                                                {product.about}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-sm font-bold text-[#093C16]">
                                                    ₹{discountedPrice}
                                                </span>
                                                {product.discount > 0 && (
                                                    <>
                                                        <span className="text-xs text-gray-500 line-through">
                                                            ₹{product.price}
                                                        </span>
                                                        <span className="text-xs font-medium text-[#71BF45] bg-[#71BF45]/15 px-1.5 py-0.5 rounded">
                                                            {product.discount}% off
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            {product.category?.name && (
                                                <span className="inline-block text-xs text-gray-500 mt-1">
                                                    in {product.category.name}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* No products found message */}
                    {showResults && inputValue && searchResults.length === 0 && (
                        <div
                            className="absolute top-[105%] left-0 w-full bg-white/95 backdrop-blur-xl border-2 border-[#71BF45]/30 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] p-4 text-center z-50 transition-all duration-200 ease-out animate-fadeInSearchResults"
                        >
                            <p className="text-sm text-gray-600">No products found for &quot;{inputValue}&quot;</p>
                            <p className="text-xs text-gray-500 mt-1">Try searching with different keywords</p>
                        </div>
                    )}
                </div>

                {/* ============ Sidebar popup (mobile) ============ */}
                {openSidebar && (
                    <Sidebar
                        totalCartProducts={totalProducts}
                        totalWishlistProducts={totalWishlistProducts}
                        myProfile={myProfile}
                        onClose={() => {
                            setOpenSidebar(false)
                        }}
                    />
                )}
            </section>

            {/* ================ Navigation and Shop Dropdown Section ================ */}
            <section className={`relative w-full -z-10 transition-transform duration-500
                ${isVisible ? "translate-y-0" : "-translate-y-full"}
                `}>
                <div className="mx-4 sm:mx-0 sm:flex justify-center">
                    <div className={`flex items-center justify-around sm:gap-10 rounded-br-xl rounded-bl-xl
                         ${(pathname === "/" && !dark) ? "bg-transparent backdrop-blur-md" : "bg-[#71BF45]/10"} 
                         py-5 px-2.5`
                    }>
                        <Link
                            href="/"
                            className={
                                pathname === "/"
                                    ? "text-[#71BF45]" // active color
                                    : pathname !== "/" && pathname !== "/science" && pathname // when not home page
                                        ? "text-black"
                                        : "text-[#d0d0d0]" // on home but inactive
                            }
                        >
                            Home
                        </Link>

                        {/* SHOP DROPDOWN */}
                        <div
                            className="relative"
                            ref={dropdownRef}
                            onMouseEnter={() => setOpen(true)}
                            onMouseLeave={() => setOpen(false)}
                        >
                            <button
                                className={`
                                ${open
                                        ? "text-[#71BF45]"
                                        : pathname !== "/" && pathname !== "/science" && pathname
                                            ? "text-black"
                                            : pathname === "/" && dark
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
                                className={`absolute top-[100%] -left-[100px] sm:-left-[100px] md:-left-[200px] lg:-left-[380px] xl:-left-[540px]  transition-all duration-300 ease-in-out ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                    } z-50`}
                            >
                                <ShopLink />
                            </div>
                        </div>

                        <Link
                            href="/science"
                            className={`
                                ${pathname === "/science"
                                    ? "text-[#71BF45]"
                                    : pathname !== "/" && pathname
                                        ? "text-black"
                                        : pathname === "/" && dark
                                            ? "text-black"
                                            : "text-[#d0d0d0]"}
                                        flex items-center gap-[5px]
                            `}
                        >
                            Science
                        </Link>
                        <Link
                            href="/blogs"
                            className={
                                pathname === "/blogs"
                                    ? "text-[#71BF45]" // active
                                    : pathname !== "/" && pathname !== "/science" && pathname
                                        ? "text-black"
                                        : pathname === "/" && dark
                                            ? "text-black"
                                            : "text-[#d0d0d0]"
                            }
                        >
                            Blogs
                        </Link>
                    </div>
                </div>
            </section>
        </nav >
    );
}

export default Navbar;
