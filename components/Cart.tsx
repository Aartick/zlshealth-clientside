import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import CartItem from "./CartItem";
import { BsCartX } from "react-icons/bs";
import { useAppSelector } from "@/lib/hooks";

interface CartProps {
    onClose: () => void;
}

function Cart({ onClose }: CartProps) {
    const [isClosing, setIsClosing] = useState(false);
    const cart = useAppSelector((state) => state.cartSlice.cart)

    let totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
    let totalPrice = cart.reduce(
        (acc, item) => acc + item.price * item.quantity, 0
    )
    let isCartEmpty = cart.length === 0

    const handleCloseClick = () => {
        setIsClosing(true);
        setTimeout(onClose, 400);
    };

    return (
        <>
            <div className={`fixed inset-0 flex justify-end z-50`}>
                <div
                    className={`fixed h-screen inset-0 bg-black transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-50"
                        }`}
                    onClick={handleCloseClick}
                ></div>
                <div
                    className={`relative h-screen w-60 sm:w-80 bg-white text-base lg:text-lg transition-transform duration-300 ${isClosing ? "slideOut" : "slideIn"
                        }`}
                >
                    <div className="h-14 flex items-center justify-between bg-[#093C16] text-[#fff] p-2 font-medium">
                        <h3>Shopping Cart</h3>
                        <div className="cursor-pointer" onClick={handleCloseClick}>
                            <AiOutlineClose />
                        </div>
                    </div>
                    <div className="h-full overflow-y-scroll scrollbar-hide">
                        <div className="h-max text-sm sm:text-base lg:text-lg">
                            {isCartEmpty && (
                                <div className="flex flex-col items-center gap-2 m-5">
                                    <BsCartX className="text-5xl" />
                                    <h4 className="font-semibold">Cart is Empty</h4>
                                </div>
                            )}
                            {!isCartEmpty && (
                                <>
                                    <div className="relative mb-36">
                                        {cart.map((product, idx) => (
                                            <CartItem {...product} key={idx} />
                                        ))}
                                    </div>

                                    {cart.length > 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#fff] text-xs font-medium">
                                            <div className="flex justify-between mb-2">
                                                <p>
                                                    Items:{" "}
                                                    <span className="text-sm font-semibold">
                                                        {totalItems}
                                                    </span>
                                                </p>
                                                <p>
                                                    Total: ₹{" "}
                                                    <span className="text-sm font-semibold">
                                                        {totalPrice}
                                                    </span>
                                                </p>
                                            </div>
                                            <p
                                                className="bg-[#28A745] text-white text-center rounded py-1 cursor-pointer"
                                            >
                                                Proceed to Payment
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Cart;
