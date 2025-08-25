"use client"

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { BsSuitHeart, BsSuitHeartFill } from 'react-icons/bs';
import { IoStarSharp } from 'react-icons/io5';
import CartButton from './CartButton';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addToWishlist, removeFromWishlist } from '@/lib/features/wishlistSlice';
import WishlistButton from './WishlistButton';

interface ProductType {
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

interface ProductProps {
    product: ProductType
}


function Product({ product }: ProductProps) {
    let rating = 3.7

    const discountedPrice = product.price - (product.price * product.discount / 100)

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starNumber = index + 1;
            if (rating >= starNumber) {
                return <IoStarSharp key={index} className="text-[#71BF45]" />;
            } else if (rating >= starNumber - 0.5) {
                return (
                    <span key={index} className="relative inline-block">
                        <IoStarSharp className="text-gray-300" />
                        <IoStarSharp
                            className="text-[#71BF45] absolute top-0 left-0 overflow-hidden"
                            style={{ clipPath: "inset(0 50% 0 0)" }}
                        />
                    </span>
                );
            } else {
                return <IoStarSharp key={index} className="text-gray-300" />;
            }
        });
    };

    return (
        <div
            className="rounded-[10px] sm:rounded-[22px] p-[10px] border-2 border-[#d9d9d9] space-y-[15px]"
        >
            <div className="relative h-[150px] sm:h-[300px]">
                <Image
                    src={product.imageUrl.url}
                    fill
                    alt="productImg"
                    className="border-[3px] border-[#e3e3e3] rounded-[10px] sm:rounded-[20px]"
                />
                {/* Best Seller */}
                <div className="absolute top-5 left-[3px] inline-block">
                    <div
                        className="bg-[#71BF45] text-white text-xs font-bold px-3 py-2"
                        style={{
                            clipPath:
                                'polygon(0 0, 100% 0, calc(100% - 8px) 50%, 100% 100%, 0 100%)'
                        }}
                    >
                        Best Seller
                    </div>
                </div>

                {/* Favorite Icon */}
                <div className="absolute top-3 right-3">
                    <WishlistButton product={product} />
                </div>
            </div>

            {/* Rating */}
            <div className="flex justify-between items-center">
                <p className="flex items-center text-[#848484] font-medium text-xs sm:text-base">
                    <span className="flex items-center text-[#71BF45]">
                        {renderStars()}
                    </span>
                    {rating}
                </p>
                <div className="p-[3px] sm:p-[5px] border">
                    <div className="rounded-full bg-[#71bf45] size-2 sm:size-[10px]"></div>
                </div>
            </div>

            {/* Title */}
            <Link href={`/productDescription/${product._id}`}>
                <p className="font-medium text-base sm:text-2xl">{product.name}</p>
                <p className="font-medium text-xs sm:text-base text-[#848484]">
                    {product.about}
                </p>
            </Link>

            {/* Tags */}
            <div className="flex items-center gap-2.5 overflow-x-scroll scrollbar-hide">
                {product.tags.map((tag) => (
                    <div
                        key={tag}
                        className="border-2 border-[#e3e3e3] py-[5px] px-2.5 rounded-[30px]"
                    >
                        <p className="text-[#093C16] text-nowrap">{tag}</p>
                    </div>
                ))}
            </div>

            <p className="text-[#848484] font-medium">{product.highlights[0]}</p>

            <p className="font-semibold text-base sm:text-2xl text-[#36810B]">
                ₹ {discountedPrice}{" "}
                <span className="font-normal text-xs line-through text-[#848484]">
                    ₹ {product.price}
                </span>{" "}
                <span className="font-medium text-sm text-[#71BF45]">({product.discount}% off)</span>
            </p>

            <CartButton product={product} />
        </div >
    );
}

export default Product