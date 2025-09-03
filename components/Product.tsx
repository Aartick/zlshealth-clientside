/**
 * Product Component
 * Displays a single product card in a product grid or list.
 *
 * Props:
 * - product {ProductType}: The product object to display.
 *
 * State/Derived:
 * - rating {number}: Hardcoded product rating for display.
 * - discountedPrice {number}: Price after applying discount.
 *
 * Functions:
 * - renderStars: Renders star icons based on rating.
 *
 * Usage:
 * - Shows product image, name, about, tags, highlights, rating, price (with discount), and "Best Seller" badge.
 * - Users can add the product to their cart or wishlist directly from the card.
 * - Clicking the product name navigates to the product description page.
 */

"use client"

import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { IoStarSharp } from 'react-icons/io5';
import CartButton from './CartButton';
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
    // Hardcoded rating value for display
    let rating = 3.7

    // Calculate discounted price
    const discountedPrice = product.price - (product.price * product.discount / 100)

    // Render star rating (full, half, empty)
    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starNumber = index + 1;
            if (rating >= starNumber) {
                // Full star
                return <IoStarSharp key={index} className="text-[#71BF45]" />;
            } else if (rating >= starNumber - 0.5) {
                // Half star
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
                // Empty star
                return <IoStarSharp key={index} className="text-gray-300" />;
            }
        });
    };

    return (
        // Product card container
        <div
            className="rounded-[10px] sm:rounded-[22px] p-[10px] border-2 border-[#d9d9d9] space-y-[15px]"
        >
            {/* Product image section */}
            <div className="relative h-[150px] sm:h-[300px]">
                <Image
                    src={product.imageUrl.url}
                    fill
                    alt="productImg"
                    className="border-[3px] border-[#e3e3e3] rounded-[10px] sm:rounded-[20px]"
                />
                {/* Best Seller badge */}
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

                {/* Wishlist (favorite) icon */}
                <div className="absolute top-3 right-3">
                    <WishlistButton product={product} />
                </div>
            </div>

            {/* Rating row */}
            <div className="flex justify-between items-center">
                <p className="flex items-center text-[#848484] font-medium text-xs sm:text-base">
                    <span className="flex items-center text-[#71BF45]">
                        {renderStars()}
                    </span>
                    {rating}
                </p>
                {/* Stock indicator dot */}
                <div className="p-[3px] sm:p-[5px] border">
                    <div className="rounded-full bg-[#71bf45] size-2 sm:size-[10px]"></div>
                </div>
            </div>

            {/* Product title and about, links to product description */}
            <Link href={`/productDescription/${product._id}`}>
                <p className="font-medium text-base sm:text-2xl">{product.name}</p>
                <p className="font-medium text-xs sm:text-base text-[#848484]">
                    {product.about}
                </p>
            </Link>

            {/* Product tags */}
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

            {/* Product highlights */}
            <p className="text-[#848484] font-medium">{product.highlights[0]}</p>

            {/* Price row with discount info */}
            <p className="font-semibold text-base sm:text-2xl text-[#36810B]">
                ₹ {discountedPrice}{" "}
                <span className="font-normal text-xs line-through text-[#848484]">
                    ₹ {product.price}
                </span>{" "}
                <span className="font-medium text-sm text-[#71BF45]">({product.discount}% off)</span>
            </p>

            {/* Add to cart button */}
            <CartButton product={product} />
        </div >
    );
}

export default Product