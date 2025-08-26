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
    const isUser = getItem(KEY_ACCESS_TOKEN)
    const dispatch = useAppDispatch()

    const cart = useAppSelector((state) => state.cartSlice.cart)
    const added = Array.isArray(cart) && cart.some((prod) => prod._id === product._id)
    const cartItem = cart.find((prod) => prod._id === product._id)

    const handleAddToCart = () => {
        if (isUser) {
            dispatch(addToCart({
                productId: product._id,
                quantity: 1
            }))
        } else {
            dispatch(addToCartGuest({
                _id: product._id,
                name: product.name,
                img: product?.imageUrl?.url || product.img,
                price: product.price,
                quantity: 1
            }))
        }
    }

    const handleRemoveFromCart = () => {
        if (isUser) {
            dispatch(removeFromCart({ productId: product._id }))
        } else {
            dispatch(removeFromCartGuest(product._id))
        }
    }

    return (
        <div>
            {!added && (
                <button
                    onClick={handleAddToCart}
                    className="bg-[#093C16] rounded-md sm:rounded-[10px] py-[5px] sm:py-3 px-[10px] text-[#ffffff] font-semibold text-base w-full cursor-pointer">
                    Add To Cart
                </button>
            )}

            {added && (
                <div className="flex items-center justify-around gap-2 bg-[#093C16] py-[5px] sm:py-3 px-[10px] text-[#ffffff] font-semibold text-base rounded-md sm:rounded-[10px]">
                    <button
                        className='cursor-pointer'
                        onClick={handleRemoveFromCart}
                    >
                        -
                    </button>

                    <span className="text-xs sm:text-sm font-semibold">
                        {cartItem?.quantity}
                    </span>

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