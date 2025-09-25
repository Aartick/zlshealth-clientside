/**
 * This page represents a multi-step checkout flow with three main stages:
 * 1. Cart Review (Products in cart and wishlist)
 * 2. Shopping Information (Contact + Shipping Address + Delivery options)
 * 3. Payment Method (Payment selection and summary)
 * 
 * Features:
 * - Dynamic step navigation (Cart -> Shopping -> Payment) using `activeButton` state.
 * - Transition animations for smooth appearance of sections.
 * - Discount banner with available offers.
 * - Left section (steps: cart, shopping, payment forms).
 * - Right section (price details, payment methods, coupons).
 * - Gradient underline effects for section headers.
 * 
 */

"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import { BiSolidOffer } from 'react-icons/bi'
import { FiHeart } from 'react-icons/fi'
import { LuPen } from 'react-icons/lu'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'
import { SlArrowDown } from 'react-icons/sl'

const paymentMehods = [
    "/cart/Visa.png",
    "/cart/Mastercard.png",
    "/cart/Stripe.png",
    "/cart/Paypal.png",
    "/cart/ApplePay.png"
]

function Page() {
    const [activeButton, setActiveButton] = useState("cart")

    return (
        <div className='flex flex-col items-center m-10'>

            {/* ================ CHECKOUT PROGRESS BAR ================ */}
            <div className="flex items-center mb-3.5">
                {/* CART BUTTON */}
                <button
                    onClick={() => setActiveButton("cart")}
                    className="flex items-center gap-2.5 transition-all duration-500 ease-out cursor-pointer"
                >
                    {/* Step number */}
                    <p
                        className={`font-extrabold text-sm py-[7px] px-3.5 rounded-[60px] transition-all duration-500 ease-out
                        ${activeButton === "cart"
                                ? "text-white bg-[#71BF45]"
                                : "text-[#848484] bg-[#e3e3e3]"}
                        `}
                    >
                        1
                    </p>
                    {/* Step label */}
                    <p
                        className={`transition-all duration-300 ease-out
                            ${activeButton === "cart"
                                ? "text-bold text-[#71BF45]"
                                : "text-medium text-[#848484]"}
                            `}
                    >
                        Cart
                    </p>
                </button>

                {/* HORIZONTAL BAR */}
                <div className="w-40 h-0.5 mx-2.5 bg-[#e3e3e3] transition-all duration-300 ease-out" />

                {/* SHOPPING BUTTON */}
                <button
                    onClick={() => setActiveButton("shopping")}
                    className="flex items-center gap-2.5 transition-all duration-500 ease-out cursor-pointer"
                >
                    {/* Step number */}
                    <p
                        className={`font-extrabold text-sm py-[7px] px-3.5 rounded-[60px] transition-all duration-500 ease-out
                        ${activeButton === "shopping"
                                ? "text-white bg-[#71BF45]"
                                : "text-[#848484] bg-[#e3e3e3]"}`}
                    >
                        2
                    </p>
                    {/* Step label */}
                    <p
                        className={`transition-all duration-500 ease-out
                            ${activeButton === "shopping"
                                ? "text-bold text-[#71BF45]"
                                : "text-medium text-[#848484]"}
                        `}
                    >
                        Shopping
                    </p>
                </button>

                {/* HORIZONTAL BAR */}
                <div className="w-40 h-0.5 mx-2.5 bg-[#e3e3e3] transition-all duration-500 ease-out" />

                {/* PAYMENT BUTTON */}
                <button
                    onClick={() => setActiveButton("payment")}
                    className="flex items-center gap-2.5 transition-all duration-500 ease-out cursor-pointer"
                >
                    {/* Step number */}
                    <p
                        className={`font-extrabold text-sm py-[7px] px-3.5 rounded-[60px] transition-all duration-500 ease-out
                        ${activeButton === "payment"
                                ? "text-white bg-[#71BF45]"
                                : "text-[#848484] bg-[#e3e3e3]"}`}
                    >
                        3
                    </p>
                    {/* Step label */}
                    <p
                        className={`transition-all duration-500 ease-out
                            ${activeButton === "payment"
                                ? "text-bold text-[#71BF45]"
                                : "text-medium text-[#848484]"}
                        `}
                    >
                        Payment
                    </p>
                </button>
            </div>

            {/* ================ DISCOUNT BANNER ================= */}
            <div className="p-5 rounded-[20px] border-2 border-[#e3e3e3] space-y-3.5 w-full">
                <div className="flex items-center gap-[5px] text-[#71BF45]">
                    <BiSolidOffer />
                    <p className="font-semibold underline decoration-solid decoration-[12.5%]">
                        Available Offers
                    </p>
                </div>

                {/* Offers List */}
                <ul className='space-y-2.5 list-disc font-semibold text-sm pl-5'>
                    <li>
                        10% Instant Discount {" "}
                        <span className="font-normal">
                            on ICICI Bank Credit Card on a minimum spend of ₹1,000. TCA
                        </span>
                    </li>
                    <li>
                        Free Delivery {" "}
                        <span className="font-normal">
                            on all prepaid orders above ₹699.
                        </span>
                    </li>
                </ul>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="space-y-[30px] mt-10">
                <p className="font-semibold text-xl text-center">Your Cart</p>

                <div className="flex gap-3">
                    {/* LEFT SECTION (Dynamic Step Content) */}
                    <div className="flex-2 space-y-[30px]">

                        {/* Cart Section */}
                        {activeButton === "cart" && (
                            <>
                                <div className="p-2.5 border border-[#e3e3e3] rounded-[20px] transition-all duration-500 ease-out opacity-0 translate-y-2 animate-fadeInCart">

                                    {/* HEADERS */}
                                    <div className="grid grid-cols-3 items-center pb-2.5 text-center text-sm font-medium">
                                        <p>Product</p>
                                        <p>Quantity</p>
                                        <p>Price</p>
                                    </div>

                                    {/* Sample Products */}
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <div key={idx}>
                                            {/* Border */}
                                            <div className="border border-[#e3e3e3] mx-3" />

                                            {/* Cart Products */}
                                            <div className="grid grid-cols-3 items-start py-2.5">
                                                <div className="flex gap-3">
                                                    {/* Serial N0. */}
                                                    <p>{idx + 1}.</p>

                                                    {/* Product Image*/}
                                                    <div className="relative w-[96px] h-[93px]">
                                                        <Image
                                                            src="/aboutUs/1.jpg"
                                                            alt="Diavinco"
                                                            fill
                                                            className='rounded-[10px] border-2 border-[#71BF45] object-cover'
                                                        />
                                                    </div>

                                                    {/* Product details */}
                                                    <div className="flex flex-col justify-between font-medium">
                                                        <div>
                                                            <p className='text-sm'>Diavinco</p>
                                                            <p className='text-xs'>Blood sugar tablet</p>
                                                        </div>

                                                        <div className="flex items-center gap-[5px] text-xs">
                                                            <p>Read More</p>
                                                            <SlArrowDown />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Product quantity */}
                                                <div className="flex justify-center">
                                                    <select
                                                        id="quantity"
                                                        className="w-[84px] h-fit border border-[#e3e3e3] rounded-[5px] p-[5px] focus:outline-none"
                                                    >
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                    </select>
                                                </div>

                                                {/* Product Price */}
                                                <div className="flex justify-center items-center gap-4">
                                                    <p className="text-base font-medium">₹1300.00</p>
                                                    <RxCross1 className="text-[#848484] cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>

                                {/* ================ WISHLIST ================ */}
                                <div className="p-2.5 border border-[#e3e3e3] rounded-[20px] transition-all duration-500 ease-out opacity-0 translate-y-2 animate-fadeInCart">

                                    {/* HEADERS */}
                                    <div className="flex items-center justify-between py-3 px-2.5">
                                        <div className="flex items-center gap-3">
                                            <FiHeart className="p-0.5 rounded-[60px] bg-[#71BF45] text-white" />
                                            <p className="font-medium text-sm">Add items from wishlist</p>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <p className="text-sm underline decoration-solid text-[#093C16]">View All</p>
                                            <MdKeyboardArrowRight className='text-xs' />
                                        </div>
                                    </div>

                                    {Array.from({ length: 4 }).map((_, idx) => (
                                        <div key={idx}>
                                            {/* BORDER */}
                                            <div className="border border-[#e3e3e3] mx-3" />

                                            {/* CART PRODUCTS */}
                                            <div className="grid grid-cols-3 items-start py-2.5">
                                                <div className="flex gap-3">
                                                    {/* SERIAL NO. */}
                                                    <p>{idx + 1}.</p>

                                                    {/* PRODUCT IMAGE */}
                                                    <div className="relative w-[96px] h-[93px]">
                                                        <Image
                                                            src="/aboutUs/1.jpg"
                                                            alt='productImg'
                                                            fill
                                                            className='rounded-[10px] border-2 border-[#71BF45] object-cover'
                                                        />
                                                    </div>

                                                    {/* PRODUCT DETAILS */}
                                                    <div className="flex flex-col justify-between font-medium">
                                                        <div>
                                                            <p className='text-sm'>Diavinco</p>
                                                            <p className='text-xs'>Blood Sugar Control Tablet</p>
                                                        </div>

                                                        <div className="flex items-center gap-[5px] text-xs">
                                                            <p className='text-[#093C16]'>Read More</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center">
                                                    <select
                                                        id="quantity"
                                                        className="w-[84px] h-fit border border-[#e3e3e3] rounded-[5px] p-[5px] focus:outline-none"
                                                    >
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                    </select>
                                                </div>

                                                <div className="flex justify-center items-center gap-4">
                                                    <p className="text-base font-medium">₹1,300.00</p>
                                                    <RxCross1 className="text-[#848484] cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </>
                        )}

                        {/* Shopping Section */}
                        {activeButton === "shopping" && (
                            <div
                                className="p-2.5 border-[3px] border-[#e3e3e3] rounded-[20px] transition-all
                                duration-500 ease-out opacity-0 translate-y-2 animate-fadeInCart min-w-60"
                            >
                                <div className="space-y-3">
                                    {/* HEADER */}
                                    <div className="border-b-2 p-2.5 border-[#e3e3e3] font-medium">
                                        Contact Information
                                    </div>

                                    {/* Full Name and Mobile Number Input */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        <div className="flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label htmlFor="fullName" className='font-medium px-2.5'>Full Name *</label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                placeholder='Enter Full Name'
                                                className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none'
                                            />
                                        </div>

                                        <div className="flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label htmlFor="mobileNumber" className='font-medium px-2.5'>Mobile Number *</label>
                                            <input
                                                type="number"
                                                id="mobileNumber"
                                                placeholder='(+91)-'
                                                className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none'
                                            />
                                            <div className="text-xs">*You will receive an OTP for confirmation.</div>
                                        </div>
                                    </div>

                                    {/* Email Input */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        <div className=" flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label
                                                htmlFor="email"
                                                className='font-medium px-2.5'
                                            >
                                                Email{" "}
                                                <span className="text-xs font-normal">
                                                    (Optional, For Order Updates)
                                                </span> *
                                            </label>
                                            <div
                                                className="flex items-center justify-between rounded-[10px] 
                                                border border-[#cdcdcd] p-2.5"
                                            >
                                                <input
                                                    type="email"
                                                    id="email"
                                                    placeholder='Enter email'
                                                    className='focus:outline-none'
                                                />
                                                <p className="text-xs">@gmail.com</p>
                                            </div>
                                        </div>
                                        <div className="" />
                                    </div>

                                    {/* ================ SHIPPING ADDRESS ================ */}
                                    <p className="border-b-2 p-2.5 border-[#e3e3e3] font-medium">
                                        Shipping Address
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        <div className="flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label
                                                htmlFor="streetAddress"
                                                className='font-medium px-2.5'
                                            >
                                                Street Address / House No.
                                            </label>
                                            <input
                                                type="text"
                                                id="streetAddress"
                                                placeholder='Street Address / House No.'
                                                className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none'
                                            />
                                        </div>

                                        <div className=" flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label
                                                htmlFor="streetAddressLine2"
                                                className='font-medium px-2.5'
                                            >
                                                Street Address Line 2
                                            </label>
                                            <input type="text" id="streetAddressLine2" placeholder='Street Address Line 2' className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none' />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        <div className="flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label htmlFor="addressType" className='font-medium px-2.5'>Address Type (Home / Work / Other)</label>
                                            <select id="addressType" className='rounded-[10px] border border-[#cdcdcd] p-3 focus:outline-none'>
                                                <option value="home">Home</option>
                                                <option value="work">Work</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label htmlFor="landmark" className='font-medium px-2.5'>Landmark (Optional)</label>
                                            <input type="text" id="landmark" placeholder='Landmark (Optional)' className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none' />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        <div className="flex-1 flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label htmlFor="cityTown" className='font-medium px-2.5'>City / Town</label>
                                            <input type="text" id="cityTown" placeholder='City / Town' className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none' />
                                        </div>

                                        <div className="flex-1 flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label htmlFor="state" className='font-medium px-2.5'>State</label>
                                            <select id="state" className='rounded-[10px] border border-[#cdcdcd] p-3 focus:outline-none'>
                                                <option value="Delhi">Delhi</option>
                                                <option value="UttarPradesh">Uttar Pradesh</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        <div className=" flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label htmlFor="pincode" className='font-medium px-2.5'>Pincode</label>
                                            <div className="flex items-center justify-between rounded-[10px] border border-[#cdcdcd] p-2.5">
                                                <input type="text" id="pincode" placeholder='Enter PINCODE' className='focus:outline-none' />
                                                <LuPen className="text-xs" />
                                            </div>
                                        </div>
                                        <div className="" />
                                    </div>

                                    {/* BOTTOM OPTIONS */}
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-4">
                                            <p className="relative p-2.5 font-medium">
                                                Delivery Options
                                                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-[#E3E3E3] to-[#ffffff]" />
                                            </p>

                                            <div className="flex items-center gap-1.5">
                                                <input type="checkbox" id="standardDelivery" className='text-[#848484] border-[1.5px]' />
                                                <label htmlFor="standardDelivery" className='text-sm'>Standard Delivery (3-5 Days, Free)</label>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <input type="checkbox" id="expressDelivery" className='text-[#848484] border-[1.5px]' />
                                                <label htmlFor="expressDelivery" className='text-sm'>Express Delivery (1-2 Days, ₹99)</label>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <input type="checkbox" id="scheduleDelivery" className='text-[#848484] border-[1.5px]' />
                                                <label htmlFor="scheduleDelivery" className='text-sm'>Schedule Delivery (Choose Date & Time)</label>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="relative p-2.5 font-medium">
                                                Quick Options
                                                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-[#E3E3E3] to-[#ffffff]" />
                                            </p>

                                            <div className="flex items-center gap-1.5">
                                                <input type="checkbox" id="futureOrders" className='text-[#848484] border-[1.5px]' />
                                                <label htmlFor="futureOrders" className='text-sm'>Save This Address For Future Orders</label>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <input type="checkbox" id="defaultAddress" className='text-[#848484] border-[1.5px]' />
                                                <label htmlFor="defaultAddress" className='text-sm'>Mark As Default Address</label>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <input type="checkbox" id="billingAddress" className='text-[#848484] border-[1.5px]' />
                                                <label htmlFor="billingAddress" className='text-sm'>Same As Billing Address</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Section */}
                        {activeButton === "payment" && (
                            <>
                                <div className="p-2.5 border border-[#e3e3e3] rounded-[20px] transition-all duration-500 ease-out opacity-0 translate-y-2 animate-fadeInCart">
                                    <div className="space-y-3">
                                        {/* HEADER */}
                                        <div className="border-b-2 p-2.5 border-[#e3e3e3] font-medium">
                                            Payment Method
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>


                    {/* RIGHT SECTION */}
                    <div className="flex-1 space-y-[30px]">
                        {/* PRICE DETAILS */}
                        <div className="p-2.5 border border-[#e3e3e3] rounded-[20px]">
                            <div className="flex items-center justify-between border-b-2 border-[#e3e3e3] p-2.5">
                                <p className="font-medium text-sm">
                                    Price Details
                                </p>
                                <p className="font-medium text-sm text-[#71BF45]">
                                    (2 items)
                                </p>
                            </div>

                            <div className="space-y-3 border-b-2 border-[#e3e3e3]">
                                <div className="flex justify-between items-center p-2.5">
                                    <p className="text-sm">Total MRP <span className="text-xs font-normal text-[#71BF45]">(2 items)</span></p>
                                    <p className="text-sm font-medium">₹2,200.00</p>
                                </div>
                                <div className="flex justify-between items-center p-2.5">
                                    <p className="text-sm">Discount on MRP</p>
                                    <p className="text-sm font-medium">-₹0</p>
                                </div>
                                <div className="flex justify-between items-center p-2.5">
                                    <p className="text-sm">Coupon Discount</p>
                                    <p className="text-base font-medium text-[#71BF45]">Apply Coupon</p>
                                </div>
                                <div className="flex justify-between items-center p-2.5">
                                    <p className="text-sm">Delivery Charges</p>
                                    <p className="text-sm font-medium">Free</p>
                                </div>
                                <div className="flex justify-between items-center p-2.5">
                                    <p className="text-sm">Packaging / Handling Fee</p>
                                    <p className="text-sm font-medium">₹20.00</p>
                                </div>
                            </div>

                            <div className="flex justify-between p-2.5">
                                <p className='font-medium'>Total Amount</p>
                                <p className='font-semibold text-[#093C16]'>₹2,200.00</p>
                            </div>

                            <button className="rounded-[10px] py-3 px-2.5 text-white bg-[#093C16] w-full">
                                Place Order
                            </button>

                            <div className="space-y-3">
                                <p className="border-b-2 border-[#e3e3e3] p-2.5">Payment Method</p>
                                <div className="py-2.5 px-5 flex items-center gap-[25px]">
                                    {paymentMehods.map((img, idx) => (
                                        <Image
                                            key={idx}
                                            src={img}
                                            alt={`payment-method-${idx + 1}`}
                                            width="60"
                                            height="60"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* COUPONS */}
                        <div className="p-2.5 border border-[#e3e3e3] rounded-[20px]">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm text-[#848484]">Coupons</p>
                                    <div className="flex items-center gap-2.5">
                                        <p className="text-sm underline decoration-solid text-[#093C16]">View All</p>
                                        <MdKeyboardArrowRight className='text-xs' />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-[5px] border-2 border-[#e3e3e3] rounded-[5px]">
                                    <input type="text" placeholder='Enter Code' required className='text-xs font-medium text-[#848484] focus:outline-none w-fit' />
                                    <button className="py-2 px-6 bg-[#71BF45] text-[#093C16] border-2 border-[#71BF45] rounded-[5px]">Apply</button>
                                </div>

                                <div className="border border-[#e3e3e3]" />

                                <div className="space-y-3">
                                    <div className="border border-[#e3e3e3] p-[5px] rounded-[5px] space-y-[5px]">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-[5px]">
                                                <input type="checkbox" id="coupon1" className='border-[1.5px] border-[#848484] rounded-sm' />
                                                <label htmlFor='coupon1' className="text-sm">HEALTH200</label>
                                            </div>
                                            <p className="font-semibold text-sm text-[#71BF45]">Apply</p>
                                        </div>

                                        <div className="border border-[#e3e3e3] border-dashed" />

                                        <p className="text-xs text-[#848484]">Get ₹200 Off On Orders Above ₹1,500</p>
                                    </div>

                                    <div className="border border-[#e3e3e3] p-[5px] rounded-[5px] space-y-[5px]">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-[5px]">
                                                <input type="checkbox" id="coupon2" className='border-[1.5px] border-[#848484] rounded-sm' />
                                                <label htmlFor='coupon2' className="text-sm">FIRSTBUY</label>
                                            </div>
                                            <p className="font-semibold text-sm text-[#71BF45]">Apply</p>
                                        </div>

                                        <div className="border border-[#e3e3e3] border-dashed" />

                                        <p className="text-xs text-[#848484]">Flat 10% Off On Your 1st Purchase</p>
                                    </div>

                                    <div className="border border-[#e3e3e3] p-[5px] rounded-[5px] space-y-[5px]">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-[5px]">
                                                <input type="checkbox" id="coupon3" className='border-[1.5px] border-[#848484] rounded-sm' />
                                                <label htmlFor='coupon3' className="text-sm">FREESHIP</label>
                                            </div>
                                            <p className="font-semibold text-sm text-[#71BF45]">Apply</p>
                                        </div>

                                        <div className="border border-[#e3e3e3] border-dashed" />

                                        <p className="text-xs text-[#848484]">Free Delivery On Orders Above ₹499</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* SUGGESTED PRODUCTS */}
        </div>
    )
}

export default Page