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
import React, { useEffect, useRef, useState } from 'react'
import { IoStarSharp } from 'react-icons/io5'
import { MdKeyboardArrowRight } from "react-icons/md";
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

import Link from 'next/link';
import Image from 'next/image'
import { useParams } from 'next/navigation';

import FAQ from '@/components/FAQ';
import Product from '@/components/Product';
import CartButton from '@/components/CartButton';
import WishlistButton from '@/components/WishlistButton';
import ProductDescriptionSkeleton from '@/components/ProductDescriptionSkeleton';

import { initialProduct, product } from '@/interfaces/products';
import { axiosClient } from '@/utils/axiosClient';
import ProductDetailsSkeleton from '@/components/ProductDetailsSkeleton';
import CommentText from '@/components/CommentText';

interface IDistribution {
    rating: number;
    count: number;
    percent: number;
}

interface IUser {
    _id: string;
    fullName?: string;
}

interface IRandomReview {
    _id: string;
    rating: number;
    comment: string;
    user: IUser;
}

interface IReviewResponse {
    randomReview: IRandomReview;
    totalReviews: number;
    distribution: IDistribution[];
}

const initialReviewData: IReviewResponse = {
    randomReview: {
        _id: "",
        rating: 0,
        comment: "",
        user: {
            _id: "",
            fullName: ""
        },
    },
    totalReviews: 0,
    distribution: [
        { rating: 5, count: 0, percent: 0 },
        { rating: 4, count: 0, percent: 0 },
        { rating: 3, count: 0, percent: 0 },
        { rating: 2, count: 0, percent: 0 },
        { rating: 1, count: 0, percent: 0 },
    ],
};

