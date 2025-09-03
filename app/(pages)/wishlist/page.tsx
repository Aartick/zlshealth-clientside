/**
 * Wishlist Page
 * 
 * This component displays the user's wishlist.
 * It shows all products the user has added to their wishlist, 
 * including product image, name, and discounted price.
 * Users can add wishlist items directly to their cart.
 * If the wishlist is empty, a message is shown.
 */

// Import required modules and components
'use client'
import CartButton from '@/components/CartButton'
import { useAppSelector } from '@/lib/hooks'
import Image from 'next/image'
import React from 'react'

function page() {
    // Get wishlist products from Redux store
    const wishlist = useAppSelector((state) => state.wishlistSlice.products)
    // Check if wishlist is empty
    let isWishlistEmpty = wishlist.length === 0

    return (
        <div className='flex flex-col items-center space-y-5 p-10'>
            {/* Show message if wishlist is empty */}
            {isWishlistEmpty
                ? <p className="h-96 flex items-center text-[#a8a6a6] text-2xl font-semibold">Sorry! Wishlist is empty. No product found.</p>
                // Otherwise, render wishlist products
                : wishlist.map((product) => {
                    // Calculate discounted price
                    const discountedPrice = product.price - (product.price * product.discount / 100)
                    return (
                        <div
                            key={product._id}
                            className='flex items-center justify-around w-full'
                        >
                            {/* Product image */}
                            <div className="relative size-20">
                                <Image
                                    src={product.img}
                                    alt={product.name}
                                    fill
                                />
                            </div>
                            {/* Product details and price */}
                            <div>
                                <p>{product.name}</p>
                                <p className="font-semibold text-base sm:text-2xl text-[#36810B]">
                                    ₹ {discountedPrice}{" "}
                                    <span className="font-normal text-xs line-through text-[#848484]">
                                        ₹ {product.price}
                                    </span>{" "}
                                    <span className="font-medium text-sm text-[#71BF45]">({product.discount}% off)</span>
                                </p>
                            </div>
                            {/* Add to cart button */}
                            <CartButton product={product} />
                        </div>
                    )
                })}
        </div>
    )
}

export default page