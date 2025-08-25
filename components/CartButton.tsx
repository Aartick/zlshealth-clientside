import { addToCart, removeFromCart } from '@/lib/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
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
    const dispatch = useAppDispatch()

    const cart = useAppSelector((state) => state.cartSlice.cart)
    const added = cart.some((prod) => prod._id === product._id)
    const cartItem = cart.find((prod) => prod._id === product._id)
    const discountedPrice = product.price - (product.price * product.discount / 100)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            _id: product._id,
            name: product.name,
            img: product?.imageUrl?.url! || product.img!,
            price: discountedPrice,
            quantity: 1
        }))
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
                        onClick={() => dispatch(removeFromCart(product._id))}
                    >
                        -
                    </button>

                    <span className="text-xs sm:text-sm font-semibold">
                        {cartItem?.quantity}
                    </span>

                    <button
                        className='cursor-pointer'
                        onClick={() =>
                            dispatch(
                                addToCart({
                                    _id: product._id,
                                    name: product.name,
                                    img: product?.imageUrl?.url! || product.img!,
                                    price: discountedPrice,
                                    quantity: 1
                                })
                            )
                        }
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    )
}

export default CartButton