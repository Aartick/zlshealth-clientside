/**
 * ShopLink Component
 * 
 * This component displays a categorized shop navigation section.
 * It visually organizes products by category and need, showing icons, titles, and descriptions.
 * Users can browse categories, needs, and see a featured image. Each item is styled for hover effects.
 * "See All Products" links allow users to view the full product list.
 */

import React from 'react'
import { TbMedicineSyrup } from "react-icons/tb";
import { BiCapsule } from "react-icons/bi";
import { RiShieldCrossLine, RiMentalHealthLine, RiLungsLine } from "react-icons/ri";
import Link from 'next/link';
import Image from 'next/image';

function ShopLink() {
    // First column: Shop by Category
    const firstCol = [
        {
            img: <TbMedicineSyrup className='text-[#71BF45]' size={24} />,
            title: "Syrups & Tonics",
            desc: "Soothing herbal liquid blends"
        },
        {
            img: <BiCapsule className='text-[#71BF45]' size={24} />,
            title: "Capsules & Tablets",
            desc: "Easy daily wellness doses"
        },
        {
            img: <Image alt='img' src="/Oils.png" width={24} height={24} />,
            title: "Oils & Creams",
            desc: "External care with herbal actives"
        },
        {
            img: <Image alt='img' src="/essential.png" width={24} height={24} />,
            title: "Essential Oils & Blends",
            desc: "Aromatic and healing extracts"
        }
    ]

    // Second column: Shop by Need
    const secondCol = [
        {
            img: <RiShieldCrossLine className='text-[#71BF45]' size={24} />,
            title: "Immunity Support",
            desc: "Boost your natural defenses"
        },
        {
            img: <Image src="/diabetes.png" alt='img' width={24} height={24} />,
            title: "Diabetes Management",
            desc: "Balanced sugar support"
        },
        {
            img: <Image src="/sleep.png" alt='img' width={24} height={24} />,
            title: "Stress & Sleep Relief",
            desc: "Calm your mind, rest better"
        },
        {
            img: <Image src="/balance.png" alt='img' width={24} height={24} />,
            title: "Hormonal Balance",
            desc: "Regulate cycles and energy"
        }
    ]

    // Third column: More needs
    const thirdCol = [
        {
            img: <RiMentalHealthLine className='text-[#71BF45]' size={24} />,
            title: "Mental Awareness",
            desc: "Focus, clarity, mood uplift"
        },
        {
            img: <Image src="/girl.png" alt='img' width={24} height={24} />,
            title: "PCOS & Menstrual Health",
            desc: "Natural hormonal harmony"
        },
        {
            img: <RiLungsLine className='text-[#71BF45]' size={24} />,
            title: "Respiratory Health",
            desc: "Breathe easier, feel stronger"
        }
    ]

    return (
        <div className='h-full mx-10 scrollbar-hide rounded-2xl overflow-y-scroll flex flex-wrap lg:flex-nowrap p-10 gap-[35px] bg-white text-black'>

            {/* ====== FIRST COLUMN: Shop by Category ====== */}
            <div className="space-y-5">
                <p className="font-normal text-3xl whitespace-nowrap">
                    <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
                        SHOP BY C
                    </span>
                    ATEGORY
                </p>
                <div className="space-y-1">
                    <div className="space-y-3">
                        {/* Render each category item */}
                        {firstCol.map((item, idx) => (
                            <div key={idx} className='p-2.5 space-y-2 rounded-xl cursor-pointer transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'>
                                <div className='relative flex items-center gap-3'>
                                    {/* Category icon/image */}
                                    {item.img}
                                    {/* Category title */}
                                    <p className='font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                        {item.title}
                                    </p>
                                </div>
                                {/* Category description */}
                                <p className='font-normal text-sm text-[#848484] pl-[37px] whitespace-nowrap'>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* Link to all products */}
                    <Link href="/products" className='text-[#36810B] font-normal underline decoration-solid'>See All Products</Link>
                </div>
            </div>

            {/* ====== SECOND COLUMN: Shop by Need ====== */}
            <div className="space-y-5">
                <p className="font-normal text-3xl whitespace-nowrap">
                    <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
                        SHOP BY N
                    </span>
                    EED
                </p>
                <div className="flex gap-4">
                    {/* FIRST PART: Immunity, Diabetes, Stress, Hormonal */}
                    <div className="space-y-1">
                        <div className="space-y-3">
                            {/* Render each need item */}
                            {secondCol.map((item, idx) => (
                                <div key={idx} className='p-2.5 space-y-2.5 rounded-xl cursor-pointer transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'>
                                    <div className='relative flex items-center gap-3'>
                                        {/* Need icon/image */}
                                        {item.img}
                                        {/* Need title */}
                                        <p className='font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                            {item.title}
                                        </p>
                                    </div>
                                    {/* Need description */}
                                    <p className='font-normal text-sm text-[#848484] pl-[37px] whitespace-nowrap'>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* Link to all products */}
                        <Link href="/products" className='text-[#36810B] font-normal underline decoration-solid'>See All Products</Link>
                    </div>

                    {/* SECOND PART: Mental, PCOS, Respiratory */}
                    <div className="space-y-3">
                        <div className="space-y-3">
                            {/* Render each additional need item */}
                            {thirdCol.map((item, idx) => (
                                <div key={idx} className='p-2.5 space-y-2.5 rounded-xl cursor-pointer transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'>
                                    <div className='relative flex items-center gap-3'>
                                        {/* Need icon/image */}
                                        {item.img}
                                        {/* Need title */}
                                        <p className='font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                            {item.title}
                                        </p>
                                    </div>
                                    {/* Need description */}
                                    <p className='font-normal text-sm text-[#848484] pl-[37px] whitespace-nowrap'>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ====== THIRD COLUMN: Featured shop image ====== */}
            <div className='relative w-[350px] h-[490px]'>
                <Image
                    src="/shopLink.jpg"
                    alt='img'
                    fill
                    className='object-cover rounded-3xl'
                    sizes="(max-width: 768px) 100vw, 351px"
                />
            </div>
        </div>
    )
}

export default ShopLink
