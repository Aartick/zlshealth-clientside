'use client'

import { ChevronRight, CircleX } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface Category {
    name: string;
    href: string
}

interface SubPath {
    name: string;
    href: string;
    categories?: Category[]
}

interface LinkItem {
    name: string;
    href: string;
    subPaths?: SubPath[];
}

interface Props {
    links: LinkItem[];
    onClose: () => void;
}

function Sidebar({ links, onClose }: Props) {
    const pathname = usePathname();
    const [isClosing, setIsClosing] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
    const [openSubDropdowns, setOpenSubDropdowns] = useState<Record<string, boolean>>({});

    const handleCloseClick = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    const toggleDropdown = (name: string) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const toggleSubDropdown = (name: string) => {
        setOpenSubDropdowns(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };


    return (
        <div className="fixed inset-0 z-50 flex justify-start">
            {/* Overlay */}
            <div
                className={`fixed h-screen inset-0 bg-black transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-50"}`}
                onClick={handleCloseClick}
            ></div>

            {/* Sidebar */}
            <div
                className={`relative h-screen w-80 bg-[#093C16] text-white transition-transform duration-300 
          ${isClosing ? "sidebar-slide-out" : "sidebar-slide-in"}`}
            >
                {/* Header */}
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

                {/* Links */}
                <div className="flex flex-col gap-2 mt-2">
                    {links.map((link) => {
                        const isOpen = openDropdowns[link.name] || false;

                        if (link.subPaths && link.subPaths.length > 0) {
                            return (
                                <div key={link.name} className="m-2">
                                    {/* First-level Dropdown Trigger */}
                                    <div
                                        className={`flex items-center justify-between py-1 px-2 rounded border cursor-pointer
                                          ${isOpen
                                                ? "text-white border-white"
                                                : "text-white border-white"
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
                                            const isSubOpen = openSubDropdowns[subPath.name] || false;

                                            if (subPath.categories && subPath.categories.length > 0) {
                                                return (
                                                    <div key={subPath.name}>
                                                        {/* Second-level Dropdown Trigger */}
                                                        <div
                                                            className="flex items-center justify-between py-1 px-2 rounded cursor-pointer hover:bg-gray-200 text-white"
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
                                                                    className="block py-1 px-3 rounded hover:bg-gray-400 text-white text-sm"
                                                                >
                                                                    {cat.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={subPath.name}
                                                    href={subPath.href}
                                                    onClick={handleCloseClick}
                                                    className="block py-1 px-2 rounded hover:bg-gray-200 text-white"
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
                                        ? "text-white text-base border-white"
                                        : "text-white border-white"
                                    }`}
                                onClick={handleCloseClick}
                            >
                                {link.name}
                                <ChevronRight />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
