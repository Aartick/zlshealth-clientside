import React from "react";
import { MdOutlineCall } from "react-icons/md";
import { LuInstagram } from "react-icons/lu";
import { GrFacebookOption } from "react-icons/gr";
import { BsLinkedin } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";

function Footer() {
    return (
        <div className="border-t border-[#000000] p-5 sm:py-20 sm:px-16">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-[50px] lg:gap-[412px] bg-white">
                {/* LEFT PART */}
                <div className="space-y-6">
                    <Image src="/logo.png" width={165} height={85} alt="logo" />
                    <p className="text-[#36810B] sm:text-xl font-medium italic">
                        Herbal Solutions For Your Health
                    </p>
                    <div className="text-sm sm:text-xl text-nowrap">
                        <p >Sy.no.312, H.no.3-14/2, 2nd Floor Narsingi Village,</p>
                        <p> Rajendra Nagar Mandal Hyderabad - 500089</p>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-5">
                        <div className="bg-[#093C16] p-[3px] rounded-[30px] text-white">
                            <MdOutlineCall size={12} />
                        </div>
                        <p className="font-medium sm:text-xl text-[#333333]">+91 9705868032</p>
                    </div>
                </div>

                {/* RIGHT PART */}
                <div className="flex gap-10">
                    <div className="space-y-4 text-sm sm:text-base">
                        <p className="font-medium whitespace-nowrap">
                            <span className="underline decoration-solid decoration-[#36810B] decoration-[11%] underline-offset-[50%]">
                                Quick L
                            </span>
                            inks
                        </p>
                        <Link href="/" className="flex whitespace-nowrap">Track Your Order</Link>
                        <Link href="/" className="flex whitespace-nowrap">
                            Cancellation & Refund
                        </Link>
                        <Link href="/" className="flex whitespace-nowrap">Terms & Conditions</Link>
                        <Link href="/" className="flex whitespace-nowrap">About Us</Link>
                        <Link href="/" className="flex whitespace-nowrap">Contact Us</Link>
                    </div>
                    <div className="space-y-4 text-sm sm:text-base">
                        <p className="font-medium whitespace-nowrap">
                            <span className="underline decoration-solid decoration-[#36810B] decoration-[11%] underline-offset-[50%]">
                                Connect Wi
                            </span>
                            th Us
                        </p>
                        <Link href="/" className="flex items-center gap-3">
                            <LuInstagram className="text-[#36810B] sm:text-2xl" />
                            <p>Instagram</p>
                        </Link>
                        <Link href="/" className="flex items-center gap-3">
                            <GrFacebookOption className="text-[#36810B] sm:text-2xl" />
                            <p>Facebook</p>
                        </Link>
                        <Link href="/" className="flex items-center gap-3">
                            <BsLinkedin className="text-[#36810B] sm:text-2xl" />
                            <p>LinkedIn</p>
                        </Link>
                    </div>
                </div>
            </div>

            <hr className="border-[#000000] my-4 sm:my-8" />

            {/* BOTTOM PART */}
            <div className="flex flex-col md:flex-row gap-2 md:justify-between items-center">
                <p className="text-sm sm:text-base">
                    Copyrights © ZEALOUS HEALTH PRIVATE LIMITED | Powered by AfterMarkett
                </p>

                <div className="flex gap-12 sm:gap-6 items-center text-xs sm:text-base">
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
