import React from "react";
import { addToCart, removeFromCart } from "@/lib/features/cartSlice";
import { useAppDispatch } from "@/lib/hooks";
import Image from "next/image";

interface CartItemType {
    _id: string;
    name: string;
    img: string;
    price: number;
    quantity: number;
}

function CartItem({ _id, name, img, price, quantity }: CartItemType) {
    const dispatch = useAppDispatch()

    return (
        <div className="flex items-center gap-2 p-2 sm:p-4 bg-white m-1 border rounded-lg shadow-md">
            <div className="relative size-20">
                <Image
                    src={img}
                    fill
                    alt={name}
                    className="w-full h-full object-contain rounded"
                />
            </div>

            <div className="text-xs">
                <div className="flex justify-between">
                    <p className="font-medium text-[#333]font-semibold w-[120px] sm:w-[160px]">
                        {name}
                    </p>
                    <p className="text-[#777]">{ }</p>
                </div>

                <div className="flex flex-col-reverse mt-2 sm:mt-0 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <p className="text-[#555] mt-2 font-semibold sm:mt-5">₹ {price}</p>
                        <p className="font-semibold text-[#222] mt-2">
                            Subtotal: ₹ {price * quantity}
                        </p>
                    </div>

                    <div className="text-white w-fit bg-[#093C16] rounded">
                        <span
                            className="p-3 cursor-pointer font-medium"
                            onClick={() => dispatch(removeFromCart(_id))}
                        >
                            -
                        </span>
                        <span className="font-medium">{quantity}</span>
                        <span
                            className="p-3 cursor-pointer font-medium"
                            onClick={() =>
                                dispatch(
                                    addToCart({
                                        _id: _id,
                                        name: name,
                                        price: price,
                                        img: img,
                                        quantity: quantity,
                                    })
                                )
                            }
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
