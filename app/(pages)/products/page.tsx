/**
 * Products Page
 * 
 * This component displays a list of products with advanced filtering options.
 * Users can filter products by category, product type, price range, and benefits.
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
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Range } from 'react-range'
import { CiFilter } from "react-icons/ci";
import { MdKeyboardArrowDown } from 'react-icons/md'
import { product } from '@/interfaces/products'
import { RxCross1 } from 'react-icons/rx'
import NoProductsComponent from '@/components/NoProductsComponent'
import { useSearchParams } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks'
import { filters } from '@/interfaces/filters'
import { ChevronDown } from 'lucide-react'

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
    const MIN = 50;
    const MAX = 5000;

    // Set filter bar open by default on desktop, closed on mobile
    const [filterBarOpen, setFilterBarOpen] = useState(false)
    // State for search input value
    const [inputValue, setInputValue] = useState("");
    // State for animated placeholder index
    const [currentIndex,] = useState(0);
    // State for animation trigger
    const [isAnimating,] = useState(false);
    // State for price range values
    const [values, setValues] = useState<number[]>([MIN, MAX]);
    // State to track if mobile
    const [isMobile, setIsMobile] = useState(false);

    // Set initial filter bar state based on screen size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setFilterBarOpen(true);
            } else {
                setFilterBarOpen(false);
            }
        };

        // Set initial state
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const categories = useAppSelector((state) => state.filtersSlice.categories)
    const benefits = useAppSelector((state) => state.filtersSlice.benefits)
    const productTypes = useAppSelector((state) => state.filtersSlice.productTypes)
    const loadingFilters = useAppSelector((state) => state.filtersSlice.loading)

    // State for selected filters (applied filters)
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([])
    const [selectedBenefits, setSelectedBenefits] = useState<string[]>([])

    // Temporary filter states (for mobile - before applying)
    const [tempProductTypes, setTempProductTypes] = useState<string[]>([])
    const [tempBenefits, setTempBenefits] = useState<string[]>([])
    const [tempPriceRange, setTempPriceRange] = useState<number[]>([MIN, MAX])

    // Sort state
    const [sortBy, setSortBy] = useState<string>("recommended")

    // State for loading and storing products
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [products, setProducts] = useState<product[]>([])
    // State for filtered products based on price range
    const [filteredProducts, setFilteredProducts] = useState<product[]>([])
    // State for sorted products
    const [sortedProducts, setSortedProducts] = useState<product[]>([])
    // State for error handling
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get("category");
    const productTypeQuery = searchParams.get("productType")
    const productTypeNames = productTypeQuery
        ? productTypeQuery.split(",").map((t) => t.trim())
        : [];
    const benefitQuery = searchParams.get("benefits")

    useEffect(() => {
        if (!categoryQuery) {
            if (categories.length > 0) {
                setSelectedCategory(categories[0]._id)
            }
        }
        else if (categoryQuery) {
            const matched = categories.find(
                (c: filters) => c.name.toLowerCase() === categoryQuery.toLowerCase()
            )
            if (matched) setSelectedCategory(matched._id)
        } else if (benefitQuery) {
            const matched = benefits.find(
                (b: filters) => b.name.toLowerCase() === benefitQuery.toLowerCase()
            )
            if (matched) setSelectedBenefits([matched._id])
        } else if (productTypeNames.length > 0) {
            const matched = productTypes
                .filter((p: filters) =>
                    productTypeNames.some(
                        (name) => p.name.toLowerCase() === name.toLowerCase()
                    )
                ).map((p: filters) => p._id)
            if (matched) setSelectedProductTypes(matched)
        }
        // Only open filters by default on desktop when there are query parameters
        if (productTypeQuery || benefitQuery) {
            if (window.innerWidth >= 768) {
                setFilterBarOpen(true)
            }
        }
    }, [categoryQuery, productTypeQuery, benefitQuery])

    // Fetch products whenever filters change
    useEffect(() => {
        const getProducts = async (attempt = 0) => {
            try {
                if (loadingFilters) return;
                if (!selectedCategory) return;
                setLoadingProducts(true)
                setError(null);
                const queryParams = new URLSearchParams();

                // Add selected filters to query params
                if (selectedCategory) queryParams.append("category", selectedCategory);

                // Append each product type ID separately
                if (selectedProductTypes.length > 0) {
                    selectedProductTypes.forEach((id) => {
                        queryParams.append("productTypes", id)
                    })
                }

                // Append each benefits ID separately
                if (selectedBenefits.length > 0) {
                    selectedBenefits.forEach((id) => {
                        queryParams.append("benefits", id)
                    });
                }

                // Fetch products from backend with timeout handling
                const response = await axiosClient.get(
                    `/api/products?type=all&${queryParams.toString()}`,
                    { timeout: 30000 } // 30 second timeout
                );

                // Handle pagination response format
                const result = response.data.result;
                const productsData = result.products || result; // Support both new and old format
                setProducts(productsData);
                setRetryCount(0); // Reset retry count on success
            } catch (err: unknown) {
                const error = err as { code?: string; message?: string };
                const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
                const maxRetries = 2;

                if (isTimeout && attempt < maxRetries) {
                    // Retry on timeout
                    console.log(`Request timed out, retrying... (${attempt + 1}/${maxRetries})`);
                    setRetryCount(attempt + 1);
                    setTimeout(() => getProducts(attempt + 1), 1000); // Retry after 1 second
                    return;
                }

                // Set error message
                if (isTimeout) {
                    setError("Loading is taking longer than usual. Please refresh the page or try again later.");
                } else {
                    setError("Failed to load products. Please try again.");
                }
                console.error("Error fetching products:", err);
            } finally {
                setLoadingProducts(false);
            }
        };

        getProducts();
    }, [selectedCategory, selectedProductTypes, selectedBenefits]);

    // Helper to toggle selection for product types and benefits
    const toggleSelection = (id: string, setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        setState((prev: string[]) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Apply filters function
    const applyFilters = () => {
        setSelectedProductTypes(tempProductTypes);
        setSelectedBenefits(tempBenefits);
        setValues(tempPriceRange);
        setFilterBarOpen(false); // Close sidebar after applying
    };

    // Initialize temp states when opening filter sidebar
    const handleOpenFilters = () => {
        if (!filterBarOpen) {
            // Copy current applied filters to temp states
            setTempProductTypes(selectedProductTypes);
            setTempBenefits(selectedBenefits);
            setTempPriceRange(values);
        }
        setFilterBarOpen(!filterBarOpen);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setTempProductTypes([]);
        setTempBenefits([]);
        setTempPriceRange([MIN, MAX]);
    };

    useEffect(() => {
        if (!inputValue.trim()) {
            // If no search, filteredProducts = products filtered by price
            const [min, max] = values;
            const filtered = products.filter(
                (p) => p.price >= min && p.price <= max
            );
            setFilteredProducts(filtered);
            return;
        }

        // If searching, apply search ON TOP of price
        const lower = inputValue.toLowerCase();
        const [min, max] = values;

        const result = products.filter(
            (p) =>
                p.price >= min &&
                p.price <= max &&
                (p.name.toLowerCase().includes(lower) ||
                    p.category.name.toLowerCase().includes(lower))
        );

        setFilteredProducts(result);

    }, [inputValue, values, products]);

    // Apply sorting to filtered products
    useEffect(() => {
        const sorted = [...filteredProducts];

        switch (sortBy) {
            case "price-low-to-high":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-high-to-low":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "name-a-z":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-z-a":
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "best-seller":
                sorted.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
                break;
            case "top-rated":
                sorted.sort((a, b) => b.averageRating - a.averageRating);
                break;
            case "recommended":
            default:
                // Keep original order (recommended)
                break;
        }

        setSortedProducts(sorted);
    }, [filteredProducts, sortBy]);



    // ============ Skeleton loader for filter checkboxes ============
    function SkeletonCheckboxRow() {
        return (
            <div className="flex items-center gap-2.5 animate-pulse">
                <div className="h-4 w-4 rounded-sm bg-gray-200 dark:bg-gray-600" />
                <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-600" />
            </div>
        );
    }

    // ================ Category slider logic ================
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const categoryContentRef = useRef<HTMLDivElement | null>(null);
    const [categoryMaxHeight, setCategoryMaxHeight] = useState<string>("0px");

    // measure content height and set max-height value
    useLayoutEffect(() => {
        const setMeasuredHeight = () => {
            const el = categoryContentRef.current;
            if (!el) return;
            // get real content height
            const height = el.scrollHeight;
            setCategoryMaxHeight(`${height}px`);
        };

        setMeasuredHeight();

        // watch for resizes/dynamic content changes
        const ro = new ResizeObserver(() => {
            setMeasuredHeight();
        });
        if (categoryContentRef.current) ro.observe(categoryContentRef.current);

        // also update on window resize
        window.addEventListener("resize", setMeasuredHeight);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", setMeasuredHeight);
        };
    }, [categories, loadingFilters]);

    const containerStyle: React.CSSProperties = {
        maxHeight: isCategoryOpen ? categoryMaxHeight : "0px",
        overflow: "hidden",
        transition: "max-height 400ms ease, opacity 300ms ease",
        opacity: isCategoryOpen ? 1 : 0,
    };

    return (
        <div className='pt-4 max-w-screen-2xl mx-auto overflow-x-hidden'>
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

            <div className="flex transition-all duration-500 ease-in-out overflow-x-hidden">
                {/* Main section */}
                <div className={`transition-all duration-500 ease-in-out min-w-0 flex-shrink
                ${filterBarOpen
                        ? "flex-1 md:flex-3"
                        : "flex-1 md:flex-4"
                    }`}>

                    {/* Top filters */}
                    <div className="space-y-3 p-3 md:p-4 border-b border-[#E3E3E3]">
                        {/* MOBILE: Category First */}
                        <div className="lg:hidden">
                            <p className="font-medium text-sm mb-2">Category</p>
                            {loadingFilters ? (
                                <div className="w-full h-12 rounded-lg bg-gray-200 animate-pulse"></div>
                            ) : (
                                <select
                                    className='w-full py-3.5 px-4 rounded-lg border-2 border-[#71BF45] bg-[#71BF4508] focus:outline-none text-base font-medium'
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                       
                        

                        {/* MOBILE: Sort and Filter buttons in a row */}
                        <div className="lg:hidden flex gap-2">
                            {/* Sort By */}
                            <div className="flex-1">
                                <select
                                    name="Sort By"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className='w-full py-2.5 px-3 rounded-lg border border-[#e3e3e3] text-sm focus:outline-none appearance-none bg-white'
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                                >
                                    <option value="recommended">Sort: Recommended</option>
                                    <option value="price-low-to-high">Price: Low to High</option>
                                    <option value="price-high-to-low">Price: High to Low</option>
                                    <option value="name-a-z">Name: A to Z</option>
                                    <option value="name-z-a">Name: Z to A</option>
                                    <option value="best-seller">Best Sellers</option>
                                    <option value="top-rated">Top Rated</option>
                                </select>
                            </div>

                            {/* Filter Button */}
                            <button
                                onClick={handleOpenFilters}
                                className='relative flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-[#71BF45] bg-[#71BF4508] text-sm font-medium transition-all hover:bg-[#71BF4515]'
                            >
                                <CiFilter size={18} />
                                <span>Filters</span>
                                {(selectedProductTypes.length > 0 || selectedBenefits.length > 0) && (
                                    <span className="absolute -top-1 -right-1 bg-[#71BF45] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {selectedProductTypes.length + selectedBenefits.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* DESKTOP: Original layout */}
                        <div className="hidden lg:flex flex-col gap-4 lg:flex-row items-center justify-between">
                            

                            <div className="w-full lg:flex-1 flex justify-between lg:justify-end items-center gap-4">
                                {/* FILTERS */}
                                <label
                                    htmlFor="select"
                                    className='flex items-center py-2 px-3 gap-5 rounded-lg border border-[#e3e3e3] text-base font-medium'
                                >
                                    <p className='text-[#848484]'>Sort by:</p>
                                    <select
                                        name="Sort By"
                                        id="select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className='focus:outline-none'
                                    >
                                        <option value="recommended">Recommended</option>
                                        <option value="price-low-to-high">Price: Low to High</option>
                                        <option value="price-high-to-low">Price: High to Low</option>
                                        <option value="name-a-z">Name: A to Z</option>
                                        <option value="name-z-a">Name: Z to A</option>
                                        <option value="best-seller">Best Sellers</option>
                                        <option value="top-rated">Top Rated</option>
                                    </select>
                                </label>

                                <div
                                    onClick={() => setFilterBarOpen(!filterBarOpen)}
                                    className='flex items-center py-2 px-3 gap-5 rounded-lg border border-[#e3e3e3] text-base font-medium transition-all cursor-pointer'
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

                        {/* DESKTOP: Category section */}
                        <div className="hidden lg:block space-y-4 lg:p-4 w-full">
                            <div
                                className="flex items-center cursor-pointer w-fit"
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            >
                                <p className="font-medium">Category</p>
                                <span
                                    className={`transform transition-transform duration-300
                                        ${isCategoryOpen ? "rotate-0" : "-rotate-180"}`}
                                >
                                    <ChevronDown size={20} />
                                </span>
                            </div>

                            {/* DESKTOP VERSION */}
                            <div
                                style={containerStyle}
                                className={`hidden lg:block ${!isCategoryOpen && "-mb-8"}`}
                                aria-hidden={!isCategoryOpen}
                            >
                                <div
                                    ref={categoryContentRef}
                                    className="hidden lg:grid grid-cols-3 gap-4">
                                    {loadingFilters ? (
                                        Array.from({ length: 6 }).map((_, i) => (
                                            <div key={i} className="flex items-center gap-2.5">
                                                {/* Fake checkbox */}
                                                <div className="w-4 h-4 bg-gray-300 rounded-sm animate-pulse"></div>

                                                {/* Fake label */}
                                                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                                            </div>
                                        ))
                                    ) : categories.map((category) => (
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
                    </div>

                    {/* Products Section */}
                    <div className="overflow-y-scroll scrollbar-hide">
                        {error ? (
                            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-semibold text-red-600">Error Loading Products</h3>
                                    <p className="text-gray-600">{error}</p>
                                    {retryCount > 0 && (
                                        <p className="text-sm text-gray-500">Retry attempt: {retryCount}/2</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setError(null);
                                        setRetryCount(0);
                                        window.location.reload();
                                    }}
                                    className="px-6 py-2 bg-[#71BF45] text-white rounded-lg hover:bg-[#5da838] transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : loadingProducts ? (
                            <div className={`p-4 grid ${filterBarOpen ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"} gap-2.5 md:gap-5`}>
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <div className="w-full">
                                <NoProductsComponent />
                            </div>
                        ) : (
                            <div className={`p-4 grid ${filterBarOpen ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"} gap-2.5 md:gap-5`}>
                                {sortedProducts.map((data) => (
                                    <Product product={data} key={data._id} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Overlay */}
                {filterBarOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                        onClick={() => setFilterBarOpen(false)}
                    />
                )}

                {/* Sidebar: Filters section */}
                <div className={`
                transition-all duration-500 ease-in-out
                overflow-y-scroll scrollbar-hide
                bg-white border border-[#f4f4f4] flex-shrink-0
                flex flex-col

                md:static md:h-auto md:block md:z-auto
                ${filterBarOpen
                        ? "md:w-[300px] md:opacity-100"
                        : "md:w-0 md:opacity-0"
                    }

                    fixed right-0 top-0 h-screen z-50
                    ${filterBarOpen
                        ? "translate-x-0 opacity-100 w-[280px] sm:w-[300px]"
                        : "translate-x-full opacity-0 w-0"
                    }
                    `}  >
                    <div className='space-y-5 pt-4 px-[20.5px] flex-1 pb-24 md:pb-5'>
                        <div className="flex items-center justify-between">
                            <h2 className='text-[#093C16] text-2xl font-medium px-2.5'>Filter by</h2>
                            <RxCross1 className='md:hidden cursor-pointer' onClick={() => setFilterBarOpen(false)} />
                        </div>

                        {/* Clear All Filters - Mobile only */}
                        <button
                            onClick={clearAllFilters}
                            className="md:hidden w-full text-sm text-[#71BF45] underline text-left px-2.5"
                        >
                            Clear all filters
                        </button>

                        {/* PRODUCT TYPE FILTER */}
                        <div className="border border-[#e3e3e3] rounded-xl p-5 space-y-5">
                            <h3 className='font-medium text-xl'>Product Type</h3>
                            <div className="space-y-5">
                                {loadingFilters
                                    ? Array.from({ length: 4 }).map((_, i) => (
                                        <SkeletonCheckboxRow key={i} />
                                    ))
                                    : productTypes.map((product) => (
                                        <div key={product._id} className="flex items-center gap-5 border border-[#71BF45] rounded-lg p-2.5">
                                            <input
                                                type="checkbox"
                                                id={`mobile-product-${product._id}`}
                                                checked={(filterBarOpen && isMobile) ? tempProductTypes.includes(product._id) : selectedProductTypes.includes(product._id)}
                                                onChange={() =>
                                                    toggleSelection(product._id, isMobile ? setTempProductTypes : setSelectedProductTypes)
                                                }
                                            />
                                            <label htmlFor={`mobile-product-${product._id}`} className='text-[#848484] cursor-pointer'>
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
                                values={isMobile ? tempPriceRange : values}
                                onChange={(vals) => isMobile ? setTempPriceRange(vals) : setValues(vals)}
                                renderTrack={({ props, children }) => {
                                    // Calculate slider fill percentages
                                    const currentValues = isMobile ? tempPriceRange : values;
                                    const percentage1 = ((currentValues[0] - MIN) / (MAX - MIN)) * 100;
                                    const percentage2 = ((currentValues[1] - MIN) / (MAX - MIN)) * 100;

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
                                    <p className='border border-[#e3e3e3] py-[5px] px-2.5 rounded-[5px]'>₹{isMobile ? tempPriceRange[0] : values[0]}</p>
                                </div>
                                <div className="space-y-2">
                                    <p>To</p>
                                    <p className='border border-[#e3e3e3] py-[5px] px-2.5 rounded-[5px]'>₹{isMobile ? tempPriceRange[1] : values[1]}</p>
                                </div>
                            </div>
                        </div>

                        {/* BENEFITS FILTER */}
                        <div className="border border-[#e3e3e3] rounded-xl p-5 space-y-5">
                            <h3 className='font-medium text-xl'>Benefits</h3>
                            <div className="space-y-5">
                                {loadingFilters
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                        <SkeletonCheckboxRow key={i} />
                                    ))
                                    : benefits.map((benefit) => (
                                        <div key={benefit._id} className="flex items-center gap-2.5">
                                            <input
                                                type="checkbox"
                                                id={`mobile-benefit-${benefit._id}`}
                                                checked={(filterBarOpen && isMobile) ? tempBenefits.includes(benefit._id) : selectedBenefits.includes(benefit._id)}
                                                onChange={() =>
                                                    toggleSelection(benefit._id, isMobile ? setTempBenefits : setSelectedBenefits)
                                                }
                                            />
                                            <label htmlFor={`mobile-benefit-${benefit._id}`} className='text-[#848484] cursor-pointer'>{benefit.name}</label>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Apply Button - Sticky at bottom on mobile */}
                    <div className="md:hidden sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E3E3E3] mt-auto">
                        <button
                            onClick={applyFilters}
                            className="w-full py-3 bg-[#71BF45] text-white font-medium rounded-lg hover:bg-[#5da838] transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page