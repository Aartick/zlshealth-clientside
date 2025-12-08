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
import { MdOutlineCall } from "react-icons/md";
import { LuInstagram } from "react-icons/lu";
import { GrFacebookOption } from "react-icons/gr";
import { BsLinkedin } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getItem, KEY_ACCESS_TOKEN } from "@/utils/localStorageManager";

function Footer() {
    // Get current route path
    const pathname = usePathname()
    const isUser = getItem(KEY_ACCESS_TOKEN)

    const currentPath = window.location.pathname + window.location.search;
    const path = `/login?redirect=${encodeURIComponent(currentPath)}`

    return (
        <footer
            className={`bg-gradient-to-b from-[#0A3C16] to-[#71BF45] text-white border-t border-white/10 p-4 
            sm:p-8 lg:py-16 lg:px-14
            ${pathname === "/science" && "hidden"}
            `}
        >
            {/* Main footer layout: left and right sections */}
            <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row 
            gap-6 md:gap-[50px] lg:justify-between"
            >
                {/* LEFT SECTION: Logo, tagline, address, contact */}
                <div className="space-y-5">
                    {/* Company logo */}
                    <div className="relative w-[120px] h-[60px] sm:w-[140px] sm:h-[70px] md:w-[165px] md:h-[85px]">
                        <Image src="/logo.png" fill alt="logo" />
                    </div>
                    {/* Tagline text -> changes color based no route*/}
                    <p className="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg font-medium italic"
                    >
                        Herbal Solutions For Your Health
                    </p>
                    {/* Company Address */}
                    <div className="text-xs sm:text-sm md:text-base lg:text-lg text-nowrap text-white/80">
                        <p>Sy.no.312, H.no.3-14/2, 2nd Floor Narsingi Village,</p>
                        <p>Rajendra Nagar Mandal Hyderabad - 500089</p>
                    </div>
                    {/* Contact number with phone icon -> changes color based on route */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="bg-white/10 p-1.5 rounded-full text-white">
                            <MdOutlineCall size={14} />
                        </div>
                        <a
                            href="tel:+919705868032"
                            className="font-medium text-xs sm:text-sm md:text-base lg:text-lg text-white"
                        >
                            +91 9705868032
                        </a>
                    </div>
                </div>

                {/* RIGHT SECTION: Quick links and social media */}
                <div className="flex gap-10">
                    {/* Quick Links section */}
                    <div className="space-y-3 text-xs sm:text-sm md:text-base text-white">
                        <p className="font-medium whitespace-nowrap text-white">
                            <span className="underline decoration-solid decoration-[#36810B]
                             decoration-[11%] underline-offset-[50%]"
                            >
                                Quick L
                            </span>
                            inks
                        </p>
                        <Link
                            href={isUser ? `/profile?card=${encodeURIComponent("ordersAndReturns")}&activeSection=${encodeURIComponent("trackOrders")}` : path}
                            className="flex whitespace-nowrap text-white/90"
                        >
                            Track Your Order
                        </Link>
                        <Link href="/cancellationAndRefund" className="flex whitespace-nowrap text-white/90">
                            Cancellation & Refund
                        </Link>
                        <Link href="/termsAndCondition" className="flex whitespace-nowrap text-white/90">Terms & Conditions</Link>
                        <Link href="/aboutUs" className="flex whitespace-nowrap text-white/90">About Us</Link>
                        <Link href="/contactUs" className="flex whitespace-nowrap text-white/90">Contact Us</Link>
                    </div>

                    {/* Social Media section */}
                    <div className="space-y-3 text-xs sm:text-sm md:text-base text-white">
                        <p className="font-medium whitespace-nowrap text-white">
                            <span className="underline decoration-solid 
                            decoration-[#36810B] decoration-[11%] underline-offset-[50%]"
                            >
                                Connect Wi
                            </span>
                            th Us
                        </p>

                        {/* Instagram */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 text-white/90">
                            <LuInstagram className="text-[#70bf44] sm:text-2xl"
                            />
                            <p>Instagram</p>
                        </Link>

                        {/* Facebook */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 text-white/90">
                            <GrFacebookOption className="text-[#70bf44] sm:text-2xl"
                            />
                            <p>Facebook</p>
                        </Link>

                        {/* LinkedIn */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 text-white/90"
                        >
                            <BsLinkedin className="text-[#70bf44] sm:text-2xl"
                            />
                            <p>LinkedIn</p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Divider line (changes color by route) */}
            <hr className="border-white/25 my-4 sm:my-8"
            />

            {/* BOTTOM SECTION: Copyright and legal links */}
            <div className="max-w-screen-2xl mx-auto
                    flex flex-col lg:flex-row 
                    gap-2 lg:justify-between items-center"
            >
                {/* Copyright text */}
                <p className="text-center md:text-left text-[11px] sm:text-xs lg:text-sm text-white/80">
                    Copyrights © ZEALOUS HEALTH PRIVATE LIMITED | Powered by AfterMarkett
                </p>

                {/* Legal links */}
                <div className="flex gap-12 sm:gap-6 items-center text-[11px] sm:text-xs lg:text-sm text-white">
                    <Link href="/legalAndPrivacyPolicy">
                        <p className="underline decoration-solid">Privacy Policy</p>
                    </Link>
                    <Link href="/termsAndCondition">
                        <p className="underline decoration-solid">Terms of Use</p>
                    </Link>
                    <Link href="/">
                        <p className="underline decoration-solid">Cookie Settings</p>
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
