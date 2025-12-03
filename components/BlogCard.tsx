/**
 * BlogCard Component
 * 
 * This component renders a single blog preview card.
 * It includes:
 *  - Blog image with a "Most Read" badge renders conditionally.
 *  - Blog title. 
 *  - Category tags (horizontally scrollable if too many).
 *  - A short blog description/summary. 
 *  - A "Read More" link button that navigates to the blog details page.
 * 
 */

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function BlogCard() {
    return (
        <div className="border border-[#CDCDCD] rounded-[30px] p-4 space-y-4">
            {/* ================ Blog Image Section ================ */}
            <div className="relative w-full h-[200px] md:h-[232px]">
                <Image
                    src="/aboutUs/1.jpg"
                    alt='blog1-img'
                    fill
                    className='rounded-2xl object-cover'
                />

                {/* "Most Read" Badge -> shown at the top of the image */}
                <div className="absolute top-5 inline-block">
                    <div
                        className="bg-[#71BF45] text-white text-xs md:text-base font-semibold px-3 py-2"
                        style={{
                            clipPath:
                                'polygon(0 0, 100% 0, calc(100% - 8px) 50%, 100% 100%, 0 100%)'
                        }}
                    >
                        Most Read
                    </div>
                </div>
            </div>

            {/* ================ Blog Title ================ */}
            <p className="font-semibold md:text-xl">
                Debunking Common Myths About Food Supplements
            </p>

            {/* ================ Blog Tags (scrollable row) ================ */}
            <div className="flex items-center gap-2.5 overflow-x-scroll scrollbar-hide text-xs md:text-base">
                <p className="py-[5px] px-2.5 border border-[#D6D6D6] rounded-[30px]">Supplements</p>
                <p className="py-[5px] px-2.5 border border-[#D6D6D6] rounded-[30px]">Wellness</p>
                <p className="py-[5px] px-2.5 border border-[#D6D6D6] rounded-[30px]">Myths</p>
            </div>

            {/* ================ Blog Summary ================ */}
            <p className="text-xs md:text-sm font-medium text-[#848484]">
                Food supplements have gained immense popularity
                over the years, but with this rise in interest
                comes a plethora of misconceptions and myths.
            </p>

            {/* ================ "Read More" Button ================ */}
            <Link
                href={`/blogDescription`}
                className="
                border border-[#71BF45] 
                px-2.5 md:px-5 py-[5px] md:py-2.5 
                rounded-[5px] md:rounded-[10px]
                text-[#36810B] font-semibold
                text-xs md:text-base
              "
            >
                Read More
            </Link>
        </div>
    )
}

export default BlogCard