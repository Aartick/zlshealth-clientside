import React from 'react'
import { TbMedicineSyrup } from "react-icons/tb";
import { BiCapsule } from "react-icons/bi";
import { RiShieldCrossLine, RiMentalHealthLine, RiLungsLine } from "react-icons/ri";
import Link from 'next/link';
import Image from 'next/image';

function ShopLink() {
    const firstCol = [
        {
            img: <TbMedicineSyrup className='text-[#71BF45]' size={24} />,
            title: "Syrups & Tonics",
            desc: "Soothing herbal liquid blends"
        },
        {
            img: <BiCapsule className='text-[#71BF45]' size={24} />,
            title: "Capsules & Tablets",
            desc: "Easy daily wellness doses"
        },
        {
            img: <Image alt='img' src="/Oils.png" width={24} height={24} />,
            title: "Oils & Creams",
            desc: "External care with herbal actives"
        },
        {
            img: <Image alt='img' src="/essential.png" width={24} height={24} />,
            title: "Essential Oils & Blends",
            desc: "Aromatic and healing extracts"
        }
    ]

    const secondCol = [
        {
            img: <RiShieldCrossLine className='text-[#71BF45]' size={24} />,
            title: "Immunity Support",
            desc: "Boost your natural defenses"
        },
        {
            img: <Image src="/diabetes.png" alt='img' width={24} height={24} />,
            title: "Diabetes Management",
            desc: "Balanced sugar support"
        },
        {
            img: <Image src="/sleep.png" alt='img' width={24} height={24} />,
            title: "Stress & Sleep Relief",
            desc: "Calm your mind, rest better"
        },
        {
            img: <Image src="/balance.png" alt='img' width={24} height={24} />,
            title: "Hormonal Balance",
            desc: "Regulate cycles and energy"
        }
    ]

    const thirdCol = [
        {
            img: <RiMentalHealthLine className='text-[#71BF45]' size={24} />,
            title: "Mental Awareness",
            desc: "Focus, clarity, mood uplift"
        },
        {
            img: <Image src="/girl.png" alt='img' width={24} height={24} />,
            title: "PCOS & Menstrual Health",
            desc: "Natural hormonal harmony"
        },
        {
            img: <RiLungsLine className='text-[#71BF45]' size={24} />,
            title: "Respiratory Health",
            desc: "Breathe easier, feel stronger"
        }
    ]

    return (
        <div className='flex flex-wrap lg:flex-nowrap py-10 gap-[35px] px-10 bg-white'>

            {/* FIRST COLUMN */}
            <div className="space-y-5">
                <p className="font-normal text-[32px] whitespace-nowrap">
                    <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
                        SHOP BY C
                    </span>
                    ATEGORY
                </p>
                <div className="space-y-1">
                    <div className="space-y-4">
                        {firstCol.map((item, idx) => (
                            <div key={idx} className='p-[10px] space-y-[10px] rounded-xl cursor-pointer transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'>
                                <div className='relative flex items-center gap-[12px]'>
                                    {item.img}
                                    <p className='font-semibold text-lg whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                        {item.title}
                                    </p>
                                </div>
                                <p className='font-normal text-base text-[#848484] pl-[37px] whitespace-nowrap'>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <Link href="/" className='text-[#36810B] text-base font-normal underline decoration-solid'>See All Products</Link>
                </div>
            </div>

            {/* SECOND COLUMN */}
            <div className="space-y-5">
                <p className="font-normal text-[32px] whitespace-nowrap">
                    <span className="underline decoration-solid decoration-[#71BF45] decoration-[11%] underline-offset-[25%]">
                        SHOP BY N
                    </span>
                    EED
                </p>
                <div className="flex gap-4">
                    {/* FIRST PART */}
                    <div className="space-y-1">
                        <div className="space-y-4">
                            {secondCol.map((item, idx) => (
                                <div key={idx} className='p-[10px] space-y-[10px] rounded-xl cursor-pointer transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'>
                                    <div className='relative flex items-center gap-[12px]'>
                                        {item.img}
                                        <p className='font-semibold text-lg whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                            {item.title}
                                        </p>
                                    </div>
                                    <p className='font-normal text-base text-[#848484] pl-[37px] whitespace-nowrap'>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Link href="/" className='text-[#36810B] text-base font-normal underline decoration-solid'>See All Products</Link>
                    </div>

                    {/* SECOND PART */}
                    <div className="space-y-4">
                        <div className="space-y-4">
                            {thirdCol.map((item, idx) => (
                                <div key={idx} className='p-[10px] space-y-[10px] rounded-xl cursor-pointer transition-shadow duration-300 hover:shadow-xs hover:shadow-[#71BF45] group'>
                                    <div className='relative flex items-center gap-[12px]'>
                                        {item.img}
                                        <p className='font-semibold text-lg whitespace-nowrap transition-colors duration-300 group-hover:text-[#71BF45]'>
                                            {item.title}
                                        </p>
                                    </div>
                                    <p className='font-normal text-base text-[#848484] pl-[37px] whitespace-nowrap'>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* THIRD COLUMN */}
            <div className='relative w-[351px] h-[492px]'>
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

export default ShopLink;
