'use client'

import Product from '@/components/Product'
import ProductSkeleton from '@/components/ProductSkeleton'
import { axiosClient } from '@/utils/axiosClient'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Range } from 'react-range'

interface products {
    _id: string,
    category: string;
    imageUrl: {
        url: string,
        public_id: string,
    };
    name: string;
    about: string;
    tags: string[];
    price: number;
    discount: number;
    shortDescription: string;
    quantity: number;
    highlights: string[];
    sku: string;
    brand: string;
    additionalInfo: string;
    appliedFor: string[];
}

interface filters {
    _id: string,
    name: string,
}

function page() {
    const STEP = 10;
    const MIN = 300;
    const MAX = 1500;

    const [values, setValues] = useState<number[]>([MIN, MAX]);
    const [loadingCategories, setLoadingCategories] = useState(false)
    const [categories, setCategories] = useState<filters[]>([])
    const [loadingProductTypes, setLoadingProductTypes] = useState(false)
    const [productTypes, setProductTypes] = useState<filters[]>([])
    const [loadingBenefits, setLoadingBenefits] = useState(false)
    const [benefits, setBenefits] = useState<filters[]>([])

    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?._id)
    const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([])
    const [selectedBenefits, setSelectedBenefits] = useState<string[]>([])
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [products, setProducts] = useState<products[]>([])
    const [filteredProducts, setFilteredProducts] = useState<products[]>([])

    useEffect(() => {
        const getCategories = async () => {
            try {
                setLoadingCategories(true)
                const response = await axiosClient.get('/api/categories')
                const fetchedCategories = response.data.result;
                setCategories(fetchedCategories)

                if (fetchedCategories.length > 0 && !selectedCategory) {
                    setSelectedCategory(fetchedCategories[0]._id)
                }
            } catch (e) {
                return
            }
            setLoadingCategories(false)
        }

        const getProductTypes = async () => {
            try {
                setLoadingProductTypes(true)
                const response = await axiosClient.get("/api/productTypes")
                setProductTypes(response.data.result)
            } catch (e) {
                return
            }
            setLoadingProductTypes(false)
        }

        const getBenefits = async () => {
            try {
                setLoadingBenefits(true)
                const response = await axiosClient.get("/api/benefits")
                setBenefits(response.data.result)
            } catch (e) {
                return
            }
            setLoadingBenefits(false)
        }

        getCategories()
        getProductTypes()
        getBenefits()
    }, [])

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoadingProducts(true)
                const queryParams = new URLSearchParams();

                if (selectedCategory) queryParams.append("category", selectedCategory);
                if (selectedProductTypes.length > 0) {
                    queryParams.append("productTypes", selectedProductTypes.join(","));
                }
                if (selectedBenefits.length > 0) {
                    queryParams.append("benefits", selectedBenefits.join(","));
                }

                const response = await axiosClient.get(
                    `/api/products?type=all&${queryParams.toString()}`
                );
                setProducts(response.data.result);
            } catch { }
            setLoadingProducts(false)
        };

        getProducts();
    }, [selectedCategory, selectedProductTypes, selectedBenefits]);

    const toggleSelection = (id: string, setState: any) => {
        setState((prev: string[]) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const [min, max] = values;
        const filtered = products.filter(
            (p) => p.price >= min && p.price <= max
        );
        setFilteredProducts(filtered);
    }, [values, products]);

    function SkeletonCheckboxRow() {
        return (
            <div className="flex items-center gap-2.5 animate-pulse">
                <div className="h-4 w-4 rounded-sm bg-gray-200 dark:bg-gray-600" />
                <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-600" />
            </div>
        );
    }

    return (
        <>
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
                                {loadingCategories
                                    ? Array.from({ length: 9 }).map((_, i) => (
                                        <SkeletonCheckboxRow key={i} />
                                    ))
                                    : categories.map((category) => (
                                        <div key={category._id} className="flex items-center gap-2.5">
                                            <input
                                                type="checkbox"
                                                id={category._id}
                                                checked={selectedCategory === category._id}
                                                onChange={() =>
                                                    setSelectedCategory(category._id)
                                                }
                                            />
                                            <label htmlFor={category._id} className='text-[#848484]'>{category.name}</label>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* PRODUCT TYPE */}
                        <div className="border border-[#e3e3e3] rounded-xl p-5 space-y-5">
                            <h3 className='font-medium text-xl'>Product Type</h3>
                            <div className="space-y-5">
                                {loadingProductTypes
                                    ? Array.from({ length: 4 }).map((_, i) => (
                                        <SkeletonCheckboxRow key={i} />
                                    ))
                                    : productTypes.map((product) => (
                                        <div key={product._id} className="flex items-center gap-5 border border-[#71BF45] rounded-lg p-2.5">
                                            <input
                                                type="checkbox"
                                                id={product._id}
                                                checked={selectedProductTypes.includes(product._id)}
                                                onChange={() =>
                                                    toggleSelection(product._id, setSelectedProductTypes)
                                                }
                                            />
                                            <label htmlFor={product._id} className='text-[#848484]'>
                                                <p>{product.name}</p>
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
                            <h3 className='font-medium text-xl'>Benefits / Concerns</h3>
                            <div className="space-y-5">
                                {loadingBenefits
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                        <SkeletonCheckboxRow key={i} />
                                    ))
                                    : benefits.map((benefit) => (
                                        <div key={benefit._id} className="flex items-center gap-2.5">
                                            <input
                                                type="checkbox"
                                                id={benefit._id}
                                                checked={selectedBenefits.includes(benefit._id)}
                                                onChange={() =>
                                                    toggleSelection(benefit._id, setSelectedBenefits)
                                                }
                                            />
                                            <label htmlFor={benefit._id} className='text-[#848484]'>{benefit.name}</label>
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
                        {loadingProducts
                            ? Array.from({ length: 9 }).map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))
                            : filteredProducts.map((data) => (
                                <Product product={data} key={data._id} />
                            ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default page