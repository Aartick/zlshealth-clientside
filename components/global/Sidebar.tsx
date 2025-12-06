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
import { getItem, KEY_ACCESS_TOKEN, MERGE_DONE_KEY, removeItem, setItem } from '@/utils/localStorageManager';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { BsCart2, BsSuitHeart } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { UserDetails } from '@/interfaces/user';
import { LuLogOut } from 'react-icons/lu';
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
                setItem(MERGE_DONE_KEY, "false")
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

                    <div className='border-b border-[#e3e3e3] px-2.5 pb-2.5'>
                        <div
                            className="flex items-center gap-3 text-[#093C16] cursor-pointer"
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
