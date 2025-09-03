/**
 * CartItem Component
 * 
 * This component displays a single product item in the shopping cart.
 * It shows the product image, name, price, quantity, and subtotal.
 * Users can increase/decrease quantity or remove the item from the cart.
 * Handles both logged-in users (syncs with backend) and guests (local Redux).
 */

// Import required modules and components
import React from "react";
import { useAppDispatch } from "@/lib/hooks";
import Image from "next/image";
import { addToCart, deleteFromCart, removeFromCart } from "@/lib/thunks/cartThunks";
import { getItem, KEY_ACCESS_TOKEN } from "@/utils/localStorageManager";
import { addToCartGuest, removeFromCartGuest } from "@/lib/features/cartSlice";
import { AiOutlineClose } from "react-icons/ai";

interface CartItemType {
    _id: string;
    name: string;
    img?: string;
    price: number;
    quantity: number;
}

function CartItem({ _id, name, img, price, quantity }: CartItemType) {
    // Check if user is logged in
    const isUser = getItem(KEY_ACCESS_TOKEN)
    const dispatch = useAppDispatch()

    // Add one more of this product to cart
    const handleAddToCart = () => {
        if (isUser) {
            // For logged-in user, update backend
            dispatch(addToCart({
                productId: _id,
                quantity: 1
            }))
        } else {
            // For guest, update Redux cart
            dispatch(addToCartGuest({
                _id,
                name,
                img,
                price,
                quantity: 1
            }))
        }
    }

    // Remove one of this product from cart
    const handleRemoveFromCart = () => {
        if (isUser) {
            // For logged-in user, update backend
            dispatch(removeFromCart({ productId: _id }))
        } else {
            // For guest, update Redux cart
            dispatch(removeFromCartGuest(_id))
        }
    }

    return (
        // Cart item container
        <div className="flex items-center gap-2 p-2 sm:p-4 bg-white m-1 border rounded-lg shadow-md">
            {/* Product image */}
            <div className="relative size-20">
                <Image
                    src={img!}
                    fill
                    alt={name}
                    className="w-full h-full object-contain rounded"
                />
            </div>

            {/* Product details */}
            <div className="text-xs">
                <div className="flex justify-between">
                    {/* Product name */}
                    <p className="font-medium text-[#333]font-semibold w-[120px] sm:w-[160px]">
                        {name}
                    </p>
                    {/* Remove item from cart button */}
                    <p className="text-[#777]" onClick={() => dispatch(deleteFromCart({ productId: _id }))}><AiOutlineClose /></p>
                </div>

                <div className="flex flex-col-reverse mt-2 sm:mt-0 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        {/* Product price */}
                        <p className="text-[#555] mt-2 font-semibold sm:mt-5">₹ {price}</p>
                        {/* Subtotal for this item */}
                        <p className="font-semibold text-[#222] mt-2">
                            Subtotal: ₹ {price * quantity}
                        </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="text-white w-fit bg-[#093C16] rounded">
                        {/* Remove one from cart */}
                        <span
                            className="p-3 cursor-pointer font-medium"
                            onClick={handleRemoveFromCart}
                        >
                            -
                        </span>
                        {/* Current quantity */}
                        <span className="font-medium">{quantity}</span>
                        {/* Add one to cart */}
                        <span
                            className="p-3 cursor-pointer font-medium"
                            onClick={handleAddToCart}
                        >
                            +
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
