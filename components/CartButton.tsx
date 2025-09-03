/**
 * CartButton Component
 * 
 * This component renders an "Add to Cart" button for a product.
 * If the product is already in the cart, it shows quantity controls (+/-).
 * Handles both logged-in users (syncs with backend) and guests (local Redux).
 * Used for adding/removing products from the cart on product cards and lists.
 */

// Import required modules and components
import { addToCartGuest, removeFromCartGuest } from '@/lib/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addToCart, removeFromCart } from '@/lib/thunks/cartThunks';
import { getItem, KEY_ACCESS_TOKEN } from '@/utils/localStorageManager';
import React from 'react'

interface ProductType {
    _id: string,
    imageUrl?: {
        public_id: string,
        url: string
    };
    img?: string;
    name: string;
    price: number;
    discount: number;
}

interface ProductProps {
    product: ProductType
}

function CartButton({ product }: ProductProps) {
    // Check if user is logged in
    const isUser = getItem(KEY_ACCESS_TOKEN)
    const dispatch = useAppDispatch()

    // Get cart items from Redux store
    const cart = useAppSelector((state) => state.cartSlice.cart)
    // Check if product is already in cart
    const added = Array.isArray(cart) && cart.some((prod) => prod._id === product._id)
    // Get cart item details for quantity display
    const cartItem = cart.find((prod) => prod._id === product._id)

    // Add product to cart (handles user/guest)
    const handleAddToCart = () => {
        if (isUser) {
            // For logged-in user, dispatch backend thunk
            dispatch(addToCart({
                productId: product._id,
                quantity: 1
            }))
        } else {
            // For guest, update Redux cart
            dispatch(addToCartGuest({
                _id: product._id,
                name: product.name,
                img: product?.imageUrl?.url || product.img,
                price: product.price,
                quantity: 1
            }))
        }
    }

    // Remove product from cart (handles user/guest)
    const handleRemoveFromCart = () => {
        if (isUser) {
            // For logged-in user, dispatch backend thunk
            dispatch(removeFromCart({ productId: product._id }))
        } else {
            // For guest, update Redux cart
            dispatch(removeFromCartGuest(product._id))
        }
    }

    return (
        <div>
            {/* Show "Add To Cart" button if not in cart */}
            {!added && (
                <button
                    onClick={handleAddToCart}
                    className="bg-[#093C16] rounded-md sm:rounded-[10px] py-[5px] sm:py-3 px-[10px] text-[#ffffff] font-semibold text-base w-full cursor-pointer">
                    Add To Cart
                </button>
            )}

            {/* Show quantity controls if product is in cart */}
            {added && (
                <div className="flex items-center justify-around gap-2 bg-[#093C16] py-[5px] sm:py-3 px-[10px] text-[#ffffff] font-semibold text-base rounded-md sm:rounded-[10px]">
                    {/* Remove one from cart */}
                    <button
                        className='cursor-pointer'
                        onClick={handleRemoveFromCart}
                    >
                        -
                    </button>

                    {/* Show current quantity */}
                    <span className="text-xs sm:text-sm font-semibold">
                        {cartItem?.quantity}
                    </span>

                    {/* Add one to cart */}
                    <button
                        className='cursor-pointer'
                        onClick={handleAddToCart}
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    )
}

export default CartButton