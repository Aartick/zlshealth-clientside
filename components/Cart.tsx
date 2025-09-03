/**
 * Cart Component
 * 
 * This component displays the user's shopping cart as a slide-in sidebar.
 * It shows all cart items, total quantity, and total price.
 * Users can close the cart, view empty cart state, and proceed to checkout.
 * The cart updates dynamically from the Redux store.
 */

import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import CartItem from "./CartItem";
import { BsCartX } from "react-icons/bs";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

interface CartProps {
    onClose: () => void;
}

function Cart({ onClose }: CartProps) {
    // State for closing animation
    const [isClosing, setIsClosing] = useState(false);
    // Get cart items from Redux store
    const cart = useAppSelector((state) => state.cartSlice.cart)

    // Calculate total items in cart
    let totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
    // Calculate total price of cart
    let totalPrice = cart.reduce(
        (acc, item) => acc + item.price * item.quantity, 0
    )
    // Check if cart is empty
    let isCartEmpty = cart.length === 0

    // Handle close button click with animation
    const handleCloseClick = () => {
        setIsClosing(true);
        setTimeout(onClose, 400);
    };

    return (
        <>
            {/* Overlay and sidebar container */}
            <div className={`fixed inset-0 flex justify-end z-50`}>
                {/* Overlay: closes cart when clicked */}
                <div
                    className={`fixed h-screen inset-0 bg-black transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-50"
                        }`}
                    onClick={handleCloseClick}
                ></div>
                {/* Sidebar panel */}
                <div
                    className={`relative h-screen w-60 sm:w-80 bg-white text-base lg:text-lg transition-transform duration-300 ${isClosing ? "slideOut" : "slideIn"
                        }`}
                >
                    {/* Header: Cart title and close button */}
                    <div className="h-14 flex items-center justify-between bg-[#093C16] text-[#fff] p-2 font-medium">
                        <h3>Shopping Cart</h3>
                        <div className="cursor-pointer" onClick={handleCloseClick}>
                            <AiOutlineClose />
                        </div>
                    </div>
                    {/* Cart content area */}
                    <div className="h-full overflow-y-scroll scrollbar-hide">
                        <div className="h-max text-sm sm:text-base lg:text-lg">
                            {/* Show empty cart message */}
                            {isCartEmpty && (
                                <div className="flex flex-col items-center gap-2 m-5">
                                    <BsCartX className="text-5xl" />
                                    <h4 className="font-semibold">Cart is Empty</h4>
                                </div>
                            )}
                            {/* Show cart items if not empty */}
                            {!isCartEmpty && (
                                <>
                                    <div className="relative mb-36">
                                        {/* Render each cart item */}
                                        {cart.map((product, idx) => (
                                            <CartItem {...product} key={idx} />
                                        ))}
                                    </div>

                                    {/* Cart summary and checkout button */}
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
                                            {/* Proceed to checkout link */}
                                            <Link href="/checkout">
                                                <p className="bg-[#28A745] text-white text-center rounded py-1 cursor-pointer">
                                                    Proceed to Checkout
                                                </p>
                                            </Link>
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
