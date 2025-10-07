/**
 * This page represents a user profile and account management interface. 
 * It is structured into multiple sections to allow users to view, edit, and manage
 * their personal information, addresses and account preferences.
 * 
 * 1. Cards Section
 *    * Displays three cards:
 *      - Profile -> Manages personal details, saved addresses, and payment options.
 *      - Orders & Returns -> Allows tracking of purchases, deliveries, and returns.
 *      - Legal -> Provides access to terms , policies, and privacy details. 
 * 
 * 2. Edit Details Form
 *    * Contains input fields for full name, mobile number (with OTP note),
 *      email, date of birth, and gender.
 *    * Includes a section to upload or change the profile picture, with an overlay 
 *      edit icon.
 * 
 * 3. Address Management Section
 *    * Displays Default Address and Other Address with user details (name, address,
 *      phone number).
 *    * Each address block has Edit and Remove options for better management.
 *    * A button is available to Add New Address.
 * 
 */

"use client"
import Addresses from '@/components/Addresses'
import UpdateAddresses from '@/components/Addresses'
import { Order } from '@/interfaces/orders'
import { Address, initialAddress, initialDetails, UserDetails } from '@/interfaces/user'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getMyAddress, getMyInfo } from '@/lib/thunks/userThunks'
import { axiosClient } from '@/utils/axiosClient'
import { formatAddress } from '@/utils/formatAddress'
import { formatDate } from '@/utils/formatDate'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { BsBoxSeam } from 'react-icons/bs'
import { FaGear, FaUser } from 'react-icons/fa6'
import { GoPlus } from 'react-icons/go'
import { HiOutlineUserCircle } from 'react-icons/hi2'
import { LiaTruckMovingSolid } from 'react-icons/lia'
import { LuLogOut } from 'react-icons/lu'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import { SlArrowDown } from 'react-icons/sl'

