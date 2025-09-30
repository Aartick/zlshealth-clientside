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

import Product from '@/components/Product'
import { Address, initialAddress, statesOfIndia } from '@/interfaces/user'
import { product } from '@/interfaces/products'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { deleteFromCart } from '@/lib/thunks/cartThunks'
import { getMyAddress } from '@/lib/thunks/userThunks'
import { removeFromWishlist } from '@/lib/thunks/wishlistThunks'
import { axiosClient } from '@/utils/axiosClient'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { BiSolidOffer } from 'react-icons/bi'
import { FiHeart } from 'react-icons/fi'
import { LuPen } from 'react-icons/lu'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'
import { SlArrowDown, SlArrowLeft, SlArrowRight } from 'react-icons/sl'

const paymentMehods = [
    "/cart/Visa.png",
    "/cart/Mastercard.png",
    "/cart/Stripe.png",
    "/cart/Paypal.png",
    "/cart/ApplePay.png"
]

function Page() {
    const [activeButton, setActiveButton] = useState("cart")
    const [addresses, setAddresses] = useState<Address>(initialAddress)
    const [futureAddress, setFutureAddress] = useState(false);
    const [billingAddress, setBillingAddress] = useState(false)
    const [similarProducts, setSimilarProducts] = useState<product[]>([])
    const scrollRef = useRef<HTMLDivElement | null>(null)

    // Dispatch items to the cart / appConfig
    const dispatch = useAppDispatch()



    // ================ Cart And Wishlist Logics ================

    // Get cart items from Redux store
    const cart = useAppSelector((state) => state.cartSlice.cart)

    // Calculate total items in cart
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

    // Calculate total price of cart items
    const totalPrice = cart.reduce(
        (acc, item) => acc + item.price * item.quantity, 0
    )

    // Check if cart is empty
    const isCartEmpty = cart.length === 0

    // Get wishlist products from Redux store
    const wishlist = useAppSelector((state) => state.wishlistSlice.products)

    // Check if wishlist is empty
    const isWishlistEmpty = wishlist.length === 0



    // ================ Addresses/Shopping Logics ================
    const address = useAppSelector((state) => state.appConfig.myAddress)

    // Function to fetch user default address from backend
    const getAddresses = async () => {
        try {
            const defaultAddress = address.find((adrs: Address) => adrs.isDefault)
            setAddresses(defaultAddress!)
            if (defaultAddress) setFutureAddress(true)
        } catch { }
    }

    useEffect(() => {
        getAddresses()
    }, [dispatch])

    /**
          * Handles form input changes and updates `addresses` state.
          *
          * @param e - The change event from the input element.
        */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setAddresses({
            ...addresses,
            [name]: type === "checkbox" && "checked" in e.target ? e.target.checked : value
        })
    }

    /**
       * Submits the form to either add a new address or update an existing one.
       * - Removes `_id` if creating a new address.
       * - Sends request to `/api/users/addresses`.
       * - Passes updated addresses back to parent via `onUpdate`.
       *
       * @param e - The form submit event.
    */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Clone form data to avoid mutating state directly
            const payload = { ...addresses }

            // If adding a new address, remove `_id`
            if (!addresses._id) {
                delete payload._id;
            }

            // Send request to backend
            const res = await axiosClient.put(
                `/api/users/addresses`,
                payload
            );

            // Dispatch to update addresses
            await dispatch(getMyAddress())
            toast.success(res.data.result)
        } catch { }
    }



    // ================ Suggested Items Logics ================

    // Function to scroll left
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -300,
                behavior: "smooth"
            })
        }
    }

    // Function to scroll right
    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 300,
                behavior: "smooth"
            })
        }
    }

    useEffect(() => {
        const categories = [...new Set(cart.map(item => item.category))]
        const productTypes = [...new Set(cart.flatMap(item => item.productTypes))]
        const benefits = [...new Set(cart.flatMap(item => item.benefits))]
        const exclude = [...new Set(cart.map(item => item._id))]

        const params = new URLSearchParams();

        categories.forEach(id => params.append("category", id))
        productTypes.forEach(id => params.append("productTypes", id))
        benefits.forEach(id => params.append("benefits", id))
        exclude.forEach(id => params.append("exclude", id))

        const url = `/api/products/similarProducts?${params.toString()}`

        const getSimilarProducts = async () => {
            const response = await axiosClient.get(url);
            setSimilarProducts(response.data.result)
        }

        getSimilarProducts()
    }, [cart])

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

            {/* ================ MAIN CONTENT AREA ================ */}
            <div className="space-y-[30px] my-10">
                <p className="font-semibold text-xl text-center">Your Cart</p>

                <div className="flex gap-3">
                    {/* LEFT SECTION (Dynamic Step Content) */}
                    <div className="flex-2 space-y-[30px]">

                        {/* Cart/Wishlist Section */}
                        {activeButton === "cart" && (
                            <>
                                {/* ================ CART ================ */}
                                <div className="p-2.5 border border-[#e3e3e3] rounded-[20px] transition-all duration-500 ease-out opacity-0 translate-y-2 animate-fadeInCart">

                                    {/* HEADERS */}
                                    <div className="grid grid-cols-3 items-center pb-2.5 text-center text-sm font-medium">
                                        <p>Product</p>
                                        <p>Quantity</p>
                                        <p>Price</p>
                                    </div>

                                    {/* Sample Products */}
                                    {isCartEmpty ?
                                        <div className="text-center border-t border-[#e3e3e3] pt-5 pb-4">
                                            <p className="text-[#848484]">
                                                Cart is empty.
                                            </p>
                                            <Link
                                                href="/products"
                                                className='text-sm underline decoration-[#71BF45] text-[#71BF45]'
                                            >
                                                Add Products
                                            </Link>
                                        </div>
                                        :
                                        cart.map((product, idx) => (
                                            <div key={product._id}>
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
                                                                src={product.img!}
                                                                alt={product.name}
                                                                fill
                                                                className='rounded-[10px] border-2 border-[#71BF45] object-cover'
                                                            />
                                                        </div>

                                                        {/* Product details */}
                                                        <div className="flex flex-col justify-between font-medium">
                                                            <div>
                                                                <p className='text-sm'>{product.name}</p>
                                                                <p className='text-xs'>{product.about}</p>
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
                                                            value={product.quantity}
                                                            className="w-[84px] h-fit border border-[#e3e3e3] rounded-[5px] p-[5px] focus:outline-none"
                                                        >
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                        </select>
                                                    </div>

                                                    {/* Product Price */}
                                                    <div className="flex justify-center items-center gap-4">
                                                        <p className="text-base font-medium">₹{product.price}.00</p>
                                                        <RxCross1
                                                            className="text-[#848484] cursor-pointer"
                                                            onClick={() => dispatch(deleteFromCart({ productId: product._id }))}
                                                        />
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
                                            <div className="p-1 rounded-[60px] bg-[#71BF45] text-white">
                                                <FiHeart />
                                            </div>
                                            <p className="font-medium text-sm">Add items from wishlist</p>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <p className="text-sm underline decoration-solid text-[#093C16]">View All</p>
                                            <MdKeyboardArrowRight className='text-xs' />
                                        </div>
                                    </div>

                                    {isWishlistEmpty ?
                                        <div className="text-center border-t border-[#e3e3e3] pt-5 pb-4">
                                            <p className="text-[#848484]">
                                                Wishlist is empty.
                                            </p>
                                            <Link
                                                href="/products"
                                                className='text-sm underline decoration-[#71BF45] text-[#71BF45]'
                                            >
                                                Add Products
                                            </Link>
                                        </div>
                                        : wishlist.map((product, idx) => (
                                            <div key={product._id}>
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
                                                                src={product.img}
                                                                alt={product.name}
                                                                fill
                                                                className='rounded-[10px] border-2 border-[#71BF45] object-cover'
                                                            />
                                                        </div>

                                                        {/* PRODUCT DETAILS */}
                                                        <div className="flex flex-col justify-between font-medium">
                                                            <div>
                                                                <p className='text-sm'>{product.name}</p>
                                                                <p className='text-xs'>{product.about}</p>
                                                            </div>

                                                            <div className="flex items-center gap-[5px] text-xs">
                                                                <p className='text-[#093C16]'>Read More</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-center">
                                                        <select
                                                            id="quantity"
                                                            value={product.quantity}
                                                            className="w-[84px] h-fit border border-[#e3e3e3] rounded-[5px] p-[5px] focus:outline-none"
                                                        >
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                        </select>
                                                    </div>

                                                    <div className="flex justify-center items-center gap-4">
                                                        <p className="text-base font-medium">₹{product.price}.00</p>
                                                        <RxCross1
                                                            className="text-[#848484] cursor-pointer"
                                                            onClick={() => dispatch(removeFromWishlist({ productId: product._id }))}
                                                        />
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
                                <form className="space-y-3">
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
                                                name='fullName'
                                                id="fullName"
                                                value={addresses.fullName}
                                                onChange={handleChange}
                                                placeholder='Enter Full Name'
                                                className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none'
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label
                                                htmlFor="phone"
                                                className='font-medium px-2.5'>
                                                Mobile Number *
                                            </label>
                                            <input
                                                type="text"
                                                name='phone'
                                                id="phone"
                                                value={addresses.phone}
                                                onChange={handleChange}
                                                placeholder='(+91)-'
                                                className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none'
                                                required
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
                                                    name='email'
                                                    id="email"
                                                    value={addresses.email}
                                                    onChange={handleChange}
                                                    placeholder='Enter email'
                                                    className='focus:outline-none'
                                                />
                                                {!addresses.email && <p className="text-xs">@gmail.com</p>}
                                            </div>
                                        </div>
                                        <div className="" />
                                    </div>

                                    {/* ================ SHIPPING ADDRESS ================ */}

                                    {/* Heading */}
                                    <p className="border-b-2 p-2.5 border-[#e3e3e3] font-medium">
                                        Shipping Address
                                    </p>

                                    {/* Street Addresss inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        {/* Street Address / House No. */}
                                        <div className="flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label
                                                htmlFor="streetAddress"
                                                className='font-medium px-2.5'
                                            >
                                                Street Address / House No.
                                            </label>
                                            <input
                                                type="text"
                                                name="streetAddressHouseNo"
                                                id="streetAddress"
                                                value={addresses.streetAddressHouseNo}
                                                onChange={handleChange}
                                                placeholder='Street Address / House No.'
                                                className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none'
                                            />
                                        </div>

                                        {/* Street Address 2 */}
                                        <div className=" flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label
                                                htmlFor="streetAddressLine2"
                                                className='font-medium px-2.5'
                                            >
                                                Street Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                name='streetAddress2'
                                                id="streetAddressLine2"
                                                value={addresses.streetAddress2}
                                                onChange={handleChange}
                                                placeholder='Street Address Line 2'
                                                className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none'
                                            />
                                        </div>
                                    </div>

                                    {/* Address Type and Landmark inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        {/* Address Type */}
                                        <div className="flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label
                                                htmlFor="addressType"
                                                className='font-medium px-2.5'
                                            >
                                                Address Type (Home / Work / Other)
                                            </label>
                                            <select
                                                id="addressType"
                                                name='addressType'
                                                value={addresses.addressType || "home"}
                                                onChange={handleChange}
                                                className='rounded-[10px] border border-[#cdcdcd] p-3 focus:outline-none'
                                                required
                                            >
                                                <option value="home">Home</option>
                                                <option value="work">Work</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        {/* Landmark */}
                                        <div className="flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label
                                                htmlFor="landmark"
                                                className='font-medium px-2.5'
                                            >
                                                Landmark (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                name='landmark'
                                                id="landmark"
                                                value={addresses.landmark}
                                                onChange={handleChange}
                                                placeholder='Landmark (Optional)'
                                                className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none'
                                            />
                                        </div>
                                    </div>

                                    {/* City/Town and State inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        {/* City input */}
                                        <div className="flex-1 flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label
                                                htmlFor="cityTown"
                                                className='font-medium px-2.5'
                                            >
                                                City / Town
                                            </label>
                                            <input
                                                type="text"
                                                name="cityTown"
                                                id="cityTown"
                                                value={addresses.cityTown}
                                                onChange={handleChange}
                                                placeholder='City / Town'
                                                className='rounded-[10px] border border-[#cdcdcd] p-2.5 focus:outline-none'
                                                required
                                            />
                                        </div>

                                        {/* State input */}
                                        <div className="flex-1 flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label
                                                htmlFor="state"
                                                className='font-medium px-2.5'
                                            >
                                                State
                                            </label>
                                            <select
                                                name='state'
                                                id="state"
                                                value={addresses.state}
                                                onChange={handleChange}
                                                className='rounded-[10px] border border-[#cdcdcd] p-3 focus:outline-none'
                                                required
                                            >
                                                {statesOfIndia.map((state, idx) => (
                                                    <option key={idx} value={state}>
                                                        {state === "" ? "(Select Your State)" : state}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Pincode input */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        {/* Pincode input */}
                                        <div className=" flex flex-col space-y-3 text-sm text-[#848484]">
                                            <label
                                                htmlFor="pincode"
                                                className='font-medium px-2.5'
                                            >
                                                Pincode
                                            </label>
                                            <div
                                                className="flex items-center justify-between rounded-[10px] border border-[#cdcdcd] p-2.5"
                                            >
                                                <input
                                                    type="text"
                                                    name="pinCode"
                                                    id="pincode"
                                                    value={addresses.pinCode}
                                                    onChange={handleChange}
                                                    placeholder='Enter PINCODE'
                                                    className='focus:outline-none'
                                                />
                                                <LuPen className="text-xs" />
                                            </div>
                                        </div>
                                        {/* Empty div */}
                                        <div className="" />
                                    </div>

                                    {/* Delivery and Quick Options */}
                                    <div className="flex items-center justify-between">
                                        {/* Delivery Options */}
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

                                        {/* Quick Options */}
                                        <div className="space-y-4">
                                            <p className="relative p-2.5 font-medium">
                                                Quick Options
                                                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-[#E3E3E3] to-[#ffffff]" />
                                            </p>

                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="checkbox"
                                                    id="futureOrders"
                                                    name='futureOrders'
                                                    checked={futureAddress}
                                                    onChange={() => setFutureAddress(!futureAddress)}
                                                    className='text-[#848484] border-[1.5px]'
                                                />
                                                <label htmlFor="futureOrders" className='text-sm'>Save This Address For Future Orders</label>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="checkbox"
                                                    id="defaultAddress"
                                                    name='isDefault'
                                                    checked={addresses.isDefault}
                                                    onChange={handleChange}
                                                    className='text-[#848484] border-[1.5px]'
                                                />
                                                <label htmlFor="defaultAddress" className='text-sm'>Mark As Default Address</label>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="checkbox"
                                                    id="billingAddress"
                                                    name='billingAddress'
                                                    checked={billingAddress}
                                                    onChange={() => setBillingAddress(!billingAddress)}
                                                    className='text-[#848484] border-[1.5px]'
                                                />
                                                <label htmlFor="billingAddress" className='text-sm'>Same As Billing Address</label>
                                            </div>
                                        </div>
                                    </div>
                                </form>
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
                                    ({totalItems} items)
                                </p>
                            </div>

                            <div className="space-y-3 border-b-2 border-[#e3e3e3]">
                                <div className="flex justify-between items-center p-2.5">
                                    <p className="text-sm">Total MRP <span className="text-xs font-normal text-[#71BF45]">({totalItems} items)</span></p>
                                    <p className="text-sm font-medium">₹{totalPrice}.00</p>
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

                            <button onClick={handleSubmit} className="rounded-[10px] py-3 px-2.5 text-white bg-[#093C16] w-full">
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
            <div className="space-y-[30px] w-full">
                {/* Similar products heading and scrolling buttons */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Others Also Buy</h2>
                    <div className="flex items-center gap-3">
                        {/* Left Button */}
                        <div
                            onClick={scrollLeft}
                            className='border-2 border-[#093C16] text-[#093C16] hover:text-white hover:bg-[#093C16] rounded-full p-2.5 cursor-pointer'
                        >
                            <SlArrowLeft />
                        </div>

                        {/* Right Button */}
                        <div
                            onClick={scrollRight}
                            className='border-2 border-[#093C16] text-[#093C16] hover:text-white hover:bg-[#093C16] rounded-full p-2.5 cursor-pointer'
                        >
                            <SlArrowRight />
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                <div
                    ref={scrollRef}
                    className="flex items-center scroll-smooth
                    overflow-x-auto gap-5 scrollbar-hide"
                >
                    {similarProducts.map((product) => (
                        <div
                            className='w-[300px] shrink-0'
                            key={product._id}
                        >
                            <Product product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page