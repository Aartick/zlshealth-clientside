/**
 * Footer Component
 * 
 * This component renders the footer section of the website.
 * It displays company information, address, contact details,
 * quick links, and social media links.
 * The footer also includes copyright and legal links at the bottom.
 */

// Import required modules and components
"use client"
import React from "react";
import { MdOutlineCall } from "react-icons/md";
import { LuInstagram } from "react-icons/lu";
import { GrFacebookOption } from "react-icons/gr";
import { BsLinkedin } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function Footer() {
    const pathname = usePathname()
    return (
        <div className={`${pathname === "/"
            ? "bg-gradient-to-b from-[#093C16] to-[#71BF45] text-white"
            : "bg-white text-black"} border-t border-[#000000] p-5 
            sm:p-10 lg:py-20 lg:px-16`
        }
        >
            {/* Main footer layout: left and right sections */}
            <div className="container mx-auto flex flex-col lg:flex-row 
            gap-6 md:gap-[50px] lg:justify-between"
            >
                {/* LEFT PART: Logo, tagline, address, contact */}
                <div className="space-y-6">
                    {/* Company logo */}
                    <div className="relative w-[120px] h-[60px] sm:w-[140px] sm:h-[70px] md:w-[165px] md:h-[85px]">
                        <Image src="/logo.png" fill alt="logo" />
                    </div>
                    {/* Tagline */}
                    <p className={`${pathname === "/"
                        ? "text-[#71BF45]" : "text-[#36810B]"}
                         text-sm sm:text-base md:text-lg lg:text-xl font-medium italic`}
                    >
                        Herbal Solutions For Your Health
                    </p>
                    {/* Address */}
                    <div className="text-sm sm:text-base md:text-lg lg::text-xl text-nowrap">
                        <p >Sy.no.312, H.no.3-14/2, 2nd Floor Narsingi Village,</p>
                        <p> Rajendra Nagar Mandal Hyderabad - 500089</p>
                    </div>
                    {/* Contact number */}
                    <div className="flex items-center gap-1.5 sm:gap-5">
                        <div className="bg-[#093C16] p-[3px] rounded-full text-white">
                            <MdOutlineCall size={12} />
                        </div>
                        <a
                            href="tel:+919705868032"
                            className={`font-medium text-sm sm:text-base md:text-lg: lg:text-xl 
                         ${pathname === "/" ? "text-white"
                                    : "text-[#333333]"}`}
                        >
                            +91 9705868032
                        </a>
                    </div>
                </div>

                {/* RIGHT PART: Quick links and social media */}
                <div className="flex gap-10">
                    {/* Quick Links section */}
                    <div className="space-y-4 text-xs sm:text-sm md:text-base">
                        <p className="font-medium whitespace-nowrap">
                            <span className="underline decoration-solid decoration-[#36810B]
                             decoration-[11%] underline-offset-[50%]"
                            >
                                Quick L
                            </span>
                            inks
                        </p>
                        <Link href="/profile" className="flex whitespace-nowrap">Track Your Order</Link>
                        <Link href="/profile" className="flex whitespace-nowrap">
                            Cancellation & Refund
                        </Link>
                        <Link href="/" className="flex whitespace-nowrap">Terms & Conditions</Link>
                        <Link href="/aboutUs" className="flex whitespace-nowrap">About Us</Link>
                        <Link href="/contactUs" className="flex whitespace-nowrap">Contact Us</Link>
                    </div>

                    {/* Social Media section */}
                    <div className="space-y-4 text-xs sm:text-sm md:text-base">
                        <p className="font-medium whitespace-nowrap">
                            <span className="underline decoration-solid 
                            decoration-[#36810B] decoration-[11%] underline-offset-[50%]"
                            >
                                Connect Wi
                            </span>
                            th Us
                        </p>
                        <Link
                            href="/"
                            className="flex items-center gap-3">
                            <LuInstagram className={`${pathname === "/"
                                ? "text-[#71BF45]" : "text-[#36810B]"}
                                 sm:text-2xl`
                            }
                            />
                            <p>Instagram</p>
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-3">
                            <GrFacebookOption className={`${pathname === "/"
                                ? "text-[#71BF45]" : "text-[#36810B]"} 
                                 sm:text-2xl`
                            }
                            />
                            <p>Facebook</p>
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-3"
                        >
                            <BsLinkedin className={`${pathname === "/"
                                ? "text-[#71BF45]" : "text-[#36810B]"} 
                                sm:text-2xl`
                            }
                            />
                            <p>LinkedIn</p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Divider line */}
            <hr className={`${pathname === "/"
                ? "border-[#CDC9C9]"
                : "border-black"} 
                my-4 sm:my-8`
            }
            />

            {/* BOTTOM PART: Copyright and legal links */}
            <div className="container mx-auto
                    flex flex-col lg:flex-row 
                    gap-2 lg:justify-between items-center"
            >
                {/* Copyright text */}
                <p className="text-center md:text-left text-xs sm:text-sm lg:text-base">
                    Copyrights © ZEALOUS HEALTH PRIVATE LIMITED | Powered by AfterMarkett
                </p>

                {/* Legal links */}
                <div className="flex gap-12 sm:gap-6 items-center text-xs sm:text-sm lg:text-base">
                    <Link href="/">
                        <p className="underline decoration-solid">Privacy Policy</p>
                    </Link>
                    <Link href="/">
                        <p className="underline decoration-solid">Terms of Use</p>
                    </Link>
                    <Link href="/">
                        <p className="underline decoration-solid">Cookie Settings</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Footer;
