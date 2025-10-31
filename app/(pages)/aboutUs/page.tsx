/**
 * 
 * This page tells the story of Zealous Health by blending visuals, animations,
 * and descriptive text. It includes:
 * - A hero section with headline and image.
 * - Auto-scroll image carousel for brand visuals.
 * - Our story with decorative leaves.
 * - Our Promise highlighting purity and quality.
 * - Our Values (icons for ingredients, testing, payment, delivery).
 * - Our Team section introducing the experts.
 * 
 */

"use client"

import Image from 'next/image'
import React from 'react'

const imgs = [
    "/aboutUs/2.png",
    "/aboutUs/3.png",
    "/aboutUs/2.png",
    "/aboutUs/3.png",
    "/aboutUs/2.png",
    "/aboutUs/3.png"
]

function page() {
    const horizontalScroll = [...imgs, ...imgs]

    return (
        <div className='space-y-[30px] container mx-auto'>
            {/* Header + Image */}
            <div className='flex flex-col items-center text-center pb-5 px-5 sm:px-0 space-y-3'>
                <p className="font-bold text-3xl md:text-[40px] text-[#093C16] max-w-[658px]">
                    Blending Ancient Herbal Wisdom with Modern Science
                </p>
                <p className='max-w-[908px]'>
                    At Zealous Health, we create nutraceutical solutions that bridge
                    the gap between tradition and innovation so wellness becomes
                    simple, safe, and effective for everyone.
                </p>

                {/* Hero Image */}
                <div className="relative w-full max-w-[1054px] h-[400px] sm:h-[502px] mx-auto">
                    <Image
                        src="/aboutUs/1.jpg"
                        fill
                        alt='contact-us'
                        className='rounded-[20px] object-cover'
                    />
                </div>
            </div>

            {/* ================ IMAGE CAROUSEL ================ */}
            <div className="relative overflow-hidden container mx-auto">
                <div className="flex gap-4 animate-scroll-left">
                    {/* Duplicate images for infinite scroll */}
                    {horizontalScroll.map((data, idx) => (
                        <div key={idx} className="relative w-[200px] h-[200px] shrink-0">
                            <Image
                                src={data}
                                alt={`image-${idx}`}
                                fill
                                className='rounded-[20px] object-cover'
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* ================ OUR STORY ================ */}
            <div className="flex items-center h-[292px] bg-gradient-to-b from-white to-[#79D347] text-center container ">
                {/* Decorative Leaves */}
                <div className='w-16 sm:w-24 md:w-40 lg:w-[327px] lg:h-[511px] flex-shrink-0'>
                    <svg className='w-full h-auto' viewBox="0 0 327 511" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M126.364 182.023C128.982 194.025 120.23 206.123 120.23 206.123C120.23 206.123 107.248 198.76 104.63 186.758C102.015 174.751 110.764 162.657 110.764 162.657C110.764 162.657 123.752 170.031 126.364 182.023Z" fill="#B1CC33" />
                        <path d="M44.6853 350.675C20.9696 343.672 10.0252 316.768 10.0252 316.768C10.0252 316.768 37.537 301.23 61.2556 308.23C84.9742 315.229 95.9228 342.136 95.9228 342.136C95.9228 342.136 68.3926 357.673 44.6853 350.675Z" fill="#5C9E31" />
                        <path d="M127.622 291.566C109.149 285.543 101.145 264.17 101.145 264.17C101.145 264.17 123.097 252.573 141.57 258.597C160.043 264.621 168.05 285.989 168.05 285.989C168.05 285.989 146.089 297.58 127.622 291.566Z" fill="#B1CC33" />
                        <path d="M44.5039 213.48C50.9868 232.065 39.4218 253.009 39.4218 253.009C39.4218 253.009 17.3398 243.81 10.8499 225.226C4.35991 206.643 15.9263 185.706 15.9263 185.706C15.9263 185.706 38.0153 194.904 44.5039 213.48Z" fill="#5C9E31" />
                        <path d="M117.297 223.429C103.613 243.656 76.2601 257.746 59.0037 265.066C51.9635 268.047 44.6953 270.363 37.3367 272.438C17.6894 277.992 -8.31404 292.267 -24.5277 328.53M126.364 182.023C128.982 194.025 120.23 206.123 120.23 206.123C120.23 206.123 107.248 198.76 104.63 186.758C102.015 174.751 110.764 162.658 110.764 162.658C110.764 162.658 123.752 170.031 126.364 182.023ZM44.504 213.48C50.9868 232.065 39.4218 253.009 39.4218 253.009C39.4218 253.009 17.3399 243.81 10.8499 225.226C4.35995 206.643 15.9263 185.706 15.9263 185.706C15.9263 185.706 38.0154 194.904 44.504 213.48ZM44.6853 350.675C20.9696 343.672 10.0252 316.768 10.0252 316.768C10.0252 316.768 37.537 301.231 61.2556 308.23C84.9743 315.229 95.9229 342.136 95.9229 342.136C95.9229 342.136 68.3926 357.673 44.6853 350.675ZM127.622 291.566C109.149 285.543 101.145 264.17 101.145 264.17C101.145 264.17 123.097 252.573 141.57 258.597C160.043 264.621 168.05 285.989 168.05 285.989C168.05 285.989 146.089 297.58 127.622 291.566Z" stroke="black" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-lg sm:text-xl md:text-2xl text-[#093C16]">
                        Our Story
                    </p>
                    <p className="text-xs sm:text-sm md:text-base leading-relaxed">
                        Zealous Health was founded with a simple belief — health should be holistic,
                        accessible, and science-backed. In a world flooded with pharmaceuticals and
                        synthetic quick fixes, we wanted to bring back the purity of nature, enhanced
                        with cutting-edge research. From our first formulation to today, our journey
                        is fueled by one mission to restore balance and vitality in everyday life.
                    </p>
                </div>
                {/* Decorative Leaves */}
                <div className='w-16 sm:w-24 md:w-40 lg:w-[335px] lg:h-[518px] flex-shrink-0'>
                    <svg className='w-full h-auto' viewBox="0 0 335 518" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M184.1 312.104C185.21 299.869 197.193 290.961 197.193 290.961C197.193 290.961 207.363 301.885 206.252 314.119C205.138 326.356 193.159 335.262 193.159 335.262C193.159 335.262 182.987 324.326 184.1 312.104Z" fill="#B1CC33" />
                        <path d="M312.686 175.793C333.201 189.6 335.554 218.549 335.554 218.549C335.554 218.549 304.645 225.101 284.126 211.297C263.608 197.493 261.251 168.54 261.251 168.54C261.251 168.54 292.178 161.994 312.686 175.793Z" fill="#5C9E31" />
                        <path d="M215.821 207.246C231.629 218.543 232.84 241.332 232.84 241.332C232.84 241.332 208.417 245.796 192.609 234.499C176.8 223.202 175.585 200.416 175.585 200.416C175.585 200.416 200.014 195.96 215.821 207.246Z" fill="#B1CC33" />
                        <path d="M271.629 306.701C271.031 287.027 288.356 270.526 288.356 270.526C288.356 270.526 306.653 285.937 307.258 305.611C307.863 325.286 290.539 341.78 290.539 341.78C290.539 341.78 272.235 326.369 271.629 306.701Z" fill="#5C9E31" />
                        <path d="M205.191 275.336C224.321 260.156 254.644 254.938 273.303 253.143C280.913 252.414 288.541 252.39 296.183 252.623C316.592 253.23 345.683 247.429 372.045 217.715M184.1 312.103C185.21 299.869 197.193 290.961 197.193 290.961C197.193 290.961 207.362 301.885 206.252 314.119C205.138 326.356 193.159 335.262 193.159 335.262C193.159 335.262 182.987 324.326 184.1 312.103ZM271.629 306.701C271.031 287.027 288.356 270.526 288.356 270.526C288.356 270.526 306.653 285.937 307.258 305.611C307.863 325.286 290.539 341.78 290.539 341.78C290.539 341.78 272.235 326.369 271.629 306.701ZM312.687 175.793C333.201 189.6 335.555 218.549 335.555 218.549C335.555 218.549 304.645 225.101 284.126 211.297C263.608 197.493 261.251 168.54 261.251 168.54C261.251 168.54 292.178 161.994 312.687 175.793ZM215.821 207.245C231.629 218.542 232.84 241.332 232.84 241.332C232.84 241.332 208.417 245.796 192.609 234.499C176.8 223.202 175.585 200.416 175.585 200.416C175.585 200.416 200.014 195.96 215.821 207.245Z" stroke="black" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* ================ OUR PROMISE ================ */}
            <div className="flex flex-col items-center space-y-3 text-center">
                <p className="font-semibold text-2xl text-[#093C16]">
                    Our Promise
                </p>
                <p className='lg:w-[784px]'>
                    Every Zealous product is crafted with purity and responsibility in mind. That means no shortcuts, no harmful additives  only nature and science, working together for you.
                </p>

                <div className="relative w-full max-w-[1060px] h-[400px] sm:h-[952px] mx-auto">
                    <Image
                        src="/aboutUs/4.jpg"
                        fill
                        alt='contact-us'
                        className='object-cover'
                    />
                </div>
            </div>

            {/* ================ OUR VALUES ================ */}
            <div className="flex flex-col items-center space-y-[30px] text-center">
                <p className="font-semibold text-3xl text-[#093C16]">
                    Our Values
                </p>

                <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-16">
                    <div className="flex flex-col items-center space-y-1.5">
                        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.1667 12.7147V9.33333C19.1667 7.91885 19.7286 6.56229 20.7288 5.5621C21.729 4.5619 23.0855 4 24.5 4H26.5C26.6768 4 26.8464 4.07024 26.9714 4.19526C27.0964 4.32029 27.1667 4.48986 27.1667 4.66667V6.66667C27.1667 8.08115 26.6048 9.43771 25.6046 10.4379C24.6044 11.4381 23.2478 12 21.8333 12C20.4188 12 19.0623 12.5619 18.0621 13.5621C17.0619 14.5623 16.5 15.9188 16.5 17.3333C16.5 20 17.8333 21.3333 17.8333 24C17.8333 25.4425 17.3655 26.846 16.5 28" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5.83325 12.0001C6.82372 11.2572 8.00147 10.8049 9.23455 10.6937C10.4676 10.5825 11.7073 10.8169 12.8147 11.3706C13.922 11.9243 14.8534 12.7754 15.5043 13.8285C16.1552 14.8817 16.4999 16.0953 16.4999 17.3334C15.5095 18.0763 14.3317 18.5286 13.0986 18.6398C11.8655 18.751 10.6259 18.5166 9.5185 17.9629C8.41112 17.4092 7.47981 16.5581 6.82891 15.505C6.17802 14.4518 5.83325 13.2382 5.83325 12.0001Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.16675 28H25.8334" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="font-semibold text-xs md:text-sm">
                            Pure Ingredients
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-1.5">
                        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 24H19.1667" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.5 29.3333H28.5" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.1666 29.3334C21.6419 29.3334 24.0159 28.3501 25.7662 26.5997C27.5166 24.8494 28.4999 22.4754 28.4999 20.0001C28.4999 17.5247 27.5166 15.1508 25.7662 13.4004C24.0159 11.6501 21.6419 10.6667 19.1666 10.6667H17.8333" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.5 18.6667H15.1667" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.4999 16C11.7927 16 11.1144 15.719 10.6143 15.219C10.1142 14.7189 9.83325 14.0406 9.83325 13.3333V8H17.8333V13.3333C17.8333 14.0406 17.5523 14.7189 17.0522 15.219C16.5521 15.719 15.8738 16 15.1666 16H12.4999Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16.5001 8.00008V4.00008C16.5001 3.64646 16.3596 3.30732 16.1096 3.05727C15.8595 2.80722 15.5204 2.66675 15.1667 2.66675H12.5001C12.1465 2.66675 11.8073 2.80722 11.5573 3.05727C11.3072 3.30732 11.1667 3.64646 11.1667 4.00008V8.00008" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <p className="font-semibold text-xs md:text-sm">
                            Clinically tested
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-1.5">
                        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M27.1667 6.66675H5.83341C4.36066 6.66675 3.16675 7.86066 3.16675 9.33341V22.6667C3.16675 24.1395 4.36066 25.3334 5.83341 25.3334H27.1667C28.6395 25.3334 29.8334 24.1395 29.8334 22.6667V9.33341C29.8334 7.86066 28.6395 6.66675 27.1667 6.66675Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3.16675 13.3333H29.8334" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="font-semibold text-xs md:text-sm">
                            Secure Payment
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-1.5">
                        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.1667 23.9999V7.99992C19.1667 7.29267 18.8858 6.6144 18.3857 6.1143C17.8856 5.6142 17.2073 5.33325 16.5001 5.33325H5.83341C5.12617 5.33325 4.44789 5.6142 3.9478 6.1143C3.4477 6.6144 3.16675 7.29267 3.16675 7.99992V22.6666C3.16675 23.0202 3.30722 23.3593 3.55727 23.6094C3.80732 23.8594 4.14646 23.9999 4.50008 23.9999H7.16675" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20.5 24H12.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M25.8334 24.0001H28.5001C28.8537 24.0001 29.1928 23.8596 29.4429 23.6096C29.6929 23.3595 29.8334 23.0204 29.8334 22.6667V17.8001C29.8329 17.4975 29.7294 17.2041 29.5401 16.9681L24.9001 11.1681C24.7754 11.0119 24.6172 10.8858 24.4372 10.799C24.2571 10.7122 24.0599 10.667 23.8601 10.6667H19.1667" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M23.1667 26.6666C24.6394 26.6666 25.8333 25.4727 25.8333 23.9999C25.8333 22.5272 24.6394 21.3333 23.1667 21.3333C21.6939 21.3333 20.5 22.5272 20.5 23.9999C20.5 25.4727 21.6939 26.6666 23.1667 26.6666Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.83341 26.6666C11.3062 26.6666 12.5001 25.4727 12.5001 23.9999C12.5001 22.5272 11.3062 21.3333 9.83341 21.3333C8.36066 21.3333 7.16675 22.5272 7.16675 23.9999C7.16675 25.4727 8.36066 26.6666 9.83341 26.6666Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="font-semibold text-xs md:text-sm">
                            Fast Delivery
                        </p>
                    </div>
                </div>
            </div>

            {/* ================ OUR TEAM ================ */}
            <div className="flex flex-col md:flex-row items-center gap-[30px] py-2.5 px-10">
                {/* Left Image */}
                <div className="relative w-full max-w-[566px] h-[407px] mx-auto">
                    <Image
                        src="/aboutUs/5.png"
                        fill
                        alt='contact-us'
                        className='rounded-[40px] object-cover'
                    />
                </div>

                {/* Right Text Content */}
                <div className="space-y-3 px-5 sm:px-0">
                    <p className="border-2 border-[#71BF45] rounded-[58px] py-2.5 px-5 text-[#71BF45] font-semibold text-sm w-fit">
                        About Us
                    </p>
                    <p className="font-semibold text-[#093C16] text-2xl">
                        Our Team
                    </p>
                    <p className="text-xs">
                        Behind every Zealous product is a team of researchers,
                        nutritionists, and herbal experts dedicated to your health.
                    </p>

                    <div className="relative flex justify-between overflow-hidden bg-[#C2EDAB66] rounded-[30px]">
                        <svg
                            width="125"
                            height="51"
                            viewBox="0 0 125 51"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M118.904 -24.4397C105.705 3.71302 66.6711 1.83489 38.5711 14.9124C12.7907 26.9104 -10.5636 59.2596 -36.5509 47.9081C-62.7096 36.4818 -51.4469 -4.39303 -64.2529 -30.002C-76.7848 -55.0627 -112.044 -69.2588 -109.114 -97.2013C-106.031 -126.616 -79.0763 -151.428 -50.6967 -159.324C-25.1039 -166.444 -4.10684 -140.967 21.3356 -133.495C48.0488 -125.651 80.979 -135.978 99.5715 -115.197C120.947 -91.3049 132.573 -53.5944 118.904 -24.4397Z"
                                fill="#71BF45"
                                fillOpacity="0.1"
                            />
                        </svg>

                        <svg
                            width="126"
                            height="2"
                            viewBox="0 0 126 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M102.45 0.0533813C86.1759 7.20738 68.2397 -10.5097 50.2104 -16.6752C33.6694 -22.3316 11.067 -17.6477 2.70815 -34.0552C-5.7058 -50.571 14.1577 -64.3705 17.137 -81.595C20.0524 -98.4507 8.28403 -120.162 19.5897 -131.656C31.4909 -143.755 53.136 -143.442 69.4609 -134.79C84.1828 -126.987 85.1537 -106.285 94.629 -91.8845C104.577 -76.7648 123.933 -67.2571 125.424 -49.7377C127.137 -29.5961 119.304 -7.35524 102.45 0.0533813Z"
                                fill="#71BF45"
                                fillOpacity="0.1"
                            />
                        </svg>


                        <svg
                            width="168"
                            height="115"
                            viewBox="0 0 168 115"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M202.965 -37.213C221.142 -11.9864 200.513 21.205 198.271 52.1178C196.213 80.4788 213.117 116.62 190.558 133.804C167.851 151.101 137.616 121.378 109.012 120.11C81.0198 118.869 51.4654 142.769 28.4763 126.618C4.27604 109.616 -4.29096 73.9958 2.61495 45.3593C8.84275 19.5347 41.3164 13.5821 60.2202 -5.01318C80.0681 -24.5373 87.0635 -58.3324 114.265 -64.4683C145.537 -71.5226 184.141 -63.3375 202.965 -37.213Z"
                                fill="#71BF45"
                                fillOpacity="0.4"
                            />
                        </svg>

                        <div className='absolute top-5 left-[30px]'>
                            <p className="font-semibold text-[rgb(9,60,22)]">
                                Vision
                            </p>
                            <p className="text-sm text-[#71BF45] w-[354px]">
                                To redefine global wellness through herbal innovation
                                and make natural healing accessible to all.
                            </p>
                        </div>
                    </div>

                    <div className="relative flex justify-between overflow-hidden bg-[#C2EDAB66] rounded-[30px]">
                        <svg
                            width="125"
                            height="72"
                            viewBox="0 0 125 72"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M118.904 -3.43967C105.705 24.713 66.6711 22.8349 38.5711 35.9124C12.7907 47.9104 -10.5636 80.2596 -36.5509 68.9081C-62.7096 57.4818 -51.4469 16.607 -64.2529 -9.002C-76.7848 -34.0627 -112.044 -48.2588 -109.114 -76.2013C-106.031 -105.616 -79.0763 -130.428 -50.6967 -138.324C-25.1039 -145.444 -4.10684 -119.967 21.3356 -112.495C48.0488 -104.651 80.979 -114.978 99.5715 -94.1966C120.947 -70.3049 132.573 -32.5944 118.904 -3.43967Z"
                                fill="#71BF45"
                                fillOpacity="0.1"
                            />
                        </svg>

                        <svg
                            width="126"
                            height="23"
                            viewBox="0 0 126 23"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M102.45 21.0534C86.1759 28.2074 68.2397 10.4903 50.2104 4.32485C33.6694 -1.33164 11.067 3.35233 2.70814 -13.0552C-5.70581 -29.571 14.1577 -43.3705 17.137 -60.595C20.0524 -77.4507 8.28403 -99.1617 19.5896 -110.656C31.4909 -122.755 53.136 -122.442 69.4609 -113.79C84.1828 -105.987 85.1537 -85.285 94.629 -70.8845C104.577 -55.7648 123.933 -46.2571 125.424 -28.7377C127.137 -8.59614 119.304 13.6448 102.45 21.0534Z"
                                fill="#71BF45"
                                fillOpacity="0.1"
                            />
                        </svg>

                        <svg
                            width="168"
                            height="136"
                            viewBox="0 0 168 136"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M202.965 -16.213C221.142 9.0136 200.513 42.205 198.271 73.1178C196.213 101.479 213.117 137.62 190.558 154.804C167.851 172.101 137.616 142.378 109.012 141.11C81.0198 139.869 51.4654 163.769 28.4763 147.618C4.27604 130.616 -4.29096 94.9958 2.61495 66.3593C8.84275 40.5347 41.3164 34.5821 60.2202 15.9868C80.0681 -3.53725 87.0635 -37.3324 114.265 -43.4683C145.537 -50.5226 184.141 -42.3375 202.965 -16.213Z"
                                fill="#71BF45"
                                fillOpacity="0.4"
                            />
                        </svg>

                        <div className='absolute top-5 left-[30px]'>
                            <p className="font-semibold text-[#093C16]">
                                Mission
                            </p>
                            <p className="text-sm text-[#71BF45] w-[354px]">
                                To combine traditional herbal wisdom with modern nutraceutical
                                research, creating safe, effective, and sustainable solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page