/**
 * ShopLink Component
 * 
 * This component displays a categorized shop navigation section.
 * It visually organizes products by category and need, showing icons, titles, and descriptions.
 * Users can browse categories, needs, and see a featured image. Each item is styled for hover effects.
 * "See All Products" links allow users to view the full product list.
 */

"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { axiosClient } from '@/utils/axiosClient';

// Filters interface for categories, product types, and benefits
interface filters {
    _id: string,
    type: string,
    label: string,
    name: string,
    icon: string,
    description: string
}

function ShopLink() {
    const [categories, setCategories] = useState<filters[]>([])
    const [benefitsFirstCol, setBenefitsFirstCol] = useState<filters[]>([])
    const [benefitsSecondCol, setBenefitsSecondCol] = useState<filters[]>([])

    useEffect(() => {
        const getCategory = async () => {
            try {
                const res = await axiosClient.get("/api/categories")
                const allCategories = res.data.result;
                setCategories(allCategories.slice(0, 4))
            } catch { }
        }

        const getBenefits = async () => {
            try {
                const res = await axiosClient.get("/api/benefits")
                const allBenefits = res.data.result;
                setBenefitsFirstCol(allBenefits.slice(0, 4))
                setBenefitsSecondCol(allBenefits.slice(4, 8))
            } catch {

            }
        }

        getCategory();
        getBenefits()
    }, [])

    return (
        <div className='h-[400px] lg:h-full mx-5 md:mx-10 scrollbar-hide rounded-2xl overflow-y-scroll flex flex-wrap lg:flex-nowrap p-5 md:p-10 gap-[35px] bg-white text-black shadow-2xl'>

            {/* ====== FIRST COLUMN: Shop by Category ====== */}
            <div className="space-y-2.5 lg:space-y-5">
                <p className="font-normal text-xl md:text-3xl whitespace-nowrap">
                    <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
                        SHOP BY C
                    </span>
                    ATEGORY
                </p>
                <div className="lg:space-y-1">
                    <div className="space-y-1.5 lg:space-y-3">
                        {/* Render each category item */}
                        {categories.map((item, idx) => (
                            <Link
                                key={idx}
                                href={`/products?category=${encodeURIComponent(item.name)}`}
                                className='p-2.5 space-y-1 md:space-y-2 rounded-xl transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'
                            >
                                <div className='relative flex items-center gap-3'>
                                    {/* Need icon */}
                                    <div
                                        className="w-5 h-5 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                                        dangerouslySetInnerHTML={{ __html: item.icon }}
                                    />
                                    {/* Category title */}
                                    <p className='text-sm md:text-base font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                        {item.name}
                                    </p>
                                </div>
                                {/* Category description */}
                                <p className='font-normal text-xs md:text-sm text-[#848484] pl-[37px] whitespace-nowrap'>
                                    {item.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                    {/* Link to all products */}
                    <Link href="/products" className='text-sm md:text-base text-[#36810B] font-normal underline decoration-solid'>See All Products</Link>
                </div>
            </div>

            {/* ====== SECOND COLUMN: Shop by Need ====== */}
            <div className="space-y-2.5 lg:space-y-5">
                <p className="font-normal text-xl md:text-3xl whitespace-nowrap">
                    <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
                        SHOP BY N
                    </span>
                    EED
                </p>
                <div className="flex flex-col lg:flex-row lg:gap-4">
                    {/* FIRST PART: Immunity, Diabetes, Stress, Hormonal */}
                    <div className="lg:space-y-1">
                        <div className="space-y-1.5 lg:space-y-3">
                            {/* Render each need item */}
                            {benefitsFirstCol.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={`/products?benefits=${encodeURIComponent(item.name)}`}
                                    className='p-2.5 space-y-1 md:space-y-2.5 rounded-xl transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'
                                >
                                    <div className='relative flex items-center gap-3'>
                                        {/* Need icon */}
                                        <div
                                            className="w-5 h-5 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                                            dangerouslySetInnerHTML={{ __html: item.icon }}
                                        />
                                        {/* Need title */}
                                        <p className='text-sm md:text-base font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                            {item.name}
                                        </p>
                                    </div>
                                    {/* Need description */}
                                    <p className='font-normal text-xs md:text-sm text-[#848484] pl-[37px] whitespace-nowrap'>
                                        {item.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                        {/* Link to all products */}
                        <Link href="/products" className='hidden lg:block text-base text-[#36810B] font-normal underline decoration-solid'>See All Products</Link>
                    </div>

                    {/* SECOND PART: Mental, PCOS, Respiratory */}
                    <div className="-mt-5 lg:mt-0 lg:space-y-3">
                        <div className="space-1.5 lg:space-y-3">
                            {/* Render each additional need item */}
                            {benefitsSecondCol.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={`/products?benefits=${encodeURIComponent(item.name)}`}
                                    className='p-2.5 space-y-2.5 rounded-xl transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'
                                >
                                    <div className='relative flex items-center gap-3'>
                                        {/* Need icon */}
                                        <div
                                            className="w-5 h-5 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                                            dangerouslySetInnerHTML={{ __html: item.icon }}
                                        />
                                        {/* Need title */}
                                        <p className='text-sm md:text-base font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                            {item.name}
                                        </p>
                                    </div>
                                    {/* Need description */}
                                    <p className='font-normal text-xs sm:text-sm text-[#848484] pl-[37px] whitespace-nowrap'>
                                        {item.description}
                                    </p>
                                </Link>
                            ))}
                        </div>

                        {/* Link to all products */}
                        <Link href="/products" className='lg:hidden text-sm text-[#36810B] font-normal underline decoration-solid'>See All Products</Link>
                    </div>
                </div>
            </div>

            {/* ====== THIRD COLUMN: Featured shop image ====== */}
            <div className='hidden xl:block relative w-[250px] h-[400px] 2xl:w-[350px] 2xl:h-[490px]'>
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
