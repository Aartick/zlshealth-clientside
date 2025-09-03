/**
 * Product Description Page
 * 
 * This component displays detailed information about a single product.
 * It fetches product data from the backend using the product ID from the URL.
 * The page shows product images, ratings, price, highlights, tags, 
 * delivery options, reviews, and FAQs.
 * Users can add the product to their cart or wishlist, select quantity,
 * and view similar products.
 */

"use client"

// Import required modules and components
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { IoStarSharp } from 'react-icons/io5'
import { LuPen } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { LiaHandHoldingUsdSolid, LiaExchangeAltSolid } from "react-icons/lia";
import { MdKeyboardArrowRight } from "react-icons/md";
import Link from 'next/link';
import FAQ from '@/components/FAQ';
import { useParams } from 'next/navigation';
import { axiosClient } from '@/utils/axiosClient';
import CartButton from '@/components/CartButton';
import WishlistButton from '@/components/WishlistButton';

// Product interface defines the structure of product data
interface product {
    _id: string,
    category: string;
    imageUrl: {
        public_id: string,
        url: string
    };
    name: string;
    about: string;
    tags: string[];
    price: number;
    discount: number;
    shortDescription: string;
    quantity: number;
    highlights: string[];
    sku: string;
    brand: string;
    additionalInfo: string;
    appliedFor: string[];
}

// Initial product state for loading
const initialProduct = {
    _id: "",
    category: "",
    imageUrl: {
        public_id: "",
        url: ""
    },
    name: "",
    about: "",
    tags: [],
    price: 0,
    discount: 0,
    shortDescription: "",
    quantity: 0,
    highlights: [],
    sku: "",
    brand: "",
    additionalInfo: "",
    appliedFor: [],
}

function Page() {
    // State to hold product details
    const [product, setProduct] = useState<product>(initialProduct)
    // Get product ID from URL params
    const params = useParams()

    // Fetch product details when component mounts
    useEffect(() => {
        const getDetails = async () => {
            try {
                // Fetch product data from backend
                const details = await axiosClient.get(`/api/products?type=productId&id=${params.id}`)
                setProduct(details.data.result)
            } catch (e) {
                return
            }
        }
        getDetails()
    }, [])

    return (
        <div className='space-y-5 pb-10'>
            <div className="flex flex-col md:flex-row">
                {/* LEFT COLUMN: Product images */}
                <div className="flex-1 p-3 md:p-6 space-y-6">
                    <div className="flex space-x-4">
                        <div className="flex flex-col space-y-2.5">
                            {/* Thumbnail images */}
                            <Image
                                src={product.imageUrl.url}
                                width={150}
                                height={150}
                                alt="DiavincoDescImg"
                            />
                            <Image
                                src={product.imageUrl.url}
                                width={150}
                                height={150}
                                alt="DiavincoDescImg"
                                className="w-[150px] h-[150px] object-cover"
                            />
                        </div>

                        <div className="flex-[2] relative w-[525px] md:h-[492px]">
                            {/* Wishlist Heart Button */}
                            <div className="absolute top-3 right-3 z-10">
                                <WishlistButton product={product} />
                            </div>

                            {/* Main product image */}
                            <Image
                                src={product.imageUrl?.url}
                                fill
                                alt="DiavincoDescImg"
                                className="object-cover rounded-[12px]"
                            />
                        </div>
                    </div>

                    {/* Additional product images */}
                    <Image
                        src={product.imageUrl.url}
                        width={689}
                        height={609}
                        alt="img"
                    />
                    <Image
                        src={product.imageUrl.url}
                        width={689}
                        height={609}
                        alt="img"
                    />
                </div>

                {/* RIGHT COLUMN: Product details and actions */}
                <div className="flex-1 p-3 md:p-6">
                    <div className="space-y-5 border-b-[3px] border-[#e3e3e3] px-2.5 pb-5">
                        {/* Ratings and review links */}
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
                            {/* Stock indicator */}
                            <div className="p-[3px] sm:p-[5px] border">
                                <div className="rounded-full bg-[#71bf45] size-2 sm:size-[10px]"></div>
                            </div>
                        </div>

                        {/* Product name and about */}
                        <div>
                            <p className='font-medium text-2xl'>{product?.name}</p>
                            <p className="font-medium text-[#848484]">{product?.about} - 30 Caplets</p>
                        </div>

                        {/* Product tags */}
                        <div className="flex items-center gap-2.5 overflow-x-scroll scrollbar-hide">
                            {product?.tags.map((tag) => (
                                <div key={tag} className="border-2 border-[#e3e3e3] py-[5px] px-2.5 rounded-[30px]">
                                    <p className='text-[#848484] text-nowrap font-medium'>{tag}</p>
                                </div>
                            ))}
                        </div>

                        {/* Product highlights and description */}
                        <p className='font-medium text-[#848484]'>Tablet for <span className='text-[#000000]'>Glucose</span> & <span className='text-[#000000]'>Lipid Metabolism</span></p>
                        <p className='text-[#848484] font-medium'>{product?.shortDescription}</p>

                        {/* Price, discount, and taxes */}
                        <div>
                            <p className="font-semibold text-base sm:text-2xl">
                                ₹ {product?.price! - (product?.price! * product?.discount! / 100)}{" "}
                                <span className="font-normal text-xs line-through text-[#848484]">
                                    ₹ {product?.price}
                                </span>{" "}
                                <span className="font-medium text-sm text-[#71BF45]">({product?.discount}% off)</span>
                            </p>
                            <p className='text-[#71BF45]'>inclusice of all taxes</p>
                        </div>

                        {/* Quantity selector */}
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

                        {/* Expiry information */}
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

                        {/* Cart and Buy Now buttons */}
                        <div className="flex items-center gap-5">
                            <div className="w-full"><CartButton product={product} /></div>
                            <button className='rounded-[10px] py-3 px-2.5 border-2 border-[#093C16] bg-[#71BF45] text-[#093C16] font-semibold w-full'>
                                Buy Now
                            </button>
                        </div>
                    </div>

                    {/* Delivery options section */}
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

                        {/* Delivery, payment, and exchange info */}
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

                    {/* Quick product details section */}
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

                    {/* Ratings and customer photos section */}
                    <div className="px-2.5 py-5 space-y-5">
                        <p className="font-semibold text-2xl text-[#093C16]">Ratings</p>

                        <div className="px-2.5 flex items-center gap-2.5">
                            {/* Overall rating and review count */}
                            <div className='border-r-[3px] border-[#e3e3e3] p-2.5 space-y-5'>
                                <div className="flex items-center gap-[5px]">
                                    <p className='font-semibold text-[32px]'>4.8</p>
                                    <IoStarSharp className='text-xl text-[#71BF45]' />
                                </div>
                                <p className="text-[#848484]">(120+ Reviews)</p>
                            </div>
                            {/* Ratings breakdown by stars */}
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

                        {/* Customer photos */}
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

                        {/* Review preview */}
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
            {/* FAQ and similar products section */}
            <div className="space-y-[30px] mx-3 md:mx-10">
                <FAQ />
                <p className="text-2xl font-semibold pt-10">Similar Products</p>
                <div className="flex items-center overflow-x-scroll gap-5 scrollbar-hide">
                    {/* {[...Array(11)].map((_, idx) => (
                        // <Product key={idx} />
                    ))} */}
                </div>
            </div>
        </div>
    )
}

export default Page
