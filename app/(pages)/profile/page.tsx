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
import { MdChevronRight, MdKeyboardArrowRight } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import { SlArrowDown } from 'react-icons/sl'
import { signOut } from "next-auth/react";
import { KEY_ACCESS_TOKEN, removeItem } from '@/utils/localStorageManager'
import { removeMyInfo } from '@/lib/features/appConfigSlice'
import { resetCart } from '@/lib/features/cartSlice'
import { resetWishlist } from '@/lib/features/wishlistSlice'
import { useRouter, useSearchParams } from 'next/navigation'

function Page() {
    // ================ Scroll Events ================
    const [activeButton, setActiveButton] = useState("profile")
    const [activeSection, setActiveSection] = useState<string>("editDetails")
    const searchParams = useSearchParams();

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

    // On initial load, read query parameters and trigger the behavior
    useEffect(() => {
        const card = searchParams.get("card")
        const section = searchParams.get("activeSection")

        if (card && section) {
            changeCard(card, section);

            setTimeout(() => {
                if (section === "trackOrders") {
                    handleScroll(trackOrdersRef, section)
                }
            }, 300)
        }
    }, [searchParams])



    // ================ Adding/Updating/Deleting Addresses ================
    const [editType, setEditType] = useState("")
    const [editAddressId, setEditAddressId] = useState("")
    const [addresses, setAddresses] = useState<Address[]>([])

    const dispatch = useAppDispatch()
    const router = useRouter();

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

    // ================= Handle logout action ================
    const handleLogout = async () => {
        try {
            if (myProfile.email) {
                const response = await axiosClient.get("/api/auth?type=logout")
                removeItem(KEY_ACCESS_TOKEN)
                dispatch(removeMyInfo())
                dispatch(resetCart())
                dispatch(resetWishlist())
                signOut({ redirect: false })
                toast.success(response.data.result)
                router.back()
            }
        } catch { }
    }


    // ================ Sidebar Logics ================
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className='container mx-auto relative flex gap-8 px-2 py-4 md:p-8 h-screen'>
            {/* ================ Sidebar Container ================ */}
            <div className={`
            bg-white lg:border lg:border-[#f4f4f4] lg:rounded-[36px] p-[30px] overflow-y-scroll scrollbar-hide
                    transition-all duration-500 ease-in-out
                    lg:static lg:w-[300px] lg:opacity-100 lg:translate-x-0
                    absolute left-0 h-full z-30 lg:z-0
                    ${sidebarOpen ? "translate-x-0 w-[300px] opacity-100 shadow-2xl lg:shadow-none" : "-translate-x-full w-[300px] opacity-0"}`}
            >
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
                <div
                    className="flex items-center gap-3 mt-4 text-[#093C16] cursor-pointer"
                    onClick={handleLogout}
                >
                    <LuLogOut />
                    <p className="font-medium text-sm">Sign out</p>
                </div>
            </div>

            {/* ================= Toggle Arrow (Always Visible on Mobile) ================= */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`
                    lg:hidden absolute z-30 lg:z-0
                    bg-white text-2xl text-[#71BF45] shadow-lg rounded-tr-full rounded-br-full p-[0.5px]
                    transition-all duration-500 ease-in-out
                    ${sidebarOpen ? "left-[298px]" : "left-0"}
                `}
            >
                <MdChevronRight
                    className={sidebarOpen ? "rotate-180" : "rotate-0"}
                />
            </button>

            {/* ================ MAIN CONTENT ================ */}
            <div className="flex-4 space-y-4 border border-[#f4f4f4] rounded-[36px] p-[30px] overflow-y-scroll scrollbar-hide">


                {/* CARDS SECTION (Profile, Orders & Returns, Legal) */}
                <div className="flex w-full overflow-x-scroll scrollbar-hide items-center gap-3">
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
                        <p className="text-xs text-[#848484] w-[150px] md:w-[200px] lg:w-fit">
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
                        <div className="text-xs text-[#848484] w-[150px] md:w-[200px] lg:w-fit">
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
                        <div className="text-xs text-[#848484] w-[150px] md:w-[200px] lg:w-fit">
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

                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col-reverse items-center md:items-start gap-4 md:flex-row justify-between"
                            >
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

                                                            <div className="flex flex-col md:flex-row gap-3">
                                                                {/* Product Image*/}
                                                                <div className="relative w-[40px] h-[40px] md:w-[96px] md:h-[93px]">
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
                                                        </div>

                                                        {/* Product quantity */}
                                                        <div className="flex justify-center">
                                                            <select
                                                                id="quantity"
                                                                value={product.quantity}
                                                                className="w-[49px] md:w-[84px] h-fit border border-[#e3e3e3] rounded-[5px] p-[5px] focus:outline-none"
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


                {activeButton === "legal" && (
                    <section
                        className='text-sm px-2.5 space-y-4 transition-all duration-500 ease-out opacity-0 translate-y-2 animate-fadeInCart'
                    >
                        {/* Terms of Use */}
                        <div ref={termsOfUseRef} className='space-y-5'>
                            <p className='font-semibold text-[#093C16] text-base'>Terms And Conditions</p>

                            <p><span className='font-semibold mr-1 text-base'>A.</span>{""}
                                This document is an electronic record in terms of Information
                                Technology Act, 2000 and rules there under as applicable and the
                                amended provisions pertaining to electornic records in various statutes as
                                amended by the Information Technology Act, 2000. This electronic record is
                                generated by a computer system and does not require any physical or
                                digital signatures.
                            </p>

                            <p><span className='font-semibold mr-1 text-base'>B.</span>{""}
                                This document is published in accordance with the provisions of Rule
                                3 (1) of the Information Technology (Intermediaries Guidelines) Rules, 2011
                                that require publishing the rules and regulations, privacy policy and terms
                                of use for access or usage of domain name www.zlshealth.com (&quot;Website&quot;), including
                                the related mobile site and mobile application (hereinafter referred to as &quot;Platform&quot;).
                            </p>

                            <p><span className='font-semibold mr-1 text-base'>C.</span>{" "}
                                The Platform is owned by ZEALOUS HEALTH PRIVATE LIMITED, a
                                company incorporated under the Companies Act, 1956 with its
                                registered office at ZEALOUS HEALTH PRIVATE LIMITED H.No.2-14/2,
                                Survey No.312, Narsingi, Rajendranagar, Rangareddi, Telengana-500089
                                (hereinafter referred to as &quot;Platform Owner&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
                            </p>

                            <p><span className='font-semibold mr-1 text-base'>D.</span>{" "}
                                Your use of the Platform and services and tools are governed by the
                                following terms and conditions (&quot;Terms of Use&quot;) as applicable to the
                                Platform including the applicable policies which are incorporated herein
                                by way of reference. If you transact on the Platform, You shall be subject
                                to the policies that are applicable to the Platform for such transaction. By
                                mere use of the Platform, You shall be contracting with the Platform Owner and these
                                terms and conditions including the policies constitute Your binding obligations, with Platform Owner.
                                These Terms of Use relate to your use of our website, goods (as applicable) or services (as applicable)
                                (collectively, &quot;Services&quot;). Any terms and conditions proposed by You which are in addition
                                to or which conflict with these Terms of Use are expressly rejected by the Platform Owner
                                and shall be of no force or effect. These Terms of Use can be modified at any time without
                                assigning any reason. It is your responsibility to periodically review these Terms of Use
                                to stay informed of updates.
                            </p>

                            <p><span className='font-semibold mr-1 text-base'>E.</span>
                                For the purpose of htese Terms of Use, wherever the context so requires &quot;you&quot;, &quot;your&quot; or
                                &quot;user&quot; shall mean any natural or legal person who has agreed to become a user/buyer on the Platform.
                            </p>

                            <p><span className='font-semibold mr-1 text-base'>F.</span>
                                ACCESSING, BROWSING OR OTHERWISE USING THE PLATFORM INDICATES YOUR AGREEMENT TO ALL THE TERMS
                                AND CONDITIONS UNDER THESE TERMS OF USE, SO PLEASE READ THE TERMS OF USE CAREFULLY BEFORE PROCEEDING.
                            </p>

                            <p><span className='font-semibold mr-1 text-base'>G.</span>
                                The use of Platform and/or availing of our Services is subject to the following
                                Terms of Use:
                            </p>

                            <div className='space-y-2.5 text-xs'>
                                <p><span className='font-semibold'>I.</span> To acces and use the Services, you agree to provide true, accurate
                                    and complete information to us during and after registration, and you
                                    shall be responsible for all acts done through the use of your registered
                                    account on the Platform.
                                </p>

                                <p>
                                    <span className='font-semibold'>II.</span> Neither we nor any third parties provide an warranty or guarantee as
                                    to the accuracy, timeliness, performance, completeness or suitablility of
                                    the information and materials offered on this website or through the Services,
                                    for any specific purpose. You acknowledge that such information and materials may contain
                                    inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors
                                    to the fullest extent permitted by law.
                                </p>
                                <p>
                                    <span className='font-semibold'>III.</span> Your use of our Services and the Platform is solely and entirely at your
                                    own risk and discretion for which we shall not be liable to you in any manner.
                                    You are required to independently assess and ensure that the Services meet your requirements.
                                </p>

                                <p>
                                    <span className='font-semibold'>IV.</span> The contents of the Platform and the Services are proprietary to us
                                    and are licensed to us. You will not have authority to claim any intellectual
                                    property rights, title, or interest in its contents. The contents includes and is
                                    not limited to the design, layout, look and graphics.
                                </p>

                                <p>
                                    <span className='font-semibold'>V.</span> You acknowledge that unauthorized use of the Platform and/or the Services may lead
                                    to action against you as per these Terms of Use and/or applicable laws.
                                </p>

                                <p>
                                    <span className='font-semibold'>VI.</span> You agree to pay us the charges associated with availing the Services.
                                </p>

                                <p>
                                    <span className='font-semibold'>VII.</span> You agree not to use the Platform and/or Services for any purpose that is
                                    unlawful, illegal or forbidden by these Terms, or Indian or local laws that might
                                    apply to you.
                                </p>

                                <p>
                                    <span className='font-semibold'>VIII.</span> You agree and acknowledge that website and the Services may contain
                                    links to other third party websites. On accessing these links, you will be governed
                                    by the terms of use, privacy policy and such other policies of such third party websites.
                                    These links are provided for your convenience for provide further information.
                                </p>

                                <p>
                                    <span className='font-semibold'>IX.</span> You understand that upon initiating a transaction for availing the Services your are
                                    entering into a legally binding and enforceable contract with the Platform Owner for the Services.
                                </p>

                                <p>
                                    <span className='font-semibold'>X.</span> You shall indemnify and hold harmlesss Platform Owner, its affiliates, group companies (as applicable) and their
                                    respective officers, directors, agents, and employees, from any clain or demand, or actions including
                                    reasonable attorneys&apos; fees, made by any third party or penalty imposed due to or arising out of your breach
                                    of this Terms of Use, privacy policy and other policies, or you violation of any law, rules or
                                    regulations or the rights (including infringement of intellectual property rights) of a third party.
                                </p>

                                <p>
                                    <span className='font-semibold'>XI.</span> In no event will the Platform Owner be liable for any indirect, consequential, incidental,
                                    apecial or punitive damages, including without limitations damages for loss of proits or revenues,
                                    business interruption, loss of business opportunities, loss of data or loss of other economic interests,
                                    whether in contract, negligence, tort or otherwise, arising from the use of or inabiliity to use the Services,
                                    however caused and whether arising in contract, tort, negligence, warranty or otherwise, exceed the amount
                                    paid by you for using th eservices giving rise to the cause of action or Rupees One Hundred (Rs. 100) whichever
                                    is less.
                                </p>

                                <p>
                                    <span className='font-semibold'>XII.</span> Notwithstanding anything contained in these Terms of Use, the parties shall not be liable for any
                                    failure to perform an obligation under these terms if performance is prevented or delayed by a force
                                    majeur event.
                                </p>

                                <p>
                                    <span className='font-semibold'>XIII.</span> These terms and any dispute or claim relating to it, or its enforceability, shall be
                                    governed by and construed in accordance with the laws of India.
                                </p>

                                <p>
                                    <span className='font-semibold'>XIV.</span> All disputes arising out of or in connection with these terms shall be
                                    communicated to us using the contact information provided on this website.
                                </p>

                                <p>
                                    <span className='font-semibold'>XV.</span> All concerns or communications relating to these terms must be
                                    communicated to us using the contact information provided on this website.
                                </p>
                            </div>

                            <p>
                                <span className="font-bold">Note: </span>{" "}
                                Customers purchasing sexually wellness products must confirm that they are
                                <span className='font-bold'> above 18 years of age </span> at the time of purchase.
                            </p>
                        </div>

                        {/* Privacy Policy */}
                        <div ref={privacyPolicyRef} className='pt-10 space-y-5'>
                            <p className='font-semibold text-[#093C16] text-base'>
                                Legal & Privacy Policy
                            </p>

                            <p>
                                This Privacy Policy is meant to help you understand what
                                information we collect, why we collect it and how you can update
                                and delete your information.
                            </p>

                            <p>
                                This online privacy policy applies only to information collected
                                through our website and not to information collected offline.
                            </p>

                            <p>
                                We may collet personal identification informatino from users in a
                                variety of ways, including, but not limited to, when users visit our site,
                                register on the site place an order fill out a form respond to a survey
                                subscribe to the newsletter and in connection with other activities, services,
                                features or resources we make available on our site. Users may be asked for, as
                                appropriate, name, email address, mailing address, phone number, credit card information,
                                user may, however, visit our site anonymously.
                            </p>

                            <p>
                                We will collect personal indentification information from users only if
                                they voluntarily submit such information to us. Users can always refuse to supply
                                personally identification information, except that it may prevent them from engaging
                                in certain site related activities.
                            </p>

                            <p className='text-[#71bf45] font-semibold'>
                                Zealous Health collects and uses Users Personal Information for
                                the following purpose:
                            </p>

                            <ul className='space-y-2.5 list-decimal ml-3'>
                                <li>
                                    To improve customer service your information helps us to more
                                    effectively respond to your requests and support needs.
                                </li>
                                <li>
                                    To process transactions we may use the information users provide about
                                    themselves when placing an order only to provide service to that order.
                                </li>
                                <li>
                                    We do not share this information with outside parties except to the
                                    extent necessary to provide the service. We do not store credit card
                                    information. We do not store credit card information. It is stored separately
                                    by the credit card service provider.
                                </li>
                                <li>
                                    The email address users provide for order processing, will only be used
                                    to send them information and updates pertaining to their order.
                                </li>
                            </ul>


                            <p className='text-[#71bf45] font-semibold'>HOW WE PROTECT YOUR INFORMATION</p>

                            <ul className='space-y-2.5 ml-3 list-decimal'>
                                <li>
                                    We adopt appropriate data collection, storage and processing practices
                                    and security measures to protect against unauthorized access,
                                    alteration, disclosure or destruction of your personal information,
                                    username, password, transaction informatino and data stored on our site.
                                </li>
                                <li>
                                    Sensitive and private data exchange between the site and its users happens over a SSL
                                    secured communication channel and is encrypted and protected with digital signatures.
                                </li>
                            </ul>

                            <p className='text-[#71bf45] font-semibold'>
                                SHARING YOUR PEROSNAL INFORMATION
                            </p>

                            <p>
                                We do not sell, trade, or rent users personal identification
                                information to others. We may share generic aggregated demographic
                                information not linked to any personal identification information regarding
                                visitors and users with our business partners, trusted affiliates and advertisers
                                for the purpose outlined above.
                            </p>

                            <p className="text-[#71bf45] font-semibold">
                                YOUR ACCEPTANCE OF THESE TERMS
                            </p>

                            <p>
                                By using this site, you signify your acceptance of this policy and
                                terms of service. If you do not agree to this policy, please do not
                                use our site. Your continued use of the site following the posting of
                                changes to this policy will be deemed your acceptance of those changes.
                            </p>

                            <p className="text-[#71bf45] font-semibold">
                                CONTACTING US
                            </p>

                            <p>
                                If you have any questions about this privacy policy, the practices
                                of this site, or your dealings with this site, please contact us at:
                            </p>

                            <a
                                href="mailto:info@zlshealth.com"
                                className='text-[#71bf45] font-semibold'
                            >
                                info@zlshealth.com
                            </a>

                        </div>
                    </section>
                )}
            </div>
        </div >
    )
}

export default Page