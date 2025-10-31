"use client"

import CartButton from '@/components/CartButton'
import { convertWishlistToProduct } from '@/interfaces/cartWish'
import { removeFromWishlistGuest } from '@/lib/features/wishlistSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { removeFromWishlist } from '@/lib/thunks/wishlistThunks'
import { getItem, KEY_ACCESS_TOKEN } from '@/utils/localStorageManager'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FiHeart } from 'react-icons/fi'
import { RxCross1 } from 'react-icons/rx'

function Page() {
    // Check if user is logged in
    const isUser = getItem(KEY_ACCESS_TOKEN)

    // Dispatch items to the cart / appConfig
    const dispatch = useAppDispatch()

    const wishlist = useAppSelector((state) => state.wishlistSlice.products)

    // Check if wishlist is empty
    const isWishlistEmpty = wishlist.length === 0

    return (
        <div className="container mx-auto flex items-center justify-center py-10">
            <div className="p-2.5 border border-[#e3e3e3] rounded-[20px] transition-all duration-500 ease-out opacity-0 translate-y-2 animate-fadeInCart">

                {/* HEADERS */}
                <div className="flex items-center justify-between py-3 px-2.5">
                    <div className="flex items-center gap-3">
                        <div className="p-1 rounded-[60px] bg-[#71BF45] text-white">
                            <FiHeart />
                        </div>
                        <p className="font-medium text-sm">Add items from wishlist</p>
                    </div>
                </div>

                {isWishlistEmpty ?
                    <div className="text-center border-t border-[#e3e3e3] pt-5 pb-4">
                        <p className="text-[#848484]">
                            Wishlist is empty.
                        </p>
                        <Link
                            href="/products"
                            className='text-sm underline decoration-[#71BF45] text-[#71BF45]'
                        >
                            Add Products
                        </Link>
                    </div>
                    : wishlist.map((product, idx) => (
                        <div key={product?._id}>
                            {/* BORDER */}
                            <div className="border border-[#e3e3e3] mx-3" />

                            {/* CART PRODUCTS */}
                            <div className="grid grid-cols-3 items-start py-2.5">
                                <div className="flex gap-3">
                                    {/* SERIAL NO. */}
                                    <p>{idx + 1}.</p>

                                    {/* PRODUCT IMAGE */}
                                    <div className="relative w-[96px] h-[93px]">
                                        <Image
                                            src={product?.img}
                                            alt={product?.name}
                                            fill
                                            className='rounded-[10px] border-2 border-[#71BF45] object-cover'
                                        />
                                    </div>

                                    {/* PRODUCT DETAILS */}
                                    <div className="flex flex-col justify-between font-medium">
                                        <div>
                                            <p className='text-sm'>{product?.name}</p>
                                            <p className='text-xs'>{product?.about}</p>
                                        </div>

                                        <div className="flex items-center gap-[5px] text-xs">
                                            <p className='text-[#093C16]'>Read More</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <select
                                        id="quantity"
                                        value={product?.quantity}
                                        className="w-[84px] h-fit border border-[#e3e3e3] rounded-[5px] p-[5px] focus:outline-none"
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>

                                <div className="flex flex-col justify-between h-full">
                                    <div className="flex justify-center items-center gap-4">
                                        <p className="font-medium text-base text-[#093C16]">
                                            ₹{(product?.price - (product?.price * product?.discount) / 100).toFixed(2)}{" "}
                                            <span className="font-normal text-[10px] line-through text-[#848484]">
                                                ₹{(product?.price).toFixed(2)}
                                            </span>{" "}
                                            <span className="font-medium text-[10px] text-[#71BF45]">({product?.discount}% off)</span>
                                        </p>
                                        <RxCross1
                                            className="text-[#848484] cursor-pointer"
                                            onClick={() => isUser
                                                ? dispatch(removeFromWishlist({ productId: product?._id }))
                                                : dispatch(removeFromWishlistGuest(product?._id))
                                            }
                                        />
                                    </div>

                                    <CartButton product={convertWishlistToProduct(product)} />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default Page