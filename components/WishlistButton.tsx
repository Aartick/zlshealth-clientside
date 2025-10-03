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

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addToWishlist, removeFromWishlist } from '@/lib/thunks/wishlistThunks';
import React from 'react'
import { BsSuitHeart, BsSuitHeartFill } from 'react-icons/bs';

interface category {
    _id: string,
    name: string,
    products: string[]
}

// Product interface defines the structure of product objects
interface ProductType {
    _id: string,
    category: category;
    descriptionImg: {
        url: string,
        public_id: string,
    };
    productImg: {
        url: string,
        public_id: string,
    };
    thirdImg: {
        url: string,
        public_id: string,
    };
    fourthImg: {
        url: string,
        public_id: string,
    };
    name: string;
    about: string;
    price: number;
    description: string;
    discount: number;
    stock: number;
    expiryMonths: number,
    form: string,
    packSize: string,
    appliedFor: string;
    suitableFor: string
}

interface ProductProps {
    product: ProductType
}

function WishlistButton({ product }: ProductProps) {
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
            dispatch(removeFromWishlist({ productId: product._id }))
        } else {
            // Add to wishlist
            dispatch(addToWishlist({ productId: product._id }))
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