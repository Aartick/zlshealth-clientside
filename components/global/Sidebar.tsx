/**
 * Sidebar Component
 * 
 * This component renders a slide-in sidebar navigation for mobile and small screens.
 * It displays navigation links, including multi-level dropdowns for categories and subcategories.
 * The sidebar includes the company logo and a close button, and overlays the main content.
 * Dropdowns can be expanded/collapsed, and clicking a link or the overlay closes the sidebar.
 */

'use client'

import { axiosClient } from '@/utils/axiosClient';
import { getItem, KEY_ACCESS_TOKEN, removeItem } from '@/utils/localStorageManager';
// Import required modules and components
import { ChevronRight, CircleX } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { signOut } from "next-auth/react";

// Category interface for third-level navigation
interface Category {
    name: string;
    href: string
}

// SubPath interface for second-level navigation
interface SubPath {
    name: string;
    href: string;
    categories?: Category[]
}

// LinkItem interface for top-level navigation
interface LinkItem {
    name: string;
    href: string;
    subPaths?: SubPath[];
}

// Props for Sidebar component
interface Props {
    links: LinkItem[];
    onClose: () => void;
}

function Sidebar({ links, onClose }: Props) {
    // Get current pathname for active link highlighting
    const pathname = usePathname();
    // State for sidebar closing animation
    const [isClosing, setIsClosing] = useState(false);
    // State for open/closed first-level dropdowns
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
    // State for open/closed second-level dropdowns
    const [openSubDropdowns, setOpenSubDropdowns] = useState<Record<string, boolean>>({});

    // Handle sidebar close with animation
    const handleCloseClick = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    // Toggle first-level dropdown open/close
    const toggleDropdown = (name: string) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    // Toggle second-level dropdown open/close
    const toggleSubDropdown = (name: string) => {
        setOpenSubDropdowns(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
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
                signOut({ redirect: false })
                toast.success(response.data.result)
            }
        } catch { }
    }


    return (
        <div className="fixed inset-0 z-50 flex justify-start">
            {/* Overlay: closes sidebar when clicked */}
            <div
                className={`fixed h-screen inset-0 bg-black transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-50"}`}
                onClick={handleCloseClick}
            ></div>

            {/* Sidebar panel */}
            <div
                className={`relative h-screen w-80 bg-gradient-to-b from-[#FBFFF9] to-[#79D347] text-[#355920] transition-transform duration-300 
          ${isClosing ? "sidebar-slide-out" : "sidebar-slide-in"}`}
            >
                {/* Header: logo and close button */}
                <div className="flex justify-between items-center m-2">
                    <Link href="/">
                        <div className="relative size-11 md:size-14 rounded-full cursor-pointer">
                            <Image
                                src="/logo.png"
                                alt="logo"
                                className="w-[68px] h-[37px] sm:w-[85px] sm:h-[47px] object-contain"
                                fill
                            />
                        </div>
                    </Link>
                    <CircleX
                        className="text-2xl cursor-pointer"
                        onClick={handleCloseClick}
                    />
                </div>

                {/* Navigation links */}
                <div className="flex flex-col gap-2 mt-2">
                    {links.map((link) => {
                        // Check if link has dropdown subPaths
                        const isOpen = openDropdowns[link.name] || false;

                        if (link.subPaths && link.subPaths.length > 0) {
                            return (
                                <div key={link.name} className="m-2">
                                    {/* First-level Dropdown Trigger */}
                                    <div
                                        className={`flex items-center justify-between py-1 px-2 rounded border cursor-pointer
                                          ${isOpen
                                                ? "text-[#71BF45] border-[#71BF45]"
                                                : "text-[#71BF45] border-[#71BF45]"
                                            }`}
                                        onClick={() => toggleDropdown(link.name)}
                                    >
                                        <span>{link.name}</span>
                                        <ChevronRight
                                            className={`transform transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                                        />
                                    </div>

                                    {/* First-level Dropdown Content */}
                                    <div className={`transition-all duration-300 overflow-hidden ml-4 space-y-2 ${isOpen ? "max-h-96 mt-2" : "max-h-0"}`}>
                                        {link.subPaths.map((subPath) => {
                                            // Check if subPath has categories (third-level dropdown)
                                            const isSubOpen = openSubDropdowns[subPath.name] || false;

                                            if (subPath.categories && subPath.categories.length > 0) {
                                                return (
                                                    <div key={subPath.name}>
                                                        {/* Second-level Dropdown Trigger */}
                                                        <div
                                                            className="flex items-center justify-between py-1 px-2 rounded cursor-pointer hover:bg-gray-200 text-[#71BF45]"
                                                            onClick={() => toggleSubDropdown(subPath.name)}
                                                        >
                                                            <span>{subPath.name}</span>
                                                            <ChevronRight
                                                                className={`transform transition-transform duration-300 ${isSubOpen ? "rotate-90" : ""}`}
                                                            />
                                                        </div>

                                                        {/* Third-level Dropdown Content */}
                                                        <div className={`transition-all duration-300 overflow-hidden ml-4 space-y-2 ${isSubOpen ? "max-h-96 mt-2" : "max-h-0"}`}>
                                                            {subPath.categories.map((cat) => (
                                                                <Link
                                                                    key={cat.name}
                                                                    href={cat.href}
                                                                    onClick={handleCloseClick}
                                                                    className="block py-1 px-3 rounded hover:bg-gray-400 text-[#71BF45] text-sm"
                                                                >
                                                                    {cat.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // Second-level link (no categories)
                                            return (
                                                <Link
                                                    key={subPath.name}
                                                    href={subPath.href}
                                                    onClick={handleCloseClick}
                                                    className="block py-1 px-2 rounded hover:bg-gray-200 text-[#71BF45]"
                                                >
                                                    {subPath.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }

                        // Single-level link
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center justify-between m-2 py-1 px-2 rounded border
                                  ${pathname === link.href
                                        ? "text-[#355920] text-base border-[#355920]"
                                        : "text-[#355920] border-[#355920]"
                                    }`}
                                onClick={handleCloseClick}
                            >
                                {link.name}
                                <ChevronRight />
                            </Link>
                        );
                    })}

                    <Link
                        className={`flex items-center justify-between py-1 px-2 m-2 rounded border cursor-pointer text-[#355920] border-[#355920]
                            }`}
                        href="/cart"
                        onClick={handleCloseClick}
                    >
                        <span>Cart</span>
                        <ChevronRight
                            className={`transform transition-transform duration-300`}
                        />
                    </Link>

                    <Link
                        className={`flex items-center justify-between py-1 px-2 m-2 rounded border cursor-pointer text-[#355920] border-[#355920]
                            }`}
                        href="/wishlist"
                        onClick={handleCloseClick}
                    >
                        <span>Wishlist</span>
                        <ChevronRight
                            className={`transform transition-transform duration-300`}
                        />
                    </Link>

                    <Link
                        className={`flex items-center gap-2 py-1 px-2 m-2 rounded cursor-pointer
                            ${isUser ? "text-red-500" : "text-[#355920]"}
                            }`}
                        href={isUser ? "" : path}
                        onClick={() => {
                            handleCloseClick()
                            handleLogout()
                        }}
                    >
                        <span>{isUser ? "Logout" : "Login"}</span>
                        <ChevronRight
                            className={`transform transition-transform duration-300`}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
