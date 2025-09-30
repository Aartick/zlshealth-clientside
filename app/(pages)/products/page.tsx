/**
 * Products Page
 * 
 * This component displays a list of products with advanced filtering options.
 * Users can filter products by category, product type, price range, and benefits/concerns.
 * The page fetches filter data and products from the backend, applies filters, 
 * and shows loading skeletons while data is loading.
 * Products are displayed in a responsive grid, and users can sort the results.
 */

'use client'

// Import required modules and components
import Product from '@/components/Product'
import ProductSkeleton from '@/components/ProductSkeleton'
import { axiosClient } from '@/utils/axiosClient'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Range } from 'react-range'
import { CiFilter } from "react-icons/ci";
import { MdKeyboardArrowDown } from 'react-icons/md'
import { IoSearchOutline } from 'react-icons/io5'
import { product } from '@/interfaces/products'

// Filters interface for categories, product types, and benefits
interface filters {
    _id: string,
    name: string,
}

const placeholderTexts = [
    "Stress Relief Syrup",
    "Immunity Booster Capsules",
    "Ashwagandha Supplements",
    "Diabetes Management",
    "Anti-Acne Cream",
];

function Page() {
    // Constants for price range slider
    const STEP = 10;
    const MIN = 300;
    const MAX = 1500;

    const [filterBarOpen, setFilterBarOpen] = useState(true)
    // State for search input value
    const [inputValue, setInputValue] = useState("");
    // State for animated placeholder index
    const [currentIndex,] = useState(0);
    // State for animation trigger
    const [isAnimating,] = useState(false);
    // State for price range values
    const [values, setValues] = useState<number[]>([MIN, MAX]);
    // State for loading and storing categories
    const [, setLoadingCategories] = useState(true)
    const [categories, setCategories] = useState<filters[]>([])
    // State for loading and storing product types
    const [loadingProductTypes, setLoadingProductTypes] = useState(true)
    const [productTypes, setProductTypes] = useState<filters[]>([])
    // State for loading and storing benefits
    const [loadingBenefits, setLoadingBenefits] = useState(true)
    const [benefits, setBenefits] = useState<filters[]>([])

    // State for selected filters
    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?._id)
    const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([])
    const [selectedBenefits, setSelectedBenefits] = useState<string[]>([])
    // State for loading and storing products
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [products, setProducts] = useState<product[]>([])
    // State for filtered products based on price range
    const [filteredProducts, setFilteredProducts] = useState<product[]>([])

    // Fetch categories, product types, and benefits on mount
    useEffect(() => {
        const getCategories = async () => {
            try {
                setLoadingCategories(true)
                const response = await axiosClient.get('/api/categories')
                const fetchedCategories = response.data.result;
                setCategories(fetchedCategories)

                // Set default selected category if not set
                if (fetchedCategories.length > 0 && !selectedCategory) {
                    setSelectedCategory(fetchedCategories[0]._id)
                }
            } catch { }
            setLoadingCategories(false)
        }

        const getProductTypes = async () => {
            try {
                setLoadingProductTypes(true)
                const response = await axiosClient.get("/api/productTypes")
                setProductTypes(response.data.result)
            } catch { }
            setLoadingProductTypes(false)
        }

        const getBenefits = async () => {
            try {
                setLoadingBenefits(true)
                const response = await axiosClient.get("/api/benefits")
                setBenefits(response.data.result)
            } catch { }
            setLoadingBenefits(false)
        }

        getCategories()
        getProductTypes()
        getBenefits()
    }, [])

    // Fetch products whenever filters change
    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoadingProducts(true)
                const queryParams = new URLSearchParams();

                // Add selected filters to query params
                if (selectedCategory) queryParams.append("category", selectedCategory);
                if (selectedProductTypes.length > 0) {
                    queryParams.append("productTypes", selectedProductTypes.join(","));
                }
                if (selectedBenefits.length > 0) {
                    queryParams.append("benefits", selectedBenefits.join(","));
                }

                // Fetch products from backend
                const response = await axiosClient.get(
                    `/api/products?type=all&${queryParams.toString()}`
                );

                setProducts(response.data.result);
            } catch { }
            setLoadingProducts(false)
        };

        getProducts();
    }, [selectedCategory, selectedProductTypes, selectedBenefits]);

    // Helper to toggle selection for product types and benefits
    const toggleSelection = (id: string, setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        setState((prev: string[]) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Filter products by price range whenever price or products change
    useEffect(() => {
        const [min, max] = values;
        const filtered = products.filter(
            (p) => p.price >= min && p.price <= max
        );
        setFilteredProducts(filtered);
    }, [values, products]);

    // Skeleton loader for filter checkboxes
    function SkeletonCheckboxRow() {
        return (
            <div className="flex items-center gap-2.5 animate-pulse">
                <div className="h-4 w-4 rounded-sm bg-gray-200 dark:bg-gray-600" />
                <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-600" />
            </div>
        );
    }

    return (
        <div className='pt-4'>
            {/* Header image for products page */}
            <div className="relative w-full h-[200px] sm:h-[300px] md:h-[376px]">
                <Image
                    src="/ProductsHeader.png"
                    fill
                    alt='headerImg'
                    className='object-cover'
                    priority
                />
            </div>
            <div className="container mx-auto flex transition-all duration-500 ease-in-out">

                {/* Main section */}
                <div className={`transition-all duration-500 ease-in-out ${filterBarOpen ? "flex-3" : "flex-4"
                    }`}>

                    {/* Top filters */}
                    <div className="space-y-4 p-4 border-b border-[#E3E3E3]">
                        <div className="flex items-center justify-between">

                            {/* SEARCH BAR  */}
                            <div className="flex-1 flex items-center gap-2.5 relative border-[0.5px] border-[#71BF45] rounded-[50px] py-2 px-2.5">
                                <label htmlFor='search' className="p-1 rounded-[27px] bg-[#71bf45] text-[#ffffff]">
                                    <IoSearchOutline size={15} />
                                </label>

                                <div className="relative w-full">
                                    {/* Search input */}
                                    <input
                                        id='search'
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="text-[#2e2e2e] text-xs w-full focus:outline-none"
                                    />
                                    {/* Animated Placeholder */}
                                    {inputValue === "" && (
                                        <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center text-[#a3a3a3] text-xs overflow-hidden">
                                            <p>Search for&nbsp; </p>
                                            <div
                                                className={`transition-transform duration-500 ${isAnimating
                                                    ? "-translate-y-full"
                                                    : "translate-y-0 opacity-100"
                                                    }`}
                                                key={currentIndex}
                                            >
                                                &quot;{placeholderTexts[currentIndex]}&quot;
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 justify-end flex items-center gap-4">
                                {/* FILTERS */}
                                <label
                                    htmlFor="select"
                                    className='flex items-center py-2 px-3 gap-5 rounded-lg border border-[#e3e3e3] text-base font-medium'
                                >
                                    <p className='text-[#848484]'>Sort by:</p>
                                    <select name="Sort By" id="select" className='focus:outline-none'>
                                        <option value="Recommended">Recommended</option>
                                    </select>
                                </label>

                                <div
                                    onClick={() => setFilterBarOpen(!filterBarOpen)}
                                    className='flex items-center py-2 px-3 gap-5 rounded-lg border border-[#e3e3e3] text-base font-medium transition-all'
                                >
                                    <CiFilter />
                                    <div className="flex gap-2 items-center">
                                        <p>Filter By</p>
                                        <MdKeyboardArrowDown
                                            className={`transition-transform duration-300 ${filterBarOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 p-4">
                            <p className="font-medium">Category</p>

                            <div className="grid grid-cols-3 gap-4">
                                {categories.map((category) => (
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
                    </div>

                    {/* Products grid */}
                    <div className={`grid grid-cols-2 ${filterBarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-2.5 md:gap-5 p-4 h-screen overflow-y-scroll scrollbar-hide`}>
                        {loadingProducts
                            ? Array.from({ length: 9 }).map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))
                            : filteredProducts.map((data) => (
                                <Product product={data} key={data._id} />
                            ))}
                    </div>
                </div>

                {/* Sidebar: Filters section */}
                <div className={`transition-all duration-500 ease-in-out h-screen overflow-y-scroll scrollbar-hide pt-4 px-[20.5px] ${filterBarOpen ? "w-[300px] opacity-100" : "w-0 opacity-0"
                    }`}  >
                    <div className='space-y-5'>
                        <h2 className='text-[#093C16] text-2xl font-medium px-2.5'>Filter by</h2>

                        {/* PRODUCT TYPE FILTER */}
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

                        {/* PRICE RANGE FILTER */}
                        <div className="border border-[#e3e3e3] rounded-xl p-5 space-y-5">
                            <h3 className='font-medium text-xl'>Price Range</h3>

                            {/* Price range slider */}
                            <Range
                                step={STEP}
                                min={MIN}
                                max={MAX}
                                values={values}
                                onChange={(vals) => setValues(vals)}
                                renderTrack={({ props, children }) => {
                                    // Calculate slider fill percentages
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
                                renderThumb={({ props, index }) => {
                                    const { key, ...restProps } = props;
                                    return (
                                        <div
                                            key={key || index}
                                            {...restProps}
                                            style={{
                                                ...restProps.style,
                                                height: "24px",
                                                width: "24px",
                                                borderRadius: "50%",
                                                backgroundColor: "#fff",
                                                border: "4px solid #71BF45",
                                                boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
                                                cursor: "grab",
                                            }}
                                        />
                                    )
                                }}
                            />

                            {/* Display selected price range */}
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

                        {/* BENEFITS/CONCERNS FILTER */}
                        <div className="border border-[#e3e3e3] rounded-xl p-5 space-y-5">
                            <h3 className='font-medium text-xl'>Benefits / Conc</h3>
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
            </div>
        </div>
    )
}

export default Page