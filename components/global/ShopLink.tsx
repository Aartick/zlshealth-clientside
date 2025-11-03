/**
 * ShopLink Component
 * 
 * This component displays a categorized shop navigation section.
 * It visually organizes products by category and need, showing icons, titles, and descriptions.
 * Users can browse categories, needs, and see a featured image. Each item is styled for hover effects.
 * "See All Products" links allow users to view the full product list.
 */

import React from 'react'
import { TbMedicineSyrup } from "react-icons/tb";
import { BiCapsule } from "react-icons/bi";
import { RiShieldCrossLine, RiMentalHealthLine, RiLungsLine } from "react-icons/ri";
import Link from 'next/link';
import Image from 'next/image';

function ShopLink() {
    // First column: Shop by Category
    const firstCol = [
        {
            type: "productType",
            label: "Syrups & Tonics",
            img: <TbMedicineSyrup className='text-[#71BF45]' size={24} />,
            title: "Syrups & Tonics",
            desc: "Soothing herbal liquid blends"
        },
        {
            type: "productType",
            label: "Capsule & Tablets",
            img: <BiCapsule className='text-[#71BF45]' size={24} />,
            title: "Capsule & Tablets",
            desc: "Easy daily wellness doses"
        },
        {
            type: "productType",
            label: "Oils & Creams",
            img: <svg
                width="24"
                height="24"
                viewBox="0 0 14 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <mask id="mask0_2540_8741" maskUnits="userSpaceOnUse" x="0" y="0" width="14" height="22">
                    <path d="M3.5 17.5H10.5V21H3.5V17.5Z" fill="#555555" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13 1H1C1 1 1 5 1.5 9.5C2 14 3.5 17.5 3.5 17.5H10.5C10.5 17.5 12 14 12.5 9.5C13 5 13 1 13 1Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1.5 4H12.5M5.3215 9.9445C6.037 9.0045 6.589 7.705 6.887 7C7.409 7.705 8.542 9.474 8.9 10.4145C9.347 11.5895 8.229 13 6.887 13C5.545 13 4.427 11.12 5.3215 9.9445Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </mask>
                <g mask="url(#mask0_2540_8741)">
                    <path d="M-5 -1H19V23H-5V-1Z" fill="#71BF45" />
                </g>
            </svg>,
            title: "Oils & Creams",
            desc: "External care with herbal actives"
        },
        {
            type: "productType",
            label: "Herbal Blends, Oils & Creams",
            img: <svg width="24" height="24" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 9.00065C7.5 9.00065 6.75 7.50065 6 9.00065C6 9.00065 3.75 12.3757 3.75 14.6257C3.75 15.3757 4.125 17.2507 6.75 17.2507C9.375 17.2507 9.75 15.3757 9.75 14.6257C9.75 12.3757 7.5 9.00065 7.5 9.00065Z" fill="#71BF45" />
                <path d="M6 0C4.5 0 3.75 1.5 5.25 2.25V3.375C5.25 3.7245 4.9215 3.84075 4.8765 3.855C3.50465 4.1165 2.26699 4.84837 1.37682 5.92445C0.486649 7.00054 -0.000262035 8.35345 1.05792e-07 9.75V18C1.05792e-07 18.7956 0.31607 19.5587 0.87868 20.1213C1.44129 20.6839 2.20435 21 3 21H10.5C11.2956 21 12.0587 20.6839 12.6213 20.1213C13.1839 19.5587 13.5 18.7956 13.5 18V9.75C13.5 6.8205 11.4 4.38075 8.6235 3.855H8.628C8.628 3.855 8.253 3.75 8.25 3.375V2.25H10.5C11.25 2.25 11.625 1.125 10.5 0.75C10.5 0.75 6.75 0 6 0ZM6 5.25H7.5C8.69347 5.25 9.83807 5.72411 10.682 6.56802C11.5259 7.41193 12 8.55653 12 9.75V18C12 18.3978 11.842 18.7794 11.5607 19.0607C11.2794 19.342 10.8978 19.5 10.5 19.5H3C2.60218 19.5 2.22064 19.342 1.93934 19.0607C1.65804 18.7794 1.5 18.3978 1.5 18V9.75C1.5 8.55653 1.97411 7.41193 2.81802 6.56802C3.66193 5.72411 4.80653 5.25 6 5.25Z" fill="#71BF45" />
            </svg>,
            title: "Essential Oils & Blends",
            desc: "Aromatic and healing extracts"
        }
    ]

    // Second column: Shop by Need
    const secondCol = [
        {
            type: 'category',
            label: "Immunity & Respiratory",
            img: <RiShieldCrossLine className='text-[#71BF45]' size={24} />,
            title: "Immunity Support",
            desc: "Boost your natural defenses"
        },
        {
            type: "benefits",
            label: "Blood Sugar Support",
            img: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.73 2.28929C14.9213 2.12546 15.1674 2.03985 15.4191 2.04957C15.6707 2.0593 15.9095 2.16363 16.0876 2.34172C16.2657 2.51982 16.37 2.75856 16.3797 3.01023C16.3894 3.26191 16.3038 3.50798 16.14 3.69929L13 6.78929L13.76 7.73928L15.7 12.7393C15.7988 13.0029 15.8193 13.2895 15.759 13.5645C15.6986 13.8395 15.5601 14.0912 15.36 14.2893L12.27 17.3793C11.9827 17.6486 11.6037 17.7984 11.21 17.7984C10.8163 17.7984 10.4373 17.6486 10.15 17.3793L5.55 12.7793C5.41923 12.6483 5.31636 12.4921 5.24761 12.3202C5.17886 12.1484 5.14566 11.9643 5.15 11.7793L4.65 5.33929H5.72C5.859 5.33438 5.9975 5.35853 6.12664 5.41019C6.25578 5.46184 6.37272 5.53987 6.47 5.63929L6.61 5.80929L7.66 9.28929M7.66 21.9993L2 16.3593L4.12 14.2393L9.78 19.8993M19.5 4.49929C19.5 4.49929 17 7.25928 17 8.99929C17 9.66233 17.2634 10.2982 17.7322 10.7671C18.2011 11.2359 18.837 11.4993 19.5 11.4993C20.163 11.4993 20.7989 11.2359 21.2678 10.7671C21.7366 10.2982 22 9.66233 22 8.99929C22 7.25928 19.5 4.49929 19.5 4.49929Z" fill="#71BF45" />
            </svg>,
            title: "Diabetes Management",
            desc: "Balanced sugar support"
        },
        {
            type: "benefits",
            label: "Stress & Sleep",
            img: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 12.5C7.59334 12.5 8.17336 12.3241 8.66671 11.9944C9.16006 11.6648 9.54458 11.1962 9.77164 10.6481C9.9987 10.0999 10.0581 9.49667 9.94236 8.91473C9.8266 8.33279 9.54088 7.79824 9.12132 7.37868C8.70176 6.95912 8.16721 6.6734 7.58527 6.55764C7.00333 6.44189 6.40013 6.5013 5.85195 6.72836C5.30377 6.95542 4.83524 7.33994 4.50559 7.83329C4.17595 8.32664 4 8.90666 4 9.5C4 10.2956 4.31607 11.0587 4.87868 11.6213C5.44129 12.1839 6.20435 12.5 7 12.5ZM7 8.5C7.19778 8.5 7.39112 8.55865 7.55557 8.66853C7.72002 8.77841 7.84819 8.93459 7.92388 9.11732C7.99957 9.30004 8.01937 9.50111 7.98079 9.69509C7.9422 9.88907 7.84696 10.0673 7.70711 10.2071C7.56725 10.347 7.38907 10.4422 7.19509 10.4808C7.00111 10.5194 6.80004 10.4996 6.61732 10.4239C6.43459 10.3482 6.27841 10.22 6.16853 10.0556C6.05865 9.89112 6 9.69778 6 9.5C6 9.23478 6.10536 8.98043 6.29289 8.79289C6.48043 8.60536 6.73478 8.5 7 8.5ZM20 6.5H12C11.7348 6.5 11.4804 6.60536 11.2929 6.79289C11.1054 6.98043 11 7.23478 11 7.5V13.5H3V5.5C3 5.23478 2.89464 4.98043 2.70711 4.79289C2.51957 4.60536 2.26522 4.5 2 4.5C1.73478 4.5 1.48043 4.60536 1.29289 4.79289C1.10536 4.98043 1 5.23478 1 5.5V18.5C1 18.7652 1.10536 19.0196 1.29289 19.2071C1.48043 19.3946 1.73478 19.5 2 19.5C2.26522 19.5 2.51957 19.3946 2.70711 19.2071C2.89464 19.0196 3 18.7652 3 18.5V15.5H21V18.5C21 18.7652 21.1054 19.0196 21.2929 19.2071C21.4804 19.3946 21.7348 19.5 22 19.5C22.2652 19.5 22.5196 19.3946 22.7071 19.2071C22.8946 19.0196 23 18.7652 23 18.5V9.5C23 8.70435 22.6839 7.94129 22.1213 7.37868C21.5587 6.81607 20.7956 6.5 20 6.5ZM21 13.5H13V8.5H20C20.2652 8.5 20.5196 8.60536 20.7071 8.79289C20.8946 8.98043 21 9.23478 21 9.5V13.5Z" fill="#71BF45" />
            </svg>,
            title: "Stress & Sleep Relief",
            desc: "Calm your mind, rest better"
        },
        {
            type: "benefits",
            label: "Hormonal Balance",
            img: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 11.5L10.5 9M17.5 12.5C13.9468 11.2098 10.0532 11.2098 6.5 12.5L6 7C9.5 5.5 14.5 5.5 18 7L17.5 12.5Z" stroke="#71BF45" strokeWidth="2" strokeMiterlimit="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 19.5C21 19.8978 20.842 20.2794 20.5607 20.5607C20.2794 20.842 19.8978 21 19.5 21H4.5C4.10218 21 3.72064 20.842 3.43934 20.5607C3.15804 20.2794 3 19.8978 3 19.5V4.5C3 4.10218 3.15804 3.72064 3.43934 3.43934C3.72064 3.15804 4.10218 3 4.5 3H19.5C19.8978 3 20.2794 3.15804 20.5607 3.43934C20.842 3.72064 21 4.10218 21 4.5V19.5Z" stroke="#71BF45" strokeWidth="2" strokeMiterlimit="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.5 11.7265C12.8435 11.4662 11.1565 11.4662 9.5 11.7265" stroke="#71BF45" strokeWidth="2" strokeMiterlimit="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>,
            title: "Hormonal Balance",
            desc: "Regulate cycles and energy"
        }
    ]

    // Third column: More needs
    const thirdCol = [
        {
            type: "benefits",
            label: "Energy & Focus",
            img: <RiMentalHealthLine className='text-[#71BF45]' size={24} />,
            title: "Mental Awareness",
            desc: "Focus, clarity, mood uplift"
        },
        {
            type: "benefits",
            label: "Hormonal Balance",
            img: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8Z" stroke="#71BF45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.5 18V22M10.5 18V22M13.615 8H10.385L5 18H19L13.615 8Z" stroke="#71BF45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>,
            title: "PCOS & Menstrual Health",
            desc: "Natural hormonal harmony"
        },
        {
            type: "category",
            label: "Immunity & Respiratory",
            img: <RiLungsLine className='text-[#71BF45]' size={24} />,
            title: "Respiratory Health",
            desc: "Breathe easier, feel stronger"
        }
    ]

    return (
        <div className='h-full mx-10 scrollbar-hide rounded-2xl overflow-y-scroll flex flex-wrap lg:flex-nowrap p-10 gap-[35px] bg-white text-black'>

            {/* ====== FIRST COLUMN: Shop by Category ====== */}
            <div className="space-y-5">
                <p className="font-normal text-3xl whitespace-nowrap">
                    <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
                        SHOP BY C
                    </span>
                    ATEGORY
                </p>
                <div className="space-y-1">
                    <div className="space-y-3">
                        {/* Render each category item */}
                        {firstCol.map((item, idx) => (
                            <Link
                                key={idx}
                                href={`/products?${item.type}=${encodeURIComponent(item.label)}`}
                                className='p-2.5 space-y-2 rounded-xl transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'
                            >
                                <div className='relative flex items-center gap-3'>
                                    {/* Category icon/image */}
                                    {item.img}
                                    {/* Category title */}
                                    <p className='font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                        {item.title}
                                    </p>
                                </div>
                                {/* Category description */}
                                <p className='font-normal text-sm text-[#848484] pl-[37px] whitespace-nowrap'>
                                    {item.desc}
                                </p>
                            </Link>
                        ))}
                    </div>
                    {/* Link to all products */}
                    <Link href="/products" className='text-[#36810B] font-normal underline decoration-solid'>See All Products</Link>
                </div>
            </div>

            {/* ====== SECOND COLUMN: Shop by Need ====== */}
            <div className="space-y-5">
                <p className="font-normal text-3xl whitespace-nowrap">
                    <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
                        SHOP BY N
                    </span>
                    EED
                </p>
                <div className="flex gap-4">
                    {/* FIRST PART: Immunity, Diabetes, Stress, Hormonal */}
                    <div className="space-y-1">
                        <div className="space-y-3">
                            {/* Render each need item */}
                            {secondCol.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={`/products?${item.type}=${encodeURIComponent(item.label)}`}
                                    className='p-2.5 space-y-2.5 rounded-xl transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'
                                >
                                    <div className='relative flex items-center gap-3'>
                                        {/* Need icon/image */}
                                        {item.img}
                                        {/* Need title */}
                                        <p className='font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                            {item.title}
                                        </p>
                                    </div>
                                    {/* Need description */}
                                    <p className='font-normal text-sm text-[#848484] pl-[37px] whitespace-nowrap'>
                                        {item.desc}
                                    </p>
                                </Link>
                            ))}
                        </div>
                        {/* Link to all products */}
                        <Link href="/products" className='text-[#36810B] font-normal underline decoration-solid'>See All Products</Link>
                    </div>

                    {/* SECOND PART: Mental, PCOS, Respiratory */}
                    <div className="space-y-3">
                        <div className="space-y-3">
                            {/* Render each additional need item */}
                            {thirdCol.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={`/products?${item.type}=${encodeURIComponent(item.label)}`}
                                    className='p-2.5 space-y-2.5 rounded-xl transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'
                                >
                                    <div className='relative flex items-center gap-3'>
                                        {/* Need icon/image */}
                                        {item.img}
                                        {/* Need title */}
                                        <p className='font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                            {item.title}
                                        </p>
                                    </div>
                                    {/* Need description */}
                                    <p className='font-normal text-sm text-[#848484] pl-[37px] whitespace-nowrap'>
                                        {item.desc}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ====== THIRD COLUMN: Featured shop image ====== */}
            <div className='relative w-[350px] h-[490px]'>
                <Image
                    src="/shopLink.jpg"
                    alt='img'
                    fill
                    className='object-cover rounded-3xl'
                    sizes="(max-width: 768px) 100vw, 351px"
                />
            </div>
        </div>
    )
}

export default ShopLink
