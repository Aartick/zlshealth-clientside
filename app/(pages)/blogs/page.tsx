import BlogCard from '@/components/BlogCard'
import Image from 'next/image'
import React from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

function Page() {

  return (
    <div className='space-y-[30px] bg-white text-black p-10'>
      <div className="space-y-4">
        <div className="relative w-full h-[625px]">
          <Image
            src="/aboutUs/1.jpg"
            alt='hero-img'
            fill
            className='rounded-[20px]'
          />

          {/* Best Seller badge */}
          <div className="absolute top-5 inline-block">
            <div
              className="bg-[#F5CF37] text-[#36810B] text-xs font-bold px-3 py-2"
              style={{
                clipPath:
                  'polygon(0 0, 100% 0, calc(100% - 8px) 50%, 100% 100%, 0 100%)'
              }}
            >
              Most Read
            </div>
          </div>
        </div>

        <div className='px-2.5 space-y-3'>
          <div className="flex items-center justify-between">
            <p className="font-medium text-xl text-[#093C16]">
              The Truth About Supplements
            </p>
            <p className="font-medium text-xl text-[#093C16]">
              Author | 5 min read | Sep 22, 2025
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <p className="border border-[#D6D6D6] py-[5px] px-2.5 text-[#093C16] text-sm rounded-[30px]">Supplements</p>
            <p className="border border-[#D6D6D6] py-[5px] px-2.5 text-[#093C16] text-sm rounded-[30px]">Wellness</p>
            <p className="border border-[#D6D6D6] py-[5px] px-2.5 text-[#093C16] text-sm rounded-[30px]">Myths</p>
          </div>

          <p className="font-medium text-xs text-[#848484]">
            Many people believe supplements are unsafe, addictive,
            or unnecessary. In this blog, we cut through the noise,
            bust popular myths, and show how supplements can safely
            support your everyday health.
          </p>

          <button className="
                    py-2.5 px-5 rounded-[10px]
                    border border-[#71BF45]
                    text-[#36810B] font-semibold
            "
          >
            Read More
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <p className="p-2.5 font-medium text-2xl text-[#093C16]">
          All Blogs
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <BlogCard key={idx} />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center px-3">
        <div className='flex-1' />

        <div className="flex-1 flex items-center justify-center gap-5 font-medium">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>...</p>
          <p>9</p>
          <p>10</p>
        </div>

        <div className="flex-1 flex items-center justify-end gap-2.5">
          <button className="
                    border border-[#E3E3E3]
                    py-2 px-3 rounded-[8px] 
                    flex items-center gap-3 
                    font-medium text-sm
                  "
          >
            <MdKeyboardArrowLeft />
            Previous
          </button>

          <button className="
                    border border-[#E3E3E3]
                    py-2 px-3 rounded-[8px] 
                    flex items-center gap-3 
                    font-medium text-sm
                  "
          >
            Next
            <MdKeyboardArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page