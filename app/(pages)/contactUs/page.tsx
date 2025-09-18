"use client"

import Image from 'next/image'
import React from 'react'
import { MdOutlineMail, MdOutlineCall, MdApartment } from "react-icons/md";

function page() {
    const handleSubmit = () => { }
    return (
        <div className="flex flex-col items-center justify-center pt-5 pb-10 px-5 lg:px-2 space-y-[30px]">

            {/* Header + Image */}
            <div className='space-y-3 lg:pb-5 text-center max-w-3xl'>
                <p className="font-bold text-[40px] text-[#093C16]">Contact Us</p>
                <p className='px-[30px] lg:px-[60px]'>
                    At Zealous Health, we create nutraceutical solutions that bridge the gap between tradition and innovation
                    — so wellness becomes simple, safe, and effective for everyone.
                </p>

                {/* Image */}
                <div className="relative w-full max-w-[898px] h-[400px] sm:h-[617px] mx-auto">
                    <Image
                        src="/contactUs/ContactUs.jpg"
                        fill
                        alt='contact-us'
                        className='rounded-[20px] object-cover'
                    />
                </div>
            </div>

            {/* Contact Info + Form */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-20 w-full max-w-[1320px]">
                <div className="space-y-[40px] text-center lg:text-left">
                    <div className="space-y-3">
                        <p className="font-medium text-2xl text-[#093C16]">
                            Questions, feedback, or partnership inquiries?
                        </p>
                        <p className="font-medium text-[#71BF45]">
                            Reach out and our team will get back to you shortly.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-[5px] rounded-[30px] bg-[#093C16] text-white">
                                <MdOutlineMail size={24} />
                            </div>
                            <p>example@gmail.com</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-[5px] rounded-[30px] bg-[#093C16] text-white">
                                <MdOutlineCall size={24} />
                            </div>
                            <p>+91 9123456789</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-[5px] rounded-[30px] bg-[#093C16] text-white">
                                <MdOutlineCall size={24} />
                            </div>
                            <p>Address</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-[5px] rounded-[30px] bg-[#093C16] text-white">
                                <MdApartment size={24} />
                            </div>
                            <p>Office Address</p>
                        </div>
                    </div>
                </div>

                {/* Right Form */}
                <form onSubmit={handleSubmit} className="space-y-3 rounded-[40px] p-6 w-full max-w-[568px] bg-gradient-to-b from-[#FBFFF9] to-[#79D347] border border-[#71BF45]">
                    <div className="flex flex-col space-y-2.5">
                        <label htmlFor="fullName" className='pl-2.5 font-medium'>Full Name*</label>
                        <input
                            type="text"
                            id="fullName"
                            placeholder='John Smith'
                            required
                            className='border border-[#CDCDCD] text-[#BCBCBC] bg-white rounded-[10px] p-2.5 focus:outline-none'
                        />
                    </div>

                    <div className="flex flex-col space-y-2.5">
                        <label htmlFor="emailAddress" className='pl-2.5 font-medium'>Email Address*</label>
                        <input
                            type="email"
                            id="emailAddress"
                            placeholder='johnsmith@gmail.com'
                            required
                            className='border border-[#CDCDCD] text-[#BCBCBC] bg-white rounded-[10px] p-2.5 focus:outline-none'
                        />
                    </div>

                    <div className="flex flex-col space-y-2.5">
                        <label htmlFor="phone" className='pl-2.5 font-medium'>Phone Number*</label>
                        <input
                            type="phone"
                            id="phone"
                            placeholder='9123456789'
                            required
                            className='border border-[#CDCDCD] text-[#BCBCBC] bg-white rounded-[10px] p-2.5 focus:outline-none'
                        />
                    </div>

                    <div className="flex flex-col space-y-2.5">
                        <label htmlFor="message" className='pl-2.5 font-medium'>Message/Inquiry Details*</label>
                        <textarea
                            id="message"
                            placeholder='Write your message...'
                            required
                            className='border border-[#CDCDCD] text-[#BCBCBC] bg-white h-[167px] rounded-[10px] p-2.5 focus:outline-none'
                        />
                    </div>

                    <input
                        type="submit"
                        value="Submit"
                        className='bg-[#093C16] rounded-lg p-2.5 text-white w-full font-semibold
                                    transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-[#0d4f20] cursor-pointer'
                    />
                </form>
            </div>
        </div>
    )
}

export default page