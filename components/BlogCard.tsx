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
        <div className="rounded-3xl bg-white border border-[#71BF45] shadow-2xl p-3 md:p-4 space-y-4 md:space-y-5">
            {/* ================ Blog Image Section ================ */}
            <div className="relative w-full h-[200px] md:h-[232px]">
                <Image
                    src="/aboutUs/1.jpg"
                    alt='blog1-img'
                    fill
                    className='rounded-[10px] md:rounded-[14px] object-cover'
                />

                {/* "Most Read" Badge -> shown at the top of the image */}
                <div className="absolute top-3 left-3 inline-block">
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
            <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide text-xs md:text-base">
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
                inline-block
                bg-[#71BF45]
                text-white
                px-3 py-1.5 md:px-5 md:py-2
                rounded-[10px]
                font-semibold
                text-sm md:text-base
                shadow-sm
                hover:bg-[#5aa53a]
                transition-colors
              "
            >
                Read More
            </Link>
        </div>
    )
}

export default BlogCard