function Page() {
    // State to hold product details
    const [product, setProduct] = useState<product>(initialProduct)
    // Store selecte image
    const [selectedImage, setSelectedImage] = useState(product.descriptionImg.url)
    const [loading, setLoading] = useState(true)

    // State to hold product rating data
    const [reviewData, setReviewData] = useState<IReviewResponse>(initialReviewData);

    // State to hold similar products array
    const [similarProducts, setSimilarProducts] = useState<product[]>([])

    // Get product ID from URL params
    const params = useParams()

    // Calculate discounted price
    const discountedPrice = (product.price - (product.price * product.discount / 100)).toFixed(2);

    // Fetch similar products
    const getSimilarProducts = async () => {
        try {
            const response = await axiosClient.get(`/api/products/similarProducts?productId=${params.id}`)
            setSimilarProducts(response.data.result)
        } catch {

        }
    }

    // Fetch product details
    const getDetails = async () => {
        try {
            // Fetch product data from backend
            const details = await axiosClient.get(`/api/products?type=productId&id=${params.id}`)
            setProduct(details.data.result)
            setSelectedImage(details.data.result.descriptionImg.url)
        } catch { }
        finally {
            setLoading(false)
        }
    }

    // Fetch product review details 
    const getReview = async () => {
        try {
            const review = await axiosClient.get(`/api/products/review?id=${params.id}`)
            setReviewData(review.data.result)
        } catch {

        }
    }

    // On mount get product details and similar products
    useEffect(() => {
        getDetails()
        getReview()
        getSimilarProducts()
    }, [params.id])

    const thumbnails = [
        product.descriptionImg.url,
        product.productImg.url,
        product.thirdImg.url,
        product.fourthImg.url,
    ]

    const scrollRef = useRef<HTMLDivElement | null>(null)

    // Function to scroll left
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -300,
                behavior: "smooth"
            })
        }
    }

    // Function to scroll right
    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 300,
                behavior: "smooth"
            })
        }
    }

    return (
        <div className='space-y-5 pb-10 max-w-screen-2xl mx-auto'>

            {/* ================ Product Images And Details ================ */}
            <div className="flex flex-col md:flex-row">
                {/* ====== LEFT COLUMN: Product images ====== */}
                {loading
                    ? <ProductDescriptionSkeleton />
                    : (
                        <div className="flex-1 p-6 sm:py-10 lg:py-6 flex flex-col-reverse md:flex-row items-center md:items-start gap-4">
                            {/* Thumbnail images */}
                            <div className="flex items-center justify-center md:flex-col space-x-3 md:space-x-0 md:space-y-3 
                            overflow-x-auto md:overflow-visible w-full md:w-auto 
                            py-0.5 md:py-0 px-1 md:px-0 scrollbar-hide
                            ">
                                {thumbnails.map((img, i) => (
                                    <div
                                        key={i}
                                        className={`
                                                    flex-shrink-0 cursor-pointer transition-all duration-300 rounded-md
                                                    ${selectedImage === img ? "ring-2 ring-[#71BF45]" : ""}
                                        `}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${i + 1}`}
                                            width={0}
                                            height={0}
                                            sizes="(max-width: 640px) 70px, (max-width: 1024px) 90px, 110px"
                                            className="w-[70px] sm:w-[90px] md:w-[100px] lg:w-[120px] h-[70px] sm:h-[90px] md:h-[100px] lg:h-[120px] rounded-md object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Selected product image */}
                            <div className="md:flex-2 relative w-full h-[300px] sm:h-[350px] md:w-[400px] lg:w-[525px] lg:h-[492px]">
                                {/* Wishlist Heart Button */}
                                <div className="absolute top-3 right-3 z-10">
                                    <WishlistButton product={product} />
                                </div>

                                <Image
                                    src={selectedImage}
                                    fill
                                    alt="DiavincoDescImg"
                                    className="object-cover transition-opacity duration-300 ease-out opacity-0 animate-fadeIn"
                                />
                            </div>
                        </div>
                    )}

                {/* ====== RIGHT COLUMN: Product details and actions ====== */}
                {loading
                    ? <ProductDetailsSkeleton />
                    : <div className="flex-1 px-3 py-3 md:py-10 lg:py-6">
                        <div className="space-y-4 border-b-[3px] border-[#e3e3e3] px-2.5 pb-5">
                            {/* Product name and about */}
                            <div>
                                <p className='font-medium text-2xl'>{product?.name}</p>
                                <p className="text-[#848484]">{product?.about} {product.about && "-"} {product.packSize} {product.form}</p>
                            </div>

                            {/* Product description */}
                            <p className="text-sm text-[#848484]">{product.description}</p>

                            {/* Price, discount, and taxes */}
                            <div>
                                <p className="font-extrabold text-base sm:text-xl">
                                    ₹{discountedPrice}{" "}
                                    {product.discount !== 0 && (
                                        <>
                                            <span className="font-normal text-xs line-through text-[#848484]">
                                                ₹{product?.price ?? 0}
                                            </span>{" "}
                                            <span className="font-medium text-sm text-[#71BF45]">({product?.discount ?? 0}% off)</span>
                                        </>
                                    )}
                                </p>
                                <p className='text-[#71BF45] text-xs'>inclusive of all taxes</p>
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
                            {product.expiryMonths !== 0 && (
                                <p className='font-extrabold text-nowrap md:whitespace-normal md:text-xs text-[#093C16]'>
                                    Expiry:{" "}
                                    <span className="font-medium text-[#848484]">
                                        Best before
                                    </span>{" "}
                                    <span className="font-medium text-[#093C16]">
                                        {product.expiryMonths} months
                                    </span>{" "}
                                    <span className="font-medium text-[#848484]">
                                        from manufacture.
                                    </span>
                                </p>
                            )}

                            {/* Cart and Buy Now buttons */}
                            <div className="flex md:flex-col lg:flex-row items-center gap-3">
                                <div className="w-full"><CartButton product={product} /></div>
                                <button className='rounded-md sm:rounded-[10px] py-[5px] sm:py-3 px-2.5 bg-[#71BF45]/10 border-2 border-[#71BF45] text-[#093C16] text-sm font-semibold w-full'>
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Quick product details section */}
                        <div className="border-b-[3px] border-[#e3e3e3] px-2.5 py-5 space-y-5">
                            <p className="font-medium text-sm text-[#093C16]">Quick Product Details</p>

                            <ul className='space-y-5 text-xs'>
                                {product.category.name && (
                                    <li className='flex items-center space-x-2.5'>
                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.5" d="M3.66992 10C3.66992 6.229 3.66992 4.343 4.84192 3.172C6.01392 2.001 7.89892 2 11.6699 2H13.6699C17.4409 2 19.3269 2 20.4979 3.172C21.6689 4.344 21.6699 6.229 21.6699 10V14C21.6699 17.771 21.6699 19.657 20.4979 20.828C19.3259 21.999 17.4409 22 13.6699 22H11.6699C7.89892 22 6.01292 22 4.84192 20.828C3.67092 19.656 3.66992 17.771 3.66992 14V10Z" stroke="#71BF45" strokeWidth="1.5" />
                                            <path d="M12.6699 6V8M12.6699 8V10M12.6699 8H10.6699M12.6699 8H14.6699M8.66992 14H16.6699M9.66992 18H15.6699" stroke="#71BF45" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <div>
                                            <span className="text-[#093C16] font-semibold">Category:</span>{" "}{product.category.name}
                                        </div>
                                    </li>
                                )}
                                {product.form && (
                                    <li className='flex items-center space-x-2.5'>
                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.8657 5.34184L6.0207 10.1878C5.45048 10.7411 4.99597 11.4022 4.68363 12.1327C4.37129 12.8633 4.20735 13.6486 4.20134 14.4431C4.19534 15.2376 4.3474 16.0253 4.64866 16.7605C4.94993 17.4956 5.39439 18.1636 5.95619 18.7254C6.51799 19.2871 7.1859 19.7316 7.92106 20.0329C8.65623 20.3341 9.44397 20.4862 10.2384 20.4802C11.0329 20.4742 11.8183 20.3102 12.5488 19.9979C13.2793 19.6856 13.9405 19.2311 14.4937 18.6608L19.3387 13.8158C20.443 12.6882 21.0578 11.1705 21.0496 9.59223C21.0414 8.01397 20.4109 6.50269 19.2949 5.38661C18.179 4.27054 16.6678 3.63982 15.0895 3.63143C13.5113 3.62305 11.9934 4.23768 10.8657 5.34184Z" stroke="#71BF45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M17.516 15.6388C15.5823 14.919 13.8495 13.7459 12.463 12.2178C10.9353 10.8312 9.7625 9.09841 9.04297 7.16483M12.676 7.16483C12.9139 6.92521 13.1969 6.73504 13.5087 6.60527C13.8204 6.4755 14.1548 6.40869 14.4925 6.40869C14.8302 6.40869 15.1645 6.4755 15.4763 6.60527C15.788 6.73504 16.071 6.92521 16.309 7.16483" stroke="#71BF45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div>
                                            <span className="text-[#093C16] font-semibold">Form:</span>{" "}{product.form}
                                        </div>
                                    </li>
                                )}
                                {product.packSize && (
                                    <li className='flex items-center space-x-2.5'>
                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.16992 3.5C7.16992 3.10218 7.32796 2.72064 7.60926 2.43934C7.89057 2.15804 8.2721 2 8.66992 2H16.6699C16.8669 2 17.062 2.0388 17.2439 2.11418C17.4259 2.18956 17.5913 2.30005 17.7306 2.43934C17.8699 2.57863 17.9804 2.74399 18.0557 2.92597C18.1311 3.10796 18.1699 3.30302 18.1699 3.5C18.1699 3.69698 18.1311 3.89204 18.0557 4.07403C17.9804 4.25601 17.8699 4.42137 17.7306 4.56066C17.5913 4.69995 17.4259 4.81044 17.2439 4.88582C17.062 4.9612 16.8669 5 16.6699 5H8.66992C8.2721 5 7.89057 4.84196 7.60926 4.56066C7.32796 4.27936 7.16992 3.89782 7.16992 3.5ZM7.21992 8.56C7.36045 8.38525 7.53837 8.24423 7.74058 8.14732C7.9428 8.0504 8.16418 8.00006 8.38842 8H16.9504C17.1748 7.99991 17.3964 8.05018 17.5988 8.1471C17.8012 8.24402 17.9793 8.38512 18.1199 8.56L20.3389 11.3215C20.553 11.588 20.6696 11.9197 20.6694 12.2615V20.5C20.6694 20.8978 20.5114 21.2794 20.2301 21.5607C19.9488 21.842 19.5672 22 19.1694 22H6.16992C5.7721 22 5.39057 21.842 5.10926 21.5607C4.82796 21.2794 4.66992 20.8978 4.66992 20.5V12.2615C4.66976 11.9197 4.78636 11.588 5.00042 11.3215L7.21992 8.56Z" stroke="#71BF45" strokeWidth="2" strokeLinejoin="round" />
                                            <path d="M9.66992 15H15.6699M12.6699 12V18" stroke="#71BF45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div>
                                            <span className="text-[#093C16] font-semibold">Pack size:</span>{" "} {product.packSize} {product.form}
                                        </div>
                                    </li>
                                )}
                                {product.appliedFor && (
                                    <li className='flex items-center space-x-2.5'>
                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.6699 18C18.4047 18 18.1504 18.1054 17.9628 18.2929C17.7753 18.4804 17.6699 18.7348 17.6699 19C17.6699 19.2652 17.5646 19.5196 17.377 19.7071C17.1895 19.8946 16.9351 20 16.6699 20H6.66992C6.40471 20 6.15035 19.8946 5.96282 19.7071C5.77528 19.5196 5.66992 19.2652 5.66992 19V5C5.66992 4.73478 5.77528 4.48043 5.96282 4.29289C6.15035 4.10536 6.40471 4 6.66992 4H11.6699V7C11.6699 7.79565 11.986 8.55871 12.5486 9.12132C13.1112 9.68393 13.8743 10 14.6699 10H17.6699V11C17.6699 11.2652 17.7753 11.5196 17.9628 11.7071C18.1504 11.8946 18.4047 12 18.6699 12C18.9351 12 19.1895 11.8946 19.377 11.7071C19.5646 11.5196 19.6699 11.2652 19.6699 11V8.94C19.6596 8.84812 19.6395 8.75761 19.6099 8.67C19.6144 8.64017 19.6144 8.60983 19.6099 8.58C19.563 8.47655 19.4987 8.38186 19.4199 8.3L13.4199 2.3C13.3381 2.22122 13.2434 2.15697 13.1399 2.11H13.0399C12.9458 2.05893 12.8447 2.02187 12.7399 2H6.66992C5.87427 2 5.11121 2.31607 4.5486 2.87868C3.98599 3.44129 3.66992 4.20435 3.66992 5V19C3.66992 19.7956 3.98599 20.5587 4.5486 21.1213C5.11121 21.6839 5.87427 22 6.66992 22H16.6699C17.4656 22 18.2286 21.6839 18.7912 21.1213C19.3539 20.5587 19.6699 19.7956 19.6699 19C19.6699 18.7348 19.5646 18.4804 19.377 18.2929C19.1895 18.1054 18.9351 18 18.6699 18ZM13.6699 5.41L16.2599 8H14.6699C14.4047 8 14.1504 7.89464 13.9628 7.70711C13.7753 7.51957 13.6699 7.26522 13.6699 7V5.41ZM20.6699 14H18.1699C18.0383 13.9992 17.9079 14.0245 17.786 14.0742C17.6642 14.124 17.5534 14.1973 17.4599 14.29L16.2199 15.54L13.4199 12.34C13.3299 12.2368 13.2195 12.1532 13.0958 12.0944C12.9721 12.0356 12.8377 12.0029 12.7008 11.9982C12.5639 11.9935 12.4275 12.017 12.3 12.0672C12.1726 12.1174 12.0568 12.1932 11.9599 12.29L10.2599 14H8.66992C8.40471 14 8.15035 14.1054 7.96282 14.2929C7.77528 14.4804 7.66992 14.7348 7.66992 15C7.66992 15.2652 7.77528 15.5196 7.96282 15.7071C8.15035 15.8946 8.40471 16 8.66992 16H10.6699C10.8015 16.0008 10.932 15.9755 11.0538 15.9258C11.1757 15.876 11.2865 15.8027 11.3799 15.71L12.6699 14.46L15.4699 17.66C15.5603 17.763 15.6708 17.8463 15.7946 17.9048C15.9185 17.9632 16.053 17.9957 16.1899 18C16.3215 18.0008 16.452 17.9755 16.5738 17.9258C16.6957 17.876 16.8065 17.8027 16.8999 17.71L18.5799 16H20.6699C20.9351 16 21.1895 15.8946 21.377 15.7071C21.5646 15.5196 21.6699 15.2652 21.6699 15C21.6699 14.7348 21.5646 14.4804 21.377 14.2929C21.1895 14.1054 20.9351 14 20.6699 14Z" fill="#71BF45" />
                                        </svg>
                                        <div>
                                            <span className="text-[#093C16] font-semibold">Applied for:</span>{" "}{product.appliedFor}
                                        </div>
                                    </li>
                                )}
                                {product.suitableFor && (
                                    <li className='flex items-center space-x-2.5'>
                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.7716 9.6C10.0608 9.55804 7.98998 7.37884 7.97164 4.8C8.01642 2.11334 10.2124 0.01884 12.7716 0C15.4849 0.1026 17.5523 2.1794 17.5716 4.8C17.5183 7.48878 15.3335 9.5818 12.7716 9.6ZM16.6525 10.5958C20.0643 10.6356 21.7944 13.6284 21.8101 16.6211V24H18.4654L18.4654 17.5149C18.384 17.0666 18.0803 16.9146 17.8021 16.9585C17.5417 16.9997 17.3035 17.2125 17.2909 17.5149V24H7.99752V17.5149C7.92638 17.0882 7.65496 16.9242 7.3909 16.9407C7.10814 16.9585 6.83384 17.1834 6.82304 17.5149V24H3.52944V16.6211C3.50984 13.4316 5.52746 10.6194 8.71218 10.5958H16.6525Z" fill="#71BF45" />
                                        </svg>
                                        <div>
                                            <span className="text-[#093C16] font-semibold">Suitable for:</span>{" "}{product.suitableFor}
                                        </div>
                                    </li>
                                )}
                                {product.safetyNote && (
                                    <li className='flex items-center space-x-2.5'>
                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.66992 14.917V15.5C9.66992 16.6935 10.144 17.8381 10.9879 18.682C11.8319 19.5259 12.9764 20 14.1699 20C15.3634 20 16.508 19.5259 17.3519 18.682C18.1958 17.8381 18.6699 16.6935 18.6699 15.5V13.83C18.0024 13.5941 17.4398 13.1298 17.0816 12.5192C16.7233 11.9086 16.5924 11.191 16.7121 10.4932C16.8318 9.79545 17.1943 9.16246 17.7355 8.70613C18.2768 8.2498 18.962 7.99951 19.6699 7.99951C20.3779 7.99951 21.063 8.2498 21.6043 8.70613C22.1456 9.16246 22.5081 9.79545 22.6277 10.4932C22.7474 11.191 22.6165 11.9086 22.2583 12.5192C21.9 13.1298 21.3374 13.5941 20.6699 13.83V15.5C20.6699 17.2239 19.9851 18.8772 18.7661 20.0962C17.5471 21.3152 15.8938 22 14.1699 22C12.446 22 10.7927 21.3152 9.57373 20.0962C8.35474 18.8772 7.66992 17.2239 7.66992 15.5V14.917C6.27168 14.6807 5.00233 13.9567 4.08705 12.8736C3.17177 11.7904 2.6697 10.4181 2.66992 9V4C2.66992 3.46957 2.88064 2.96086 3.25571 2.58579C3.63078 2.21071 4.13949 2 4.66992 2H5.66992C5.93514 2 6.18949 2.10536 6.37703 2.29289C6.56457 2.48043 6.66992 2.73478 6.66992 3C6.66992 3.26522 6.56457 3.51957 6.37703 3.70711C6.18949 3.89464 5.93514 4 5.66992 4H4.66992V9C4.66992 10.0609 5.09135 11.0783 5.84149 11.8284C6.59164 12.5786 7.60906 13 8.66992 13C9.73079 13 10.7482 12.5786 11.4983 11.8284C12.2485 11.0783 12.6699 10.0609 12.6699 9V4H11.6699C11.4047 4 11.1504 3.89464 10.9628 3.70711C10.7753 3.51957 10.6699 3.26522 10.6699 3C10.6699 2.73478 10.7753 2.48043 10.9628 2.29289C11.1504 2.10536 11.4047 2 11.6699 2H12.6699C13.2004 2 13.7091 2.21071 14.0841 2.58579C14.4592 2.96086 14.6699 3.46957 14.6699 4V9C14.6701 10.4181 14.1681 11.7904 13.2528 12.8736C12.3375 13.9567 11.0682 14.6807 9.66992 14.917ZM19.6699 12C19.9351 12 20.1895 11.8946 20.377 11.7071C20.5646 11.5196 20.6699 11.2652 20.6699 11C20.6699 10.7348 20.5646 10.4804 20.377 10.2929C20.1895 10.1054 19.9351 10 19.6699 10C19.4047 10 19.1504 10.1054 18.9628 10.2929C18.7753 10.4804 18.6699 10.7348 18.6699 11C18.6699 11.2652 18.7753 11.5196 18.9628 11.7071C19.1504 11.8946 19.4047 12 19.6699 12Z" fill="#71BF45" />
                                        </svg>
                                        <div>
                                            <span className="text-[#093C16] font-semibold">Safety:</span>{" "}{product.safetyNote}
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>


                    </div>
                }
            </div>

            {/* ================ FAQ's, Customer Reviews And Similar Products ================ */}

            <FAQ />

            {/* ====== Ratings And Customer Photos Section ====== */}
            <div className="p-6 flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center">
                {/* Ratings Section */}
                <section className='lg:flex-1 space-y-5 lg:pr-[270px] lg:border-r-4 border-[#E3E3E3]'>
                    {/* Reviews */}
                    <div className='space-y-3'>
                        <p className="font-medium text-sm text-[#093C16]">Ratings</p>

                        <div className="px-2.5 flex items-center gap-2.5">
                            {/* Overall rating and review count */}
                            <div className='border-r-[3px] border-[#e3e3e3] p-2.5 space-y-5'>
                                <div className="flex items-center gap-[5px]">
                                    <p className='font-semibold text-[32px]'>{product.averageRating}</p>
                                    <IoStarSharp className='text-xl text-[#71BF45]' />
                                </div>
                                <p className="text-[#848484] text-nowrap">
                                    ({product.numReviews > 120
                                        ? `${product.numReviews}+`
                                        : product.numReviews}{" "}
                                    {product.numReviews > 9
                                        ? "Reviews" : "Review"})
                                </p>
                            </div>
                            {/* Ratings breakdown by stars */}
                            <div className="py-2.5 space-y-2.5">
                                {reviewData.distribution.map((item, index) => (
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
                    </div>

                    {/* Customer photos */}
                    {/* <div className='space-y-3'>
                        <p className="font-medium text-sm text-[#093C16]">Customer Photos (8)</p>
                        <div className="flex items-center gap-3">
                            <Image
                                src="/DiavincoHand.png"
                                width={60}
                                height={60}
                                className='rounded-[10px]'
                                alt='reviewPhotos'
                            />
                            <Image
                                src="/DiavincoHand.png"
                                width={60}
                                height={60}
                                className='rounded-[10px]'
                                alt='reviewPhotos'
                            />
                            <Image
                                src="/DiavincoHand.png"
                                width={60}
                                height={60}
                                className='rounded-[10px]'
                                alt='reviewPhotos'
                            />
                            <Image
                                src="/DiavincoHand.png"
                                width={60}
                                height={60}
                                className='rounded-[10px]'
                                alt='reviewPhotos'
                            />
                        </div>
                    </div> */}
                </section>

                {/* Review preview */}
                <section className="lg:flex-1 space-y-5 lg:pl-40">
                    <div className="flex justify-between w-full items-center">
                        <p className='font-medium text-sm text-[#093C16]'>
                            {product.numReviews > 9
                                ? "Reviews" : "Review"} {" "}
                            ({product.numReviews > 120
                                ? `${product.numReviews}+`
                                : product.numReviews})
                        </p>
                        <Link href="/productDescription" className='flex items-center gap-[5px] text-xs'>
                            <p className='underline decoration-solid text-[#093C16]'>View all reviews</p>
                            <MdKeyboardArrowRight />
                        </Link>
                    </div>
                    <div className="space-y-1.5 text-xs">
                        <CommentText text={reviewData.randomReview.comment} />
                        <div className="flex items-center pr-2.5 ">
                            <p className="pr-2.5 font-medium text-xs text-[#71BF45]">
                                {reviewData.randomReview?.user.fullName}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* ======== Similar Products Section ======== */}
            <div className="space-y-[30px] px-3 md:px-6">
                {/* Similar products heading and scrolling buttons */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Others Also Buy</h2>
                    <div className="flex items-center gap-3">
                        {/* Left Button */}
                        <div
                            onClick={scrollLeft}
                            className='border-2 border-[#093C16] text-[#093C16] hover:text-white hover:bg-[#093C16] rounded-full p-2.5 cursor-pointer'
                        >
                            <SlArrowLeft />
                        </div>

                        {/* Right Button */}
                        <div
                            onClick={scrollRight}
                            className='border-2 border-[#093C16] text-[#093C16] hover:text-white hover:bg-[#093C16] rounded-full p-2.5 cursor-pointer'
                        >
                            <SlArrowRight />
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                <div
                    ref={scrollRef}
                    className="flex scroll-smooth
                    overflow-x-auto gap-5 scrollbar-hide"
                >
                    {similarProducts.map((product) => (
                        <div
                            className='w-[200px] sm:w-[250px] md:w-[300px] shrink-0'
                            key={product._id}
                        >
                            <Product product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page
