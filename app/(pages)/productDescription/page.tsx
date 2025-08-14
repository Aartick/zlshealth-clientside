import Image from 'next/image'
import React from 'react'
import { IoStarSharp } from 'react-icons/io5'
import { LuPen } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { LiaHandHoldingUsdSolid, LiaExchangeAltSolid } from "react-icons/lia";
import { MdKeyboardArrowRight } from "react-icons/md";
import Link from 'next/link';
import Product from '@/components/Product';
import FAQ from '@/components/FAQ';

function Page() {
    return (
        <div className='space-y-5 pb-10'>
            <div className="flex flex-col md:flex-row">
                {/* LEFT COLUMN */}
                <div className="flex-1 p-3 md:p-6 space-y-6">
                    <div className="flex space-x-4">
                        <div className="flex flex-col space-y-2.5">
                            <Image
                                src="/DiavincoDesc.jpg"
                                width={150}
                                height={150}
                                alt="DiavincoDescImg"
                            />
                            <Image
                                src="/Diavinco.png"
                                width={150}
                                height={150}
                                alt="DiavincoDescImg"
                                className="w-[150px] h-[150px] object-cover"
                            />

                        </div>

                        <div className="flex-[2] relative w-[525px]  md:h-[492px]">
                            <Image
                                src="/prodImg.png"
                                fill
                                alt="DiavincoDescImg"
                            />
                        </div>
                    </div>

                    <Image
                        src="/DiavincoHand.png"
                        width={689}
                        height={609}
                        alt="img"
                    />
                    <Image
                        src="/DiavincoTable.png"
                        width={689}
                        height={609}
                        alt="img"
                    />
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex-1 p-3 md:p-6">
                    <div className="space-y-5 border-b-[3px] border-[#e3e3e3] px-2.5 pb-5">
                        <div className="flex items-center justify-between">
                            <div className='flex items-center gap-1.5 text-xs sm:text-base'>
                                <p className="flex items-center gap-1.5 text-[#848484] font-medium">
                                    <span className="flex items-center text-[#71BF45]">
                                        <IoStarSharp />
                                        <IoStarSharp />
                                        <IoStarSharp />
                                        <IoStarSharp />
                                        <IoStarSharp />
                                    </span>
                                    4.5
                                    <span className="text-[#71BF45]">
                                        (120+ Reviews)
                                    </span>
                                </p>
                                <p className='border-l-2 border-[#848484] pl-1.5 underline decoration-solid text-[#848484]'>Write Review</p>
                                <p className='border-l-2 border-[#848484] pl-1.5 underline decoration-solid text-[#848484]'>Q&A</p>
                            </div>
                            <div className="p-[3px] sm:p-[5px] border">
                                <div className="rounded-full bg-[#71bf45] size-2 sm:size-[10px]"></div>
                            </div>
                        </div>

                        <div>
                            <p className='font-medium text-2xl'>Diavinco</p>
                            <p className="font-medium text-[#848484]">Blood Sugar Control Tablet - 30 Caplets</p>
                        </div>

                        <div className="flex items-center gap-2.5 overflow-x-scroll scrollbar-hide">
                            <div className="border-2 border-[#e3e3e3] py-[5px] px-2.5 rounded-[30px]">
                                <p className='text-[#848484] text-nowrap font-medium'>Caplet</p>
                            </div>
                            <div className="border-2 border-[#e3e3e3] py-[5px] px-2.5 rounded-[30px]">
                                <p className='text-[#848484] text-nowrap font-medium'>Blood Sugar</p>
                            </div>
                            <div className="border-2 border-[#e3e3e3] py-[5px] px-2.5 rounded-[30px]">
                                <p className='text-[#848484] text-nowrap font-medium'>Mitochondria Boost</p>
                            </div>
                        </div>

                        <p className='font-medium text-[#848484]'>Tablet for <span className='text-[#000000]'>Glucose</span> & <span className='text-[#000000]'>Lipid Metabolism</span></p>
                        <p className='text-[#848484] font-medium'>Boosts mitochondrial function to reduce insulin resistance.</p>

                        <div>
                            <p className="font-semibold text-base sm:text-2xl">
                                ₹ 1,300.00{" "}
                                <span className="font-normal text-xs line-through text-[#848484]">
                                    ₹ 1,499.00
                                </span>{" "}
                                <span className="font-medium text-sm text-[#71BF45]">(28% off)</span>
                            </p>
                            <p className='text-[#71BF45]'>inclusice of all taxes</p>
                        </div>

                        <div className='flex flex-col space-y-2 w-fit'>
                            <label htmlFor="quantity">
                                Quantity
                            </label>
                            <select name="quantity" id="quantity" className='border border-[#e3e3e3] py-[5px] pr-[5px] pl-2.5 rounded-[5px] w-full'>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>

                        <p className='font-extrabold text-nowrap md:whitespace-normal md:text-xl text-[#093C16]'>
                            Expiry:{" "}
                            <span className="font-medium text-[#848484]">
                                Best before
                            </span>{" "}
                            <span className="font-medium text-[#000000]">
                                24 months
                            </span>{" "}
                            <span className="font-medium text-[#848484]">
                                from manufacture.
                            </span>
                        </p>

                        <div className="flex items-center gap-5">
                            <button className='rounded-[10px] py-3 px-2.5 bg-[#093C16] text-white font-semibold w-full'>
                                Add To Cart
                            </button>
                            <button className='rounded-[10px] py-3 px-2.5 border-2 border-[#093C16] bg-[#71BF45] text-[#093C16] font-semibold w-full'>
                                Buy Now
                            </button>
                        </div>
                    </div>

                    <div className="border-b-[3px] border-[#e3e3e3] px-2.5 py-5 space-y-5">
                        <p className="font-semibold text-2xl text-[#093C16]">Delivery Options</p>
                        <label
                            htmlFor='pincode'
                            className="flex items-center gap-1 p-2.5 border-2 border-[#cdcdcd] rounded-[10px] w-fit"
                        >
                            <input
                                id='pincode'
                                type="text"
                                placeholder="Enter PINCODE"
                                className="focus:outline-none"
                            />
                            <LuPen className="cursor-pointer text-[#cdcdcd]" />
                        </label>

                        <div className="flex items-center gap-5">
                            <div className="border-[0.5px] border-[#cdcdcd] rounded-[10px] p-2.5 md:p-5 space-y-2.5">
                                <TbTruckDelivery />
                                <p className='text-[#848484] font-medium'>Get it delivered by <span className='text-black'>Tue, Aug 12</span></p>
                            </div>
                            <div className="border-[0.5px] border-[#cdcdcd] rounded-[10px] p-2.5 md:p-5 space-y-2.5">
                                <LiaHandHoldingUsdSolid />
                                <p className='text-black font-medium'>Pay on delivery <span className='text-[#848484]'>available</span></p>
                            </div>
                            <div className="border-[0.5px] border-[#cdcdcd] rounded-[10px] p-2.5 md:p-5 space-y-2.5">
                                <LiaExchangeAltSolid />
                                <p className='font-medium'>Easy 14-day exchange <span className='text-[#848484]'>available</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b-[3px] border-[#e3e3e3] px-2.5 py-5 space-y-5">
                        <p className="font-semibold text-2xl text-[#093C16]">Quick Product Details</p>

                        <ul className='list-disc pl-6 space-y-5'>
                            <li><span className="underline text-[#093C16] decoration-solid font-semibold">Category:</span>{" "}Herbal Blood Sugar Support</li>
                            <li><span className="underline text-[#093C16] decoration-solid font-semibold">Form:</span>{" "}Caplet</li>
                            <li><span className="underline text-[#093C16] decoration-solid font-semibold">Pack size:</span>{" "} 30 Caplets</li>
                            <li><span className="underline text-[#093C16] decoration-solid font-semibold">Applied for:</span>{" "}Blood sugar & lipid control, improved energy, insulin sensitivity</li>
                            <li><span className="underline text-[#093C16] decoration-solid font-semibold">Suitable for:</span>{" "}Adults</li>
                            <li><span className="underline text-[#093C16] decoration-solid font-semibold">Safety:</span>{" "}No side effects, safe for long-term user</li>
                        </ul>
                    </div>

                    <div className="px-2.5 py-5 space-y-5">
                        <p className="font-semibold text-2xl text-[#093C16]">Ratings</p>

                        <div className="px-2.5 flex items-center gap-2.5">
                            <div className='border-r-[3px] border-[#e3e3e3] p-2.5 space-y-5'>
                                <div className="flex items-center gap-[5px]">
                                    <p className='font-semibold text-[32px]'>4.8</p>
                                    <IoStarSharp className='text-xl text-[#71BF45]' />
                                </div>
                                <p className="text-[#848484]">(120+ Reviews)</p>
                            </div>
                            <div className="py-2.5 space-y-2.5">
                                {[
                                    { rating: 5, count: 98, percent: 75 },
                                    { rating: 4, count: 18, percent: 50 },
                                    { rating: 3, count: 4, percent: 25 },
                                    { rating: 2, count: 0, percent: 0 },
                                    { rating: 1, count: 0, percent: 0 },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-[5px]">
                                        <p className="text-[#848484] text-xs w-2 text-right">{item.rating}</p>
                                        <IoStarSharp className="text-[10px] text-[#71BF45]" />
                                        <div className="h-1 w-[180px] bg-[#e3e3e3] rounded">
                                            <div
                                                className="h-1 bg-[#093C16] rounded"
                                                style={{ width: `${item.percent}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-right">{item.count}</p>
                                    </div>
                                ))}
                            </div>

                        </div>

                        <p className="font-semibold text-xl text-[#093C16]">Customer Photos (8)</p>

                        <div className="flex items-center gap-5">
                            <Image
                                src="/DiavincoHand.png"
                                width={100}
                                height={100}
                                className='rounded-[10px]'
                                alt='reviewPhotos'
                            />
                            <Image
                                src="/DiavincoHand.png"
                                width={100}
                                height={100}
                                className='rounded-[10px]'
                                alt='reviewPhotos'
                            />
                            <Image
                                src="/DiavincoHand.png"
                                width={100}
                                height={100}
                                className='rounded-[10px]'
                                alt='reviewPhotos'
                            />
                        </div>

                        <div className="space-y-5">
                            <div className="flex justify-between items-center">
                                <p className='font-semibold text-xl text-[#093C16]'>Review (8)</p>
                                <Link href="/productDescription" className='flex items-center gap-[5px]'>
                                    <p className='underline decoration-solid text-[#093C16]'>View all reviews</p>
                                    <MdKeyboardArrowRight />
                                </Link>
                            </div>
                            <div className="space-y-2.5">
                                <p className='font-medium text-xl'>Natural relief that works so well!</p>
                                <p className='text-sm'>I've been using Diavinco for almost three months now, and the difference has been remarkable. My fasting sugar levels have dropped, my energy feels steadier throughout the day, and even my evening fatigue has reduced a lot. What, I really like is that it's herbal, so I'm not worried about long-term side effects...
                                    <span className='text-[#017BD2]'>see more.</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-[30px] mx-3 md:mx-10">
                <FAQ />
                <p className="text-2xl font-semibold pt-10">Similar Products</p>
                <div className="flex items-center overflow-x-scroll gap-5 scrollbar-hide">
                    {[...Array(11)].map((_, idx) => (
                        <Product key={idx} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page