function Page() {
    // ================ Scroll Events ================
    const [activeButton, setActiveButton] = useState("profile")
    const [activeSection, setActiveSection] = useState<string>("editDetails")

    // Refs for sections
    const editDetailsRef = useRef<HTMLDivElement | null>(null);
    const defaultAddressRef = useRef<HTMLDivElement | null>(null);
    const otherAddressRef = useRef<HTMLDivElement | null>(null);
    const allOrdersRef = useRef<HTMLDivElement | null>(null);
    const trackOrdersRef = useRef<HTMLDivElement | null>(null);
    const termsOfUseRef = useRef<HTMLDivElement | null>(null);
    const privacyPolicyRef = useRef<HTMLDivElement | null>(null);

    const changeCard = (activeCard: string, activeCardSection: string) => {
        setActiveButton(activeCard)
        setActiveSection(activeCardSection)
    }

    const handleScroll = (
        ref: React.RefObject<HTMLDivElement | null>,
        section: string
    ) => {
        setActiveSection(section)
        ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }



    // ================ Adding/Updating/Deleting Addresses ================
    const [editType, setEditType] = useState("")
    const [editAddressId, setEditAddressId] = useState("")
    const [addresses, setAddresses] = useState<Address[]>([])

    const dispatch = useAppDispatch()

    // Get user profile from redux store
    const myAddress = useAppSelector((state) => state.appConfig.myAddress)

    // Function to delete address
    const deleteAddress = async (addressId: string) => {
        try {
            const response = await axiosClient.delete(`/api/users/addresses?addressId=${addressId}`)
            setAddresses(response.data.result.addresses)
            await dispatch(getMyAddress())
            toast.success(response.data.result.message)
        } catch { }
    }

    useEffect(() => {
        setAddresses(myAddress)
    }, [myAddress])

    // Find default address from list
    const defaultAddress = addresses.find(addr => addr.isDefault)
    // Find other addresses form list
    const otherAddresses = addresses.filter(addr => !addr.isDefault)



    // ================ USER PROFILE RELATED LOGICS ================
    const [formData, setFormData] = useState<UserDetails>(initialDetails)
    const [submitting, setSubmitting] = useState<boolean>(false)

    // Get user profile from redux store
    const myProfile = useAppSelector((state) => state.appConfig.myProfile)

    // Handle user details state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            if (fileReader.readyState === FileReader.DONE) {
                setFormData((prev) => ({
                    ...prev,
                    img: fileReader.result as string
                }))
            }
        }
    }

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            const response = await axiosClient.put("/api/users", formData)
            toast.success(response.data.result)
            await dispatch(getMyInfo())
        } catch { }
        finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        setFormData(myProfile!)
    }, [myProfile])


    // =============== ORDERS RELATED LOGICS ================
    const [orders, setOrders] = useState<Order[]>([])
    const [trackOrders, setTrackOrders] = useState<Order[]>([])

    useEffect(() => {
        const getOrders = async () => {
            const response = await axiosClient.get("/api/orders")
            const allOrders = response.data.result;
            const trackingOrders = allOrders.filter(
                (order: Order) =>
                    !["Delivered", "Canceled", "Returned"].includes(order.orderStatus)
            )
            setOrders(allOrders)
            setTrackOrders(trackingOrders)
        }

        if (myProfile.email) getOrders();
    }, [myProfile])

    return (
        <div className='flex gap-8 p-8 h-screen'>
            {/* ================ Sidebar Container ================ */}
            <div className="flex-1 space-y-[60px] border border-[#f4f4f4] rounded-[36px] p-[30px] overflow-y-scroll scrollbar-hide">
                {/* Sidebar Content Wrapper */}
                <div className="space-y-4">
                    {/* Overview Section */}
                    <p className="border-b border-[#e3e3e3] p-2.5 font-medium">Overview</p>

                    {/* Profile Sub-section */}
                    <div className="flex flex-col items-start space-y-3 border-b border-[#e3e3e3] px-2.5 pb-2.5 text-sm">
                        <button
                            className="font-medium"
                            onClick={() => changeCard("profile", "editDetails")}
                        >
                            Profile
                        </button >
                        <button
                            className={`${(activeSection === "editDetails" && activeButton === "profile") ? "text-[#71BF45]" : "text-[#848484]"} 
                            ${activeButton === "profile" ? "cursor-pointer" : "cursor-not-allowed"}
                            `}
                            onClick={() => handleScroll(editDetailsRef, "editDetails")}
                            disabled={activeButton !== "profile"}
                        >
                            Edit Details
                        </button>
                        <button
                            className={`${(activeSection === "defaultAddress" && activeButton === "profile") ? "text-[#71BF45]" : "text-[#848484]"}
                            ${activeButton === "profile" ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={() => handleScroll(defaultAddressRef, "defaultAddress")}
                            disabled={activeButton !== "profile"}
                        >
                            Default Address
                        </button>
                        <button
                            className={`${(activeSection === "otherAddress" && activeButton === "profile") ? "text-[#71BF45]" : "text-[#848484]"}
                            ${activeButton === "profile" ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={() => handleScroll(otherAddressRef, "otherAddress")}
                            disabled={activeButton !== "profile"}
                        >
                            Other Address
                        </button>
                    </div>

                    {/* Orders & Returns Sub-Section */}
                    <div className="flex flex-col items-start space-y-3 border-b border-[#e3e3e3] px-2.5 pb-2.5 text-sm">
                        <button
                            className="font-medium"
                            onClick={() => changeCard("ordersAndReturns", "allOrders")}
                        >
                            Orders & Returns
                        </button>
                        <button
                            className={`${(activeSection === "allOrders" && activeButton === "ordersAndReturns") ? "text-[#71BF45]" : "text-[#848484]"}
                            ${activeButton === "ordersAndReturns" ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={() => handleScroll(allOrdersRef, "allOrders")}
                        >
                            All Orders
                        </button>
                        <button
                            className={`${(activeSection === "trackOrders" && activeButton === "ordersAndReturns") ? "text-[#71BF45]" : "text-[#848484]"}
                            ${activeButton === "ordersAndReturns" ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={() => handleScroll(trackOrdersRef, "trackOrders")}
                        >
                            Track Orders
                        </button>
                    </div>

                    {/* Legal Section */}
                    <div className="flex flex-col items-start space-y-3 border-b border-[#e3e3e3] px-2.5 pb-2.5 text-sm">
                        <button
                            className="font-medium"
                            onClick={() => changeCard("legal", "termsOfUse")}
                        >
                            Legal
                        </button>
                        <button
                            className={`${(activeSection === "termsOfUse" && activeButton === "legal") ? "text-[#71BF45]" : "text-[#848484]"}
                            ${activeButton === "legal" ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={() => handleScroll(termsOfUseRef, "termsOfUse")}
                        >
                            Terms of Use
                        </button>
                        <button
                            className={`${(activeSection === "privacyPolicy" && activeButton === "legal") ? "text-[#71BF45]" : "text-[#848484]"}
                            ${activeButton === "legal" ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={() => handleScroll(privacyPolicyRef, "privacyPolicy")}
                        >
                            Privacy Policy
                        </button>
                    </div>

                    {/* Settings & Help Section */}
                    <div className="space-y-3 border-b border-[#e3e3e3] px-2.5 pb-2.5 text-sm">
                        {/* Settings Item */}
                        <div className="flex items-center gap-2.5 text-[#848484] font-medium">
                            <FaGear />
                            <p>Settings</p>
                        </div>

                        {/* Help & Feedback Item with custom SVG */}
                        <div className="flex items-center gap-2.5 text-[#848484] font-medium">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 1.25C8.26941 1.25 6.57769 1.76318 5.13876 2.72464C3.69983 3.6861 2.57832 5.05267 1.91605 6.65152C1.25379 8.25037 1.08051 10.0097 1.41813 11.707C1.75575 13.4044 2.58911 14.9635 3.81282 16.1872C5.03653 17.4109 6.59563 18.2442 8.29296 18.5819C9.99029 18.9195 11.7496 18.7462 13.3485 18.0839C14.9473 17.4217 16.3139 16.3002 17.2754 14.8612C18.2368 13.4223 18.75 11.7306 18.75 10C18.75 7.67936 17.8281 5.45376 16.1872 3.81282C14.5462 2.17187 12.3206 1.25 10 1.25ZM10 17.5C8.51664 17.5 7.06659 17.0601 5.83322 16.236C4.59985 15.4119 3.63856 14.2406 3.0709 12.8701C2.50325 11.4997 2.35472 9.99168 2.64411 8.53682C2.9335 7.08197 3.64781 5.74559 4.6967 4.6967C5.74559 3.64781 7.08197 2.9335 8.53682 2.64411C9.99168 2.35472 11.4997 2.50325 12.8701 3.0709C14.2406 3.63856 15.4119 4.59985 16.236 5.83322C17.0601 7.06659 17.5 8.51664 17.5 10C17.5 11.9891 16.7098 13.8968 15.3033 15.3033C13.8968 16.7098 11.9891 17.5 10 17.5Z" fill="#848484" />
                                <path d="M10 15.625C10.5178 15.625 10.9375 15.2053 10.9375 14.6875C10.9375 14.1697 10.5178 13.75 10 13.75C9.48223 13.75 9.0625 14.1697 9.0625 14.6875C9.0625 15.2053 9.48223 15.625 10 15.625Z" fill="#848484" />
                                <path d="M10.625 5.00001H9.6875C9.31793 4.99918 8.95183 5.07137 8.61023 5.21242C8.26863 5.35347 7.95825 5.5606 7.69692 5.82193C7.4356 6.08326 7.22846 6.39364 7.08741 6.73524C6.94636 7.07684 6.87418 7.44293 6.875 7.81251V8.12501H8.125V7.81251C8.125 7.39811 8.28962 7.00068 8.58265 6.70765C8.87567 6.41463 9.2731 6.25001 9.6875 6.25001H10.625C11.0394 6.25001 11.4368 6.41463 11.7299 6.70765C12.0229 7.00068 12.1875 7.39811 12.1875 7.81251C12.1875 8.22691 12.0229 8.62434 11.7299 8.91736C11.4368 9.21039 11.0394 9.37501 10.625 9.37501H9.375V12.1875H10.625V10.625C11.3709 10.625 12.0863 10.3287 12.6137 9.80124C13.1412 9.2738 13.4375 8.55843 13.4375 7.81251C13.4375 7.06659 13.1412 6.35122 12.6137 5.82377C12.0863 5.29632 11.3709 5.00001 10.625 5.00001Z" fill="#848484" />
                            </svg>

                            <p>Help & Feedback</p>
                        </div>
                    </div>
                </div>

                {/* Sign Out Button */}
                <div className="flex items-center gap-3 text-[#093C16]">
                    <LuLogOut />
                    <p className="font-medium text-sm">Sign out</p>
                </div>
            </div>

            {/* ================ MAIN CONTENT ================ */}
            <div className="flex-4 space-y-4 border border-[#f4f4f4] rounded-[36px] p-[30px] overflow-y-scroll scrollbar-hide">


                {/* CARDS SECTION (Profile, Orders & Returns, Legal) */}
                <div className="flex items-center gap-3">
                    {/* PROFILE CARD */}
                    <div
                        onClick={() => changeCard("profile", "editDetails")}
                        className={`
                        border ${activeButton === "profile"
                                ? "border-[#71BF45] bg-[#F4FAF0]"
                                : "border-[#E3E3E3]"
                            }
                            p-5 space-y-3 rounded-3xl
                            transition-all duration-500
                            ease-out cursor-pointer
                         `}
                    >
                        {/* Profile Icon */}
                        <div className={`${activeButton === "profile"
                            ? "bg-[#71BF45] text-white"
                            : "border border-[#71BF45] text-[#71BF45]"
                            } p-2.5 rounded-[30px] w-fit`}
                        >
                            <HiOutlineUserCircle size={24} />
                        </div>
                        <p className="text-sm font-medium">
                            Profile
                        </p>
                        <p className="text-xs text-[#848484]">
                            Manage your personal details, addresses,
                            and saved payment options in one place.
                        </p>
                    </div>

                    {/* ORDERS & RETURNS CARD */}
                    <div
                        onClick={() => changeCard("ordersAndReturns", "allOrders")}
                        className={`
                        border ${activeButton === "ordersAndReturns"
                                ? "border-[#71BF45] bg-[#F4FAF0]"
                                : "border-[#E3E3E3]"
                            }
                        p-5 space-y-3 rounded-3xl
                        transition-all duration-500 
                        ease-out cursor-pointer
                        `}
                    >
                        {/* Orders Icon */}
                        <div className={`${activeButton === "ordersAndReturns"
                            ? "bg-[#71BF45]"
                            : "border border-[#71BF45]"
                            } p-2.5 rounded-[30px] w-fit`}
                        >
                            {/* Orders Icon (SVG) */}
                            <svg
                                width="24" height="24"
                                viewBox="0 0 18 23" fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15.5 3.5H2.5C1.94772 3.5 1.5 
                                    3.94772 1.5 4.5V20.5C1.5 21.0523 
                                    1.94772 21.5 2.5 21.5H15.5C16.0523
                                    21.5 16.5 21.0523 16.5 20.5V4.5C16.5 
                                    3.94772 16.0523 3.5 15.5 3.5Z"
                                    stroke={activeButton === "ordersAndReturns"
                                        ? "#FFFFFF"
                                        : "#71BF45"
                                    } strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M6 1.5V4.5M12 1.5V4.5M5 9H13M5 13H11M5 17H9"
                                    stroke={activeButton === "ordersAndReturns"
                                        ? "#FFFFFF"
                                        : "#71BF45"
                                    } strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">
                            Orders & Return
                        </p>
                        <div className="text-xs text-[#848484]">
                            Track your purchases, check delivery status,
                            and manage returns or exchanges easily.
                        </div>
                    </div>

                    {/* LEGAL CARD */}
                    <div
                        onClick={() => changeCard("legal", "termsOfUse")}
                        className={`
                            border ${activeButton === "legal"
                                ? "border-[#71BF45] bg-[#F4FAF0]"
                                : "border-[#E3E3E3]"
                            } 
                            p-5 space-y-3 rounded-3xl 
                            transition-all duration-500 
                            ease-out cursor-pointer
                        `}
                    >
                        {/* Legal Icon */}
                        <div className={`${activeButton === "legal"
                            ? "bg-[#71BF45]"
                            : "border border-[#71BF45]"
                            }
                            p-2.5 rounded-[30px] w-fit`}
                        >
                            <svg
                                width="24" height="24"
                                viewBox="0 0 20 23" fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9.833 11.667C10.888 12.722 
                                    12.278 13.794 12.278 13.794L14.183
                                    11.889C14.183 11.889 13.111 10.499 
                                    12.056 9.444C11.001 8.389 9.611 7.317
                                    9.611 7.317L7.706 9.222C7.706 9.222 
                                    8.778 10.612 9.833 11.667ZM9.833
                                    11.667L6.5 15M14.5 11.571L11.96 
                                    14.111M9.93 7L7.39 9.54"
                                    stroke={activeButton === "legal"
                                        ? "#FFFFFF"
                                        : "#71BF45"
                                    } strokeWidth="1.5"
                                    strokeLinecap="round" strokeLinejoin="round"
                                />
                                <path
                                    d="M19 10.683V7.78C19 6.14 19 5.32 18.596
                                    4.785C18.192 4.25 17.278 3.991 15.451 
                                    3.471C14.349 3.1545 13.2702 2.76258 12.222
                                    2.298C11.023 1.766 10.424 1.5 10 1.5C9.576 
                                    1.5 8.977 1.766 7.778 2.298C6.898 2.688 
                                    5.798 3.116 4.549 3.471C2.722 3.991 1.809 
                                    4.251 1.404 4.785C1 5.32 1 6.14 1 7.78V10.683C1 
                                    16.308 6.063 19.683 8.594 21.019C9.201 21.339 
                                    9.504 21.5 10 21.5C10.496 21.5 10.799 21.34 
                                    11.406 21.02C13.937 19.682 19 16.308 19 10.683Z"
                                    stroke={activeButton === "legal"
                                        ? "#FFFFFF"
                                        : "#71BF45"
                                    } strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">
                            Legal
                        </p>
                        <div className="text-xs text-[#848484]">
                            Review our terms, policies, and privacy guidelines
                            to understand your rights and security.
                        </div>
                    </div>
                </div>



                {/* ================ PROFILE SECTION ================ */}
                {activeButton === "profile" && (
                    <div className='
                          transition-all duration-500 
                          ease-out opacity-0
                          translate-y-2 animate-fadeInCart
                        '
                    >
                        {/* EDIT DETAILS FORM*/}
                        <div ref={editDetailsRef} className="border-b border-[#e3e3e3] space-y-4 py-2.5">
                            <p className="font-semibold text-[#093C16]">
                                Edit Details
                            </p>

                            <form onSubmit={handleSubmit} className="flex justify-between">
                                {/* FORM FIELDS*/}
                                <div className="space-y-4">
                                    <div className="flex gap-6">
                                        {/* FIRST COLUMN */}
                                        <div className="space-y-4">
                                            {/* Full Name Input */}
                                            <div className="flex flex-col space-y-1.5">
                                                <label
                                                    htmlFor='fullName'
                                                    className="text-sm font-medium"
                                                >
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    id="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    className="p-2.5 border border-[#CDCDCD]
                                                rounded-[6px] text-xs text-[#848484] focus:outline-none"
                                                    placeholder='Enter Full Name'
                                                />
                                            </div>

                                            {/* Mobile Number Input */}
                                            <div className="flex flex-col space-y-1.5">
                                                <label
                                                    htmlFor='phone'
                                                    className="text-sm font-medium"
                                                >
                                                    Mobile Number *
                                                </label>
                                                <input
                                                    type="text"
                                                    name='phone'
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="p-2.5 border border-[#CDCDCD] 
                                                rounded-[6px] text-xs text-[#848484] focus:outline-none"
                                                    placeholder='(+91)-'
                                                />
                                                <p className='text-xs text-[#676767]'>
                                                    *You will receive an OTP for confirmation.
                                                </p>
                                            </div>

                                            {/* Email Input */}
                                            <div className="flex flex-col space-y-1.5">
                                                <label
                                                    htmlFor='email'
                                                    className="text-sm font-medium"
                                                >
                                                    Email
                                                    <span className='text-[#71BF45]'>
                                                        {" "}(for order updates)
                                                    </span>
                                                </label>
                                                <div
                                                    className="flex justify-between items-center 
                                                       p-2.5 border border-[#CDCDCD] rounded-[6px]
                                                       text-xs text-[#848484]"
                                                >
                                                    <input
                                                        type="email"
                                                        name='email'
                                                        id="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="focus:outline-none"
                                                        placeholder='Enter Email'
                                                    />
                                                    {!formData.email && <p id='email'>@gmail.com</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECOND COLUMN */}
                                        <div className="space-y-4">
                                            {/* DOB Field */}
                                            <div className="flex flex-col space-y-1.5">
                                                <label
                                                    htmlFor='dob'
                                                    className="text-sm font-medium"
                                                >
                                                    DOB
                                                </label>
                                                <input
                                                    type="date"
                                                    name='dob'
                                                    id="dob"
                                                    value={formData.dob}
                                                    onChange={handleChange}
                                                    className="p-2.5 border border-[#CDCDCD]
                                                rounded-[6px] text-xs text-[#848484] 
                                                focus:outline-none"
                                                    placeholder='(dd/mm/yy)'
                                                />
                                            </div>

                                            {/* Gender Dropdown */}
                                            <div className="flex flex-col space-y-1.5">
                                                <label
                                                    htmlFor='gender'
                                                    className="text-sm font-medium"
                                                >
                                                    Gender
                                                </label>
                                                <select
                                                    name='gender'
                                                    id="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    className="p-2.5 border border-[#CDCDCD]
                                                rounded-[6px] text-xs text-[#848484] 
                                                focus:outline-none"
                                                >
                                                    <option value="">(Select Option)</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        type="submit"
                                        value="Submit"
                                        disabled={submitting}
                                        className={`
                                            py-2 bg-[#71BF45] text-white 
                                            rounded-[6px] w-full hover:opacity-85
                                            ${submitting
                                                ? "cursor-not-allowed opacity-80"
                                                : "cursor-pointer"
                                            }
                                        `}
                                    />
                                </div>

                                {/* PROFILE PICTURE UPLOAD */}
                                <label
                                    htmlFor="img"
                                    className={`relative flex items-center justify-center
                                         ${formData.img ? "border-3 border-[#E3E3E3]" : "p-5"}
                                         bg-[#E3E3E3] w-[150px] h-[150px] rounded-full cursor-pointer`}
                                >
                                    {/* Show uploaded image if available */}
                                    {formData.img ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={formData.img}
                                                fill
                                                alt="l"
                                                className='rounded-full object-cover'
                                            />
                                        </div>
                                    ) : (
                                        < FaUser size={75} className='text-white' />
                                    )}

                                    {/* Edit Icon Overlay */}
                                    <div className="absolute top-1 -right-2 p-2.5 border-3 border-[#E3E3E3] rounded-full bg-white">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.16667 13.8333H3.35417L11.5 5.6875L10.3125 4.5L2.16667 12.6458V13.8333ZM0.5 15.5V11.9583L11.5 0.979167C11.6667 0.826389 11.8508 0.708333 12.0525 0.625C12.2542 0.541667 12.4658 0.5 12.6875 0.5C12.9092 0.5 13.1244 0.541667 13.3333 0.625C13.5422 0.708333 13.7228 0.833333 13.875 1L15.0208 2.16667C15.1875 2.31944 15.3092 2.5 15.3858 2.70833C15.4625 2.91667 15.5006 3.125 15.5 3.33333C15.5 3.55556 15.4619 3.7675 15.3858 3.96917C15.3097 4.17083 15.1881 4.35472 15.0208 4.52083L4.04167 15.5H0.5ZM10.8958 5.10417L10.3125 4.5L11.5 5.6875L10.8958 5.10417Z" fill="#71BF45" />
                                        </svg>
                                    </div>
                                </label>

                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    id='img'
                                    name='img'
                                    accept='image/*'
                                    className='hidden'
                                    onChange={handleFileUpload}
                                />
                            </form>
                        </div>

                        {/* ADDRESS SECTION */}
                        {editType === "newAddress"
                            ?
                            // Open form if user wants to add new address
                            (
                                <div className="py-2 5">
                                    <Addresses
                                        address={initialAddress}
                                        editType={editType}
                                        onCancel={() => setEditType("")}
                                    />
                                </div>
                            )
                            :
                            // Otherwise show addresses if available otherwise "no address" messages
                            (
                                <>
                                    {/* DEFAULT ADDRESS SECTION */}
                                    <div ref={defaultAddressRef} className="border-b border-[#e3e3e3] space-y-4 py-2.5">
                                        {/* Default Address Header */}
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-[#093C16]">Default Address</p>
                                            <button
                                                onClick={() => setEditType("newAddress")}
                                                className='p-2.5 border border-[#71BF45] rounded-[6px] flex items-center gap-1.5 text-[#71BF45] text-sm font-medium cursor-pointer'
                                            >
                                                <GoPlus /> Add New Address
                                            </button>
                                        </div>

                                        {/* DEFAULT ADDRESS CARD */}
                                        {editType === "defaultAddress"
                                            ?
                                            // Open form if user wants to update address
                                            <UpdateAddresses
                                                address={defaultAddress!}
                                                editType={editType}
                                                onCancel={() => setEditType("")}
                                            />
                                            : defaultAddress
                                                ?
                                                // Show default address if available
                                                (
                                                    <div className="space-y-3">
                                                        <p className="font-medium text-sm">{defaultAddress.fullName}</p>
                                                        <div className="flex gap-1.5">
                                                            {/* Home Icon */}
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <g clipPath="url(#clip0_125_504)">
                                                                    <path d="M15.8333 19.9998H4.16667C1.86917 19.9998 0 18.1307 0 15.8332V8.10318C0 6.71568 0.686667 5.42401 1.83667 4.64901L7.66917 0.712344C9.085 -0.242656 10.915 -0.242656 12.3308 0.712344L18.1642 4.64901C19.3133 5.42401 20 6.71484 20 8.10318V15.8332C20 18.1307 18.1308 19.9998 15.8333 19.9998Z" fill="#71BF45" />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_125_504">
                                                                        <rect width="20" height="20" fill="white" />
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                            {/* Address Details */}
                                                            <p className="flex flex-col text-[#848484] text-xs">
                                                                {formatAddress(defaultAddress)}
                                                                <span>{defaultAddress.cityTown} - {defaultAddress.pinCode}</span>
                                                                <span>{defaultAddress.state}</span>
                                                            </p>
                                                        </div>
                                                        {/* Phone Number */}
                                                        <div className='flex items-center gap-2 text-sm font-medium'>
                                                            <p>Phone:</p>
                                                            <p className='text-[#848484]'>{defaultAddress.phone}</p>
                                                        </div>
                                                        {/* Edit & Remove Buttons */}
                                                        <div className="flex items-center gap-1.5">
                                                            {/* Edit Button */}
                                                            <button
                                                                onClick={() => setEditType("defaultAddress")}
                                                                className="flex items-center gap-1.5 border-[0.5px] border-[#848484] p-2.5 rounded-[6px] cursor-pointer"
                                                            >
                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M2.16667 13.8333H3.35417L11.5 5.6875L10.3125 4.5L2.16667 12.6458V13.8333ZM0.5 15.5V11.9583L11.5 0.979167C11.6667 0.826389 11.8508 0.708333 12.0525 0.625C12.2542 0.541667 12.4658 0.5 12.6875 0.5C12.9092 0.5 13.1244 0.541667 13.3333 0.625C13.5422 0.708333 13.7228 0.833333 13.875 1L15.0208 2.16667C15.1875 2.31944 15.3092 2.5 15.3858 2.70833C15.4625 2.91667 15.5006 3.125 15.5 3.33333C15.5 3.55556 15.4619 3.7675 15.3858 3.96917C15.3097 4.17083 15.1881 4.35472 15.0208 4.52083L4.04167 15.5H0.5ZM10.8958 5.10417L10.3125 4.5L11.5 5.6875L10.8958 5.10417Z" fill="#848484" />
                                                                </svg>
                                                                <p className="text-[#848484] font-medium text-sm">Edit</p>
                                                            </button>

                                                            {/* Remove Button */}
                                                            <button
                                                                onClick={() => deleteAddress(defaultAddress._id!)}
                                                                className="flex items-center gap-1.5 border-[0.5px] border-[#848484] p-2.5 rounded-[6px] text-[#848484] cursor-pointer"
                                                            >
                                                                <RxCross2 />
                                                                <p className="font-medium text-sm">Remove</p>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                // Show message if no address available
                                                (
                                                    <p className="text-[#848484] text-center">No address available.</p>
                                                )
                                        }
                                    </div>

                                    {/* OTHER ADDRESS SECTION */}
                                    <div ref={otherAddressRef} className='border-b border-[#e3e3e3] space-y-4 py-2.5'>
                                        {/* OTHER ADDRESS HEADER */}
                                        <p className="font-semibold text-[#093C16]">Other Address</p>

                                        {/* OTHER ADDRESS CARD */}
                                        {editType === "otherAddress"
                                            ? <UpdateAddresses
                                                address={otherAddresses.find(data => data._id === editAddressId)!}
                                                editType={editType}
                                                onCancel={() => setEditType("")}
                                            />
                                            : otherAddresses.length !== 0
                                                ? (
                                                    <>
                                                        {otherAddresses.map((data) => (
                                                            <div className="space-y-3" key={data._id}>
                                                                <p className="font-medium text-sm">{data.fullName}</p>
                                                                <div className="flex gap-1.5">
                                                                    {/* Home Icon */}
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <g clipPath="url(#clip0_125_504)">
                                                                            <path d="M15.8333 19.9998H4.16667C1.86917 19.9998 0 18.1307 0 15.8332V8.10318C0 6.71568 0.686667 5.42401 1.83667 4.64901L7.66917 0.712344C9.085 -0.242656 10.915 -0.242656 12.3308 0.712344L18.1642 4.64901C19.3133 5.42401 20 6.71484 20 8.10318V15.8332C20 18.1307 18.1308 19.9998 15.8333 19.9998Z" fill="#71BF45" />
                                                                        </g>
                                                                        <defs>
                                                                            <clipPath id="clip0_125_504">
                                                                                <rect width="20" height="20" fill="white" />
                                                                            </clipPath>
                                                                        </defs>
                                                                    </svg>
                                                                    {/* Address Details */}
                                                                    <p className="flex flex-col text-[#848484] text-xs">
                                                                        {formatAddress(data)}
                                                                        <span>{data.cityTown} - {data.pinCode}</span>
                                                                        <span>{data.state}</span>
                                                                    </p>
                                                                </div>
                                                                {/* Phone Number */}
                                                                <div className='flex items-center gap-2 text-sm font-medium'>
                                                                    <p>Phone:</p>
                                                                    <p className='text-[#848484]'>{data.phone}</p>
                                                                </div>
                                                                {/* Edit & Remove Buttons */}
                                                                <div className="flex items-center gap-1.5">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditType("otherAddress")
                                                                            setEditAddressId(data._id!)
                                                                        }}
                                                                        className="flex items-center gap-1.5 border-[0.5px] border-[#848484] p-2.5 rounded-[6px] cursor-pointer">
                                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M2.16667 13.8333H3.35417L11.5 5.6875L10.3125 4.5L2.16667 12.6458V13.8333ZM0.5 15.5V11.9583L11.5 0.979167C11.6667 0.826389 11.8508 0.708333 12.0525 0.625C12.2542 0.541667 12.4658 0.5 12.6875 0.5C12.9092 0.5 13.1244 0.541667 13.3333 0.625C13.5422 0.708333 13.7228 0.833333 13.875 1L15.0208 2.16667C15.1875 2.31944 15.3092 2.5 15.3858 2.70833C15.4625 2.91667 15.5006 3.125 15.5 3.33333C15.5 3.55556 15.4619 3.7675 15.3858 3.96917C15.3097 4.17083 15.1881 4.35472 15.0208 4.52083L4.04167 15.5H0.5ZM10.8958 5.10417L10.3125 4.5L11.5 5.6875L10.8958 5.10417Z" fill="#848484" />
                                                                        </svg>
                                                                        <p className="text-[#848484] font-medium text-sm">Edit</p>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteAddress(data._id!)}
                                                                        className="flex items-center gap-1.5 border-[0.5px] border-[#848484] p-2.5 rounded-[6px] text-[#848484] cursor-pointer"
                                                                    >
                                                                        <RxCross2 />
                                                                        <p className="font-medium text-sm">Remove</p>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                )
                                                : (
                                                    <p className="text-[#848484] text-center">No address available.</p>
                                                )
                                        }
                                    </div>
                                </>
                            )
                        }
                    </div>
                )}


                {/* =============== ORDERS AND RETURNS ================ */}
                {activeButton === "ordersAndReturns" && (
                    <section className="px-2.5 space-y-4 transition-all duration-500 ease-out opacity-0 translate-y-2 animate-fadeInCart">
                        {/* All Orders */}
                        <div ref={allOrdersRef} className="space-y-4">
                            <p className="font-semibold text-[#093C16]">All Orders</p>

                            {orders.length === 0 ? (
                                <p className="text-[#848484] text-center">No orders available.</p>
                            ) : (
                                orders.map((order) => (
                                    <div className="space-y-4" key={order._id}>
                                        <div className='font-medium'>
                                            <div className="flex items-center gap-1.5">
                                                {
                                                    order.orderStatus === "Delivered"
                                                        ? <LiaTruckMovingSolid />
                                                        : <BsBoxSeam />
                                                }
                                                <p>{order.orderStatus}</p>
                                            </div>

                                            <p className="pl-6 text-sm text-[#848484]">
                                                On {formatDate(order.orderDate)}
                                            </p>
                                        </div>

                                        <div className="py-2.5 space-y-3">
                                            {/* Products */}
                                            {order.products.map((product, idx) => (
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
                                                                    src={product.imgUrl}
                                                                    alt={product.name}
                                                                    fill
                                                                    className='rounded-[10px] border-2 border-[#71BF45] object-cover'
                                                                />
                                                            </div>

                                                            {/* Product details */}
                                                            <div className="flex flex-col justify-between font-medium">
                                                                <div>
                                                                    <p className='text-sm'>{product.name}</p>
                                                                    <p className='text-xs font-medium text-[#848484]'>{product.about}</p>
                                                                </div>

                                                                <div className="flex items-center gap-[5px] text-xs text-[#093C16]">
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
                                                        <div className="flex justify-between items-center px-5">
                                                            <p className="text-base font-medium text-[#093C16]">₹{product.totalAmount}</p>
                                                            <Link href={`/productDescription/${product._id}`}>
                                                                <MdKeyboardArrowRight className="cursor-pointer text-xl" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Track Orders */}
                        <div ref={trackOrdersRef} className="space-y-4">
                            <p className="font-semibold text-[#093C16]">Track Orders</p>

                            {trackOrders.length === 0 ? (
                                <p className="text-[#848484] text-center">No orders available.</p>
                            ) : (
                                trackOrders.map((order) => (
                                    <div className="space-y-4" key={order._id}>
                                        <div className='font-medium'>
                                            <div className="flex items-center gap-1.5">
                                                <BsBoxSeam />
                                                <p>{order.orderStatus}</p>
                                            </div>

                                            <p className="pl-6 text-sm text-[#848484]">
                                                On {formatDate(order.orderDate)}
                                            </p>
                                        </div>

                                        <div className="py-2.5 space-y-3">
                                            {/* Sample Products */}
                                            {order.products.map((product, idx) => (
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
                                                                    src={product.imgUrl}
                                                                    alt={product.name}
                                                                    fill
                                                                    className='rounded-[10px] border-2 border-[#71BF45] object-cover'
                                                                />
                                                            </div>

                                                            {/* Product details */}
                                                            <div className="flex flex-col justify-between font-medium">
                                                                <div>
                                                                    <p className='text-sm'>{product.name}</p>
                                                                    <p className='text-xs font-medium text-[#848484]'>{product.about}</p>
                                                                </div>

                                                                <div className="flex items-center gap-[5px] text-xs text-[#093C16]">
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
                                                        <div className="flex justify-between items-center px-5">
                                                            <p className="text-base font-medium text-[#093C16]">₹{product.totalAmount}</p>
                                                            <MdKeyboardArrowRight className="cursor-pointer text-xl" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div >
    )
}

export default Page