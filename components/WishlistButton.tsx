import { addToWishlist, removeFromWishlist } from '@/lib/features/wishlistSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import React from 'react'
import { BsSuitHeart, BsSuitHeartFill } from 'react-icons/bs';

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

function WishlistButton({ product }: ProductProps) {
    const dispatch = useAppDispatch()
    const wishlist = useAppSelector((state) => state.wishlistSlice.products)
    const isInWishlist = wishlist.some((prod) => prod._id === product._id)

    const toggleFavorite = (e: React.MouseEvent) => {
        if (isInWishlist) {
            dispatch(removeFromWishlist(product._id))
        } else {
            dispatch(addToWishlist({
                _id: product._id,
                name: product.name,
                img: product.imageUrl.url,
                price: product.price,
                discount: product.discount
            }))
        }
    }

    return (
        <div
            onClick={toggleFavorite}
            className="rounded-[30px] p-[10px] bg-[#ffffff] text-[18px] sm:text-2xl cursor-pointer transform transition-transform duration-300 hover:scale-110"
        >
            {isInWishlist ? (
                <BsSuitHeartFill className="text-red-500 transition-all duration-300 transform scale-110" />
            ) : (
                <BsSuitHeart className="text-[#2e2e2e] transition-all duration-300 transform scale-100" />
            )}
        </div>
    )
}

export default WishlistButton