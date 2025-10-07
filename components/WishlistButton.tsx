/**
 * WishlistButton Component
 * 
 * This component renders a heart icon button for adding/removing a product from the user's wishlist.
 * The icon is filled if the product is in the wishlist, and outlined if not.
 * Clicking toggles the product's wishlist status using Redux actions.
 *
 * Props:
 * - product {ProductType}: The product object to add/remove from wishlist.
 *
 * State/Derived:
 * - isInWishlist {boolean}: Whether the product is currently in the wishlist.
 *
 * Usage:
 * - Used on product cards and product detail pages for quick wishlist actions.
 */

import { product } from '@/interfaces/products';
import { addToWishlistGuest, removeFromWishlistGuest } from '@/lib/features/wishlistSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addToWishlist, removeFromWishlist } from '@/lib/thunks/wishlistThunks';
import { getItem, KEY_ACCESS_TOKEN } from '@/utils/localStorageManager';
import React from 'react'
import { BsSuitHeart, BsSuitHeartFill } from 'react-icons/bs';

interface ProductProps {
    product: product
}

function WishlistButton({ product }: ProductProps) {

    // Check if user is logged in 
    const isUser = getItem(KEY_ACCESS_TOKEN)

    // Get Redux dispatch function
    const dispatch = useAppDispatch()
    // Get wishlist products from Redux store
    const wishlist = useAppSelector((state) => state.wishlistSlice.products)
    // Check if product is in wishlist
    const isInWishlist = wishlist.some((prod) => prod._id === product._id)

    // Toggle wishlist status for this product
    const toggleFavorite = () => {
        if (isInWishlist) {
            // Remove from wishlist
            if (isUser) {
                dispatch(removeFromWishlist({ productId: product._id }))
            } else {
                dispatch(removeFromWishlistGuest(product._id))
            }

        } else {
            // Add to wishlist
            if (isUser) {
                dispatch(addToWishlist({ productId: product._id }))
            } else {
                dispatch(addToWishlistGuest({
                    _id: product._id,
                    category: product.category.name,
                    productTypes: product.productTypes,
                    benefits: product.benefits,
                    name: product.name,
                    img: product.productImg.url,
                    price: product.price,
                    quantity: 1,
                    about: product.about,
                    discount: product.discount
                }))
            }

        }
    }

    return (
        // Heart icon button, filled if in wishlist, outlined if not
        <div
            onClick={toggleFavorite}
            className="rounded-[30px] p-[10px] bg-[#ffffff] text-[18px] sm:text-2xl cursor-pointer transform transition-transform duration-300 hover:scale-110"
        >
            {isInWishlist ? (
                // Filled heart icon for wishlist
                <BsSuitHeartFill className="text-red-500 transition-all duration-300 transform scale-110" />
            ) : (
                // Outlined heart icon for not in wishlist
                <BsSuitHeart className="text-[#2e2e2e] transition-all duration-300 transform scale-100" />
            )}
        </div>
    )
}

export default WishlistButton