/**
 * Sidebar Component
 * 
 * This component renders a slide-in sidebar navigation for mobile and small screens.
 * It displays navigation links, including multi-level dropdowns for categories and subcategories.
 * The sidebar includes the company logo and a close button, and overlays the main content.
 * Dropdowns can be expanded/collapsed, and clicking a link or the overlay closes the sidebar.
 */

'use client'

// Import required modules and components
import { axiosClient } from '@/utils/axiosClient';
import { getItem, KEY_ACCESS_TOKEN, removeItem } from '@/utils/localStorageManager';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { signOut } from "next-auth/react";
import { BsCart2, BsSuitHeart } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { UserDetails } from '@/interfaces/user';
import { LuLogOut } from 'react-icons/lu';
import { FaGear } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { removeMyInfo } from '@/lib/features/appConfigSlice';
import { useAppDispatch } from '@/lib/hooks';
import { resetCart } from '@/lib/features/cartSlice';
import { resetWishlist } from '@/lib/features/wishlistSlice';

// Props for Sidebar component
interface Props {
    totalCartProducts: number;
    totalWishlistProducts: number;
    myProfile?: UserDetails;
    onClose: () => void;
}

function Sidebar({
    totalCartProducts,
    totalWishlistProducts,
    myProfile,
    onClose
}: Props) {
    // State for sidebar closing animation
    const [isClosing, setIsClosing] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Handle sidebar close with animation
    const handleCloseClick = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    const currentPath = window.location.pathname + window.location.search;
    const path = `/login?redirect=${encodeURIComponent(currentPath)}`

    const isUser = getItem(KEY_ACCESS_TOKEN) // Check if user is logged in

    // ================= Handle logout action ================
    const handleLogout = async () => {
        try {
            if (isUser) {
                const response = await axiosClient.get("/api/auth?type=logout")
                removeItem(KEY_ACCESS_TOKEN)
                dispatch(removeMyInfo())
                dispatch(resetCart())
                dispatch(resetWishlist())
                signOut({ redirect: false })
                toast.success(response.data.result)
            }
        } catch { }
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay: closes sidebar when clicked */}
            <div
                className={`fixed h-screen inset-0 bg-black transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-50"}`}
                onClick={handleCloseClick}
            ></div>

            {/* Sidebar panel */}
            <div
                className={`relative h-[450px] overflow-y-scroll scrollbar-hide top-28 w-64 px-4 pb-5 pt-4 space-y-3 rounded-tl-xl rounded-bl-xl bg-[#ffffff] text-[#355920]] transition-transform duration-300 
          ${isClosing ? "sidebar-slide-out" : "sidebar-slide-in"}`}
            >

                {/* CART, WISHLIST AND PROFILE */}
                <section>
                    {/* Cart icon with product count */}
                    <Link
                        href="/cart"
                        className='flex items-center gap-2 px-[5px] pb-4 border-b border-[#e3e3e3]'
                        onClick={handleCloseClick}
                    >
                        <p
                            className="relative p-2 rounded-full
                        text-[#71BF45] bg-[#ffffff] shadow-[0px_4px_15.8px_0px_#0000000F_inset,4px_0px_15.8px_0px_#DADADA08_inset]"
                        >
                            <BsCart2 size={16} />
                            {totalCartProducts > 0 && (
                                <span className="absolute top-0 right-0 flex items-center justify-center">
                                    <span className="absolute inline-flex h-4 w-4 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                                        {totalCartProducts}
                                    </span>
                                </span>
                            )}
                        </p>
                        <p className='text-[#848484] font-medium text-sm'>Cart</p>
                    </Link>

                    {/* Wishlist icon with product count */}
                    <Link
                        href="/wishlist"
                        className='flex items-center gap-2 px-[5px] py-4 border-b border-[#e3e3e3]'
                        onClick={handleCloseClick}
                    >
                        <p
                            className="relative p-2 rounded-full
                                 text-[#71BF45] bg-[#ffffff] shadow-[0px_4px_15.8px_0px_#0000000F_inset,4px_0px_15.8px_0px_#DADADA08_inset]"
                        >
                            <BsSuitHeart size={16} />
                            {totalWishlistProducts > 0 && (
                                <span className="absolute top-0 right-0 flex items-center justify-center">
                                    <span className="absolute inline-flex h-4 w-4 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                                        {totalWishlistProducts}
                                    </span>
                                </span>
                            )}
                        </p>
                        <p className='text-[#848484] font-medium text-sm'>Wishlist</p>
                    </Link>

                    {/* Profile Button */}
                    <Link
                        className='flex items-center gap-2 px-[5px] py-4 border-b border-[#e3e3e3]'
                        href={isUser ? "/profile" : path}
                        onClick={handleCloseClick}
                    >
                        <div>
                            {/* Login based user profile */}
                            {myProfile?.img ?
                                <div className="relative size-8">
                                    <Image
                                        src={myProfile?.img}
                                        alt={myProfile?.fullName}
                                        fill
                                        className="rounded-full"
                                    />
                                </div>
                                : <div className='p-2 text-white bg-[#093C16] rounded-full'>
                                    <CgProfile size={16} />
                                </div>
                            }
                        </div>
                        {/* Login based text */}
                        <p className='text-[#848484] font-medium text-sm'>
                            {
                                myProfile?.fullName
                                    ? myProfile?.fullName
                                    : "Profile"
                            }
                        </p>
                    </Link>

                </section>

                {/* ORDERS AND RETURNS, LEGAL AND LOGOUT */}
                <section className='space-y-3'>
                    <div
                        className='border-b border-[#e3e3e3] px-2.5 pb-2.5 flex flex-col space-y-3'
                    >
                        <p className='text-black font-medium text-sm'>Orders & Returns</p>
                        <Link
                            href={
                                isUser
                                    ? `/profile?card=${encodeURIComponent("ordersAndReturns")}&activeSection=${encodeURIComponent("allOrders")}`
                                    : path
                            }
                            className='text-xs text-[#848484]'
                            onClick={handleCloseClick}
                        >
                            All Orders
                        </Link>
                        <Link
                            href={
                                isUser
                                    ? `/profile?card=${encodeURIComponent("ordersAndReturns")}&activeSection=${encodeURIComponent("trackOrders")}`
                                    : path
                            }
                            className='text-xs text-[#848484]'
                            onClick={handleCloseClick}
                        >
                            Track Orders
                        </Link>
                    </div>

                    <div
                        className='border-b border-[#e3e3e3] px-2.5 pb-2.5 flex flex-col space-y-3'
                    >
                        <p className='text-black font-medium text-sm'>Legal</p>
                        <Link
                            href="/termsAndCondition"
                            className='text-xs text-[#848484]'
                            onClick={handleCloseClick}
                        >
                            Terms of Use
                        </Link>
                        <Link
                            href="/legalAndPrivacyPolicy"
                            className='text-xs text-[#848484]'
                            onClick={handleCloseClick}
                        >
                            Privacy Policy
                        </Link>
                    </div>

                    <div className='border-b border-[#e3e3e3] py-2.5 space-y-4'>
                        {/* Settings Item */}
                        <Link href={isUser ? "/profile" : path} className="flex items-center gap-2.5 font-medium text-[#848484] text-sm">
                            <FaGear />
                            <p>Settings</p>
                        </Link>

                        {/* Help & Feedback Item with custom SVG */}
                        <div className="flex items-center gap-2.5 font-medium text-[#848484] text-sm">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 1.25C8.26941 1.25 6.57769 1.76318 5.13876 2.72464C3.69983 3.6861 2.57832 5.05267 1.91605 6.65152C1.25379 8.25037 1.08051 10.0097 1.41813 11.707C1.75575 13.4044 2.58911 14.9635 3.81282 16.1872C5.03653 17.4109 6.59563 18.2442 8.29296 18.5819C9.99029 18.9195 11.7496 18.7462 13.3485 18.0839C14.9473 17.4217 16.3139 16.3002 17.2754 14.8612C18.2368 13.4223 18.75 11.7306 18.75 10C18.75 7.67936 17.8281 5.45376 16.1872 3.81282C14.5462 2.17187 12.3206 1.25 10 1.25ZM10 17.5C8.51664 17.5 7.06659 17.0601 5.83322 16.236C4.59985 15.4119 3.63856 14.2406 3.0709 12.8701C2.50325 11.4997 2.35472 9.99168 2.64411 8.53682C2.9335 7.08197 3.64781 5.74559 4.6967 4.6967C5.74559 3.64781 7.08197 2.9335 8.53682 2.64411C9.99168 2.35472 11.4997 2.50325 12.8701 3.0709C14.2406 3.63856 15.4119 4.59985 16.236 5.83322C17.0601 7.06659 17.5 8.51664 17.5 10C17.5 11.9891 16.7098 13.8968 15.3033 15.3033C13.8968 16.7098 11.9891 17.5 10 17.5Z" fill="#848484" />
                                <path d="M10 15.625C10.5178 15.625 10.9375 15.2053 10.9375 14.6875C10.9375 14.1697 10.5178 13.75 10 13.75C9.48223 13.75 9.0625 14.1697 9.0625 14.6875C9.0625 15.2053 9.48223 15.625 10 15.625Z" fill="#848484" />
                                <path d="M10.625 5.00001H9.6875C9.31793 4.99918 8.95183 5.07137 8.61023 5.21242C8.26863 5.35347 7.95825 5.5606 7.69692 5.82193C7.4356 6.08326 7.22846 6.39364 7.08741 6.73524C6.94636 7.07684 6.87418 7.44293 6.875 7.81251V8.12501H8.125V7.81251C8.125 7.39811 8.28962 7.00068 8.58265 6.70765C8.87567 6.41463 9.2731 6.25001 9.6875 6.25001H10.625C11.0394 6.25001 11.4368 6.41463 11.7299 6.70765C12.0229 7.00068 12.1875 7.39811 12.1875 7.81251C12.1875 8.22691 12.0229 8.62434 11.7299 8.91736C11.4368 9.21039 11.0394 9.37501 10.625 9.37501H9.375V12.1875H10.625V10.625C11.3709 10.625 12.0863 10.3287 12.6137 9.80124C13.1412 9.2738 13.4375 8.55843 13.4375 7.81251C13.4375 7.06659 13.1412 6.35122 12.6137 5.82377C12.0863 5.29632 11.3709 5.00001 10.625 5.00001Z" fill="#848484" />
                            </svg>

                            <p>Help & Feedback</p>
                        </div>
                        <div
                            className="flex items-center gap-3 mt-4 text-[#093C16] cursor-pointer"
                            onClick={() => {
                                isUser ? handleLogout() : router.push(path)
                                handleCloseClick()
                            }}
                        >
                            <LuLogOut />
                            <p className="font-medium text-sm">{isUser ? "Sign out" : "Log in"}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Sidebar;
