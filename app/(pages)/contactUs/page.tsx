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
                                <svg width="24" height="24" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.5 19.5C4.81033 19.5 3.42958 19.2575 2.35775 18.7725C1.28592 18.2875 0.75 17.6614 0.75 16.8943C0.75 16.5391 0.883667 16.2051 1.151 15.8923C1.41833 15.5794 1.78792 15.3108 2.25975 15.0865L3.4405 16.1578C3.22633 16.2436 3.00125 16.3506 2.76525 16.4788C2.52942 16.6071 2.36792 16.7423 2.28075 16.8845C2.44608 17.1833 2.93808 17.4439 3.75675 17.6663C4.57525 17.8888 5.48808 18 6.49525 18C7.50225 18 8.41925 17.8888 9.24625 17.6663C10.0731 17.4439 10.5693 17.1833 10.7348 16.8845C10.6501 16.732 10.4793 16.5917 10.2223 16.4635C9.96508 16.3353 9.72117 16.2283 9.4905 16.1423L10.6557 15.0557C11.1672 15.2904 11.5608 15.5642 11.8365 15.877C12.1122 16.1898 12.25 16.5275 12.25 16.89C12.25 17.6585 11.7141 18.2856 10.6423 18.7712C9.57042 19.2571 8.18967 19.5 6.5 19.5ZM6.525 14.625C8.18133 13.3698 9.42458 12.1266 10.2548 10.8953C11.0849 9.66375 11.5 8.441 11.5 7.227C11.5 5.5015 10.9599 4.199 9.87975 3.3195C8.79958 2.43983 7.67458 2 6.50475 2C5.33492 2 4.20833 2.44008 3.125 3.32025C2.04167 4.20025 1.5 5.50342 1.5 7.22975C1.5 8.36375 1.90992 9.53975 2.72975 10.7578C3.54958 11.9758 4.81467 13.2648 6.525 14.625ZM6.5 16.5C4.31783 14.8685 2.689 13.284 1.6135 11.7465C0.537833 10.2092 0 8.70317 0 7.2285C0 6.11467 0.1965 5.13917 0.5895 4.302C0.9825 3.46483 1.48983 2.76383 2.1115 2.199C2.73333 1.63433 3.431 1.21 4.2045 0.925999C4.97783 0.641999 5.7435 0.5 6.5015 0.5C7.2595 0.5 8.02467 0.641999 8.797 0.925999C9.5695 1.21 10.2667 1.63433 10.8885 2.199C11.5102 2.76383 12.0175 3.46508 12.4105 4.30275C12.8035 5.14042 13 6.11517 13 7.227C13 8.70183 12.4622 10.2081 11.3865 11.7457C10.311 13.2834 8.68217 14.8682 6.5 16.5ZM6.50475 8.89425C7.00025 8.89425 7.42458 8.71925 7.77775 8.36925C8.13108 8.01925 8.30775 7.59325 8.30775 7.09125C8.30775 6.58942 8.13075 6.16192 7.77675 5.80875C7.42275 5.45542 6.99717 5.27875 6.5 5.27875C6.00767 5.27875 5.58333 5.45575 5.227 5.80975C4.8705 6.16392 4.69225 6.5895 4.69225 7.0865C4.69225 7.59167 4.8705 8.01925 5.227 8.36925C5.58333 8.71925 6.00925 8.89425 6.50475 8.89425Z" fill="white" />
                                </svg>
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