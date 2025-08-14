'use client'

import Product from '@/components/Product'
import Image from 'next/image'
import React, { useState } from 'react'
import { Range } from 'react-range'

const categories = [
    "Digestive & Gut Health",
    "Immunity & Respiratory",
    "Joint, Bone & Mobility",
    "Metabolic Health",
    "Reproductive & Hormonal health",
    "Haircare",
    "Holistic Wellness"
]

const productType = [
    {
        icon: "",
        type: "Capsule & Tablets"
    },
    {
        icon: "",
        type: "Syrups & Tonics"
    },
    {
        icon: "",
        type: "Oils & Creams"
    },
    {
        icon: "",
        type: "Herbal Blends"
    }
]

const benefitsAndConcerns = [
    "Stress & Sleep",
    "Blood Sugar Support",
    "Hormonal Balance",
    "Skin & Hair",
    "Energy & Focus",
]

function page() {
    const STEP = 10;
    const MIN = 300;
    const MAX = 1500;

    const [values, setValues] = useState([300, 1500]);

    return (
        <div>
            <div className="relative w-full h-[200px] sm:h-[300px] md:h-[376px]">
                <Image
                    src="/ProductsHeader.png"
                    fill
                    alt='headerImg'
                    className='object-cover'
                    priority
                />
            </div>
            <div className="flex">
                {/* Section 1 */}
                <div className="hidden sm:block flex-1 h-screen overflow-y-scroll scrollbar-hide border-r border-[#e3e3e3] pt-4 px-[20.5px]">
                    <div className='space-y-5'>
                        <h2 className='text-[#093C16] text-2xl font-medium px-2.5'>Filter by</h2>

                        {/* CATEGORY */}
                        <div className="border border-[#e3e3e3] rounded-xl p-5 space-y-5">
                            <h3 className='font-medium text-xl'>Category</h3>
                            <div className="space-y-5">
                                {categories.map((category, idx) => (
                                    <div key={idx} className="flex items-center gap-2.5">
                                        <input type="checkbox" name={category} id={category} />
                                        <label htmlFor={category} className='text-[#848484]'>{category}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PRODUCT TYPE */}
                        <div className="border border-[#e3e3e3] rounded-xl p-5 space-y-5">
                            <h3 className='font-medium text-xl'>Product Type</h3>
                            <div className="space-y-5">
                                {productType.map((product, idx) => (
                                    <div key={idx} className="flex items-center gap-5 border border-[#71BF45] rounded-lg p-2.5">
                                        <input type="checkbox" name={product.type} id={product.type} />
                                        <label htmlFor={product.type} className='text-[#848484]'>
                                            <p>{product.icon}</p>
                                            <p>{product.type}</p>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PRICE RANGE */}
                        <div className="border border-[#e3e3e3] rounded-xl p-5 space-y-5">
                            <h3 className='font-medium text-xl'>Price Range</h3>

                            <Range
                                step={STEP}
                                min={MIN}
                                max={MAX}
                                values={values}
                                onChange={(vals) => setValues(vals)}
                                renderTrack={({ props, children }) => {
                                    const percentage1 = ((values[0] - MIN) / (MAX - MIN)) * 100;
                                    const percentage2 = ((values[1] - MIN) / (MAX - MIN)) * 100;

                                    return (
                                        <div
                                            {...props}
                                            style={{
                                                ...props.style,
                                                height: "2px",
                                                width: "100%",
                                                borderRadius: "9999px",
                                                position: "relative",
                                                background: `linear-gradient(
                                                 to right,
                                                 #e3e3e3 0%,
                                                 #e3e3e3 ${percentage1}%,
                                                 #71BF45 ${percentage1}%,
                                                 #71BF45 ${percentage2}%,
                                                 #e3e3e3 ${percentage2}%,
                                                 #e3e3e3 100%
                                                )`
                                            }}
                                        >
                                            {children}
                                        </div>
                                    );
                                }}
                                renderThumb={({ props }) => (
                                    <div
                                        {...props}
                                        style={{
                                            ...props.style,
                                            height: "24px",
                                            width: "24px",
                                            borderRadius: "50%",
                                            backgroundColor: "#fff",
                                            border: "4px solid #71BF45",
                                            boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
                                            cursor: "grab",
                                        }}
                                    />
                                )}
                            />

                            <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <p>From</p>
                                    <p className='border border-[#e3e3e3] py-[5px] px-2.5 rounded-[5px]'>₹{values[0]}</p>
                                </div>
                                <div className="space-y-2">
                                    <p>To</p>
                                    <p className='border border-[#e3e3e3] py-[5px] px-2.5 rounded-[5px]'>₹{values[1]}</p>
                                </div>
                            </div>
                        </div>

                        {/* BENEFITS/CONCERNS */}
                        <div className="border border-[#e3e3e3] rounded-xl p-5 space-y-5">
                            <h3 className='font-medium text-xl'>Category</h3>
                            <div className="space-y-5">
                                {benefitsAndConcerns.map((benefits, idx) => (
                                    <div key={idx} className="flex items-center gap-2.5">
                                        <input type="checkbox" name={benefits} id={benefits} />
                                        <label htmlFor={benefits} className='text-[#848484]'>{benefits}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="flex-3">
                    <div className='flex justify-end border-b border-[#e3e3e3] py-2 md:py-4 pr-2 md:pr-4'>
                        <label
                            htmlFor="select"
                            className='flex items-center py-2 px-3 gap-5 rounded-lg border border-[#e3e3e3] text-base md:text-lg lg:text-xl font-medium'
                        >
                            <p className='text-[#848484]'>Sort by:</p>
                            <select name="Sort By" id="select" className='focus:outline-none'>
                                <option value="Recommended">Recommended</option>
                            </select>
                        </label>
                    </div>

                    {/* Products */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5 p-4 h-screen overflow-y-scroll scrollbar-hide">
                        {[...Array(11)].map((_, idx) => (
                            <Product key={idx} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page