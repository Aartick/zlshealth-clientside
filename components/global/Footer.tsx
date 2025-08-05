import React from "react";
import { MdOutlineCall } from "react-icons/md";
import { LuInstagram } from "react-icons/lu";
import { GrFacebookOption } from "react-icons/gr";
import { BsLinkedin } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";

function Footer() {
    return (
        <div className="border-t border-[#000000] py-20 px-16">
            <div className="flex gap-[412px] bg-white">
                {/* LEFT PART */}
                <div className="space-y-6">
                    <Image src="/logo.png" width={165} height={85} alt="logo" />
                    <p className="text-[#36810B] text-xl font-medium italic">
                        Herbal Solutions For Your Health
                    </p>
                    <div className="text-xl text-nowrap">
                        <p>Sy.no.312, H.no.3-14/2, 2nd Floor Narsingi Village,</p>
                        <p> Rajendra Nagar Mandal Hyderabad - 500089</p>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="bg-[#093C16] p-[3px] rounded-[30px] text-white">
                            <MdOutlineCall size={12} />
                        </div>
                        <p className="font-medium text-xl text-[#333333]">+91 9705868032</p>
                    </div>
                </div>

                {/* RIGHT PART */}
                <div className="flex gap-10">
                    <div className="space-y-4">
                        <p className="font-medium text-base whitespace-nowrap">
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
                    <div className="space-y-4">
                        <p className="font-medium text-base whitespace-nowrap">
                            <span className="underline decoration-solid decoration-[#36810B] decoration-[11%] underline-offset-[50%]">
                                Connect Wi
                            </span>
                            th Us
                        </p>
                        <Link href="/" className="flex items-center gap-3">
                            <LuInstagram size={24} className="text-[#36810B]" />
                            <p>Instagram</p>
                        </Link>
                        <Link href="/" className="flex items-center gap-3">
                            <GrFacebookOption size={24} className="text-[#36810B]" />
                            <p>Facebook</p>
                        </Link>
                        <Link href="/" className="flex items-center gap-3">
                            <BsLinkedin size={24} className="text-[#36810B]" />
                            <p>LinkedIn</p>
                        </Link>
                    </div>
                </div>
            </div>

            <hr className="border-[#000000] my-8" />

            <div className="flex justify-between items-center">
                <p>
                    Copyrights © ZEALOUS HEALTH PRIVATE LIMITED | Powered by AfterMarkett
                </p>

                <div className="flex gap-6 items-center">
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
