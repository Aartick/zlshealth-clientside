'use client'
import CartButton from '@/components/CartButton'
import { useAppSelector } from '@/lib/hooks'
import Image from 'next/image'
import React from 'react'

function page() {
    const wishlist = useAppSelector((state) => state.wishlistSlice.products)
    let isWishlistEmpty = wishlist.length === 0

    return (
        <div className='flex flex-col items-center space-y-5 p-10'>
            {isWishlistEmpty
                ? <p className="h-96 flex items-center text-[#a8a6a6] text-2xl font-semibold">Sorry! Wishlist is empty. No product found.</p>
                : wishlist.map((product) => {
                    const discountedPrice = product.price - (product.price * product.discount / 100)
                    return (
                        <div
                            key={product._id}
                            className='flex items-center justify-around w-full'
                        >
                            <div className="relative size-20">
                                <Image
                                    src={product.img}
                                    alt={product.name}
                                    fill
                                />
                            </div>
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
                            <CartButton product={product} />
                        </div>
                    )
                })}
        </div>
    )
}

export default page