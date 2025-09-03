/**
 * ProductCard Component
 * Displays a static product card for use in product grids or lists.
 *
 * Props:
 * - None (static demo card, no dynamic props).
 *
 * State/Derived:
 * - None (all values are hardcoded for demo purposes).
 *
 * Usage:
 * - Shows product image, name, about, rating, price (with discount), and wishlist icon.
 * - Users can click "Add To Cart" (no actual cart logic here).
 * - Used for skeleton/demo display or placeholder product cards.
 */

import Image from "next/image";
import { BsSuitHeart } from "react-icons/bs";
import { IoStarSharp } from "react-icons/io5";

function ProductCard() {
    return (
        // Product card container
        <div className="rounded-[10px] sm:rounded-[22px] p-[10px] border-2 border-[#d9d9d9] space-y-[15px]">
            {/* Product image section */}
            <div className="relative h-[150px] sm:size-[225px]">
                <Image
                    src='/prodImg.png'
                    fill
                    alt="productImg"
                    className="border-[3px] border-[#e3e3e3] rounded-[10px] sm:rounded-[20px]"
                />
                {/* Wishlist (favorite) icon */}
                <div className="absolute top-3 right-3 rounded-[30px] p-[10px] bg-[#ffffff] text-[#2e2e2e] text-[18px] sm:text-2xl">
                    <BsSuitHeart />
                </div>
            </div>

            {/* Rating row */}
            <div className="flex justify-between items-center">
                <p className="flex items-center text-[#848484] font-medium text-xs sm:text-base">
                    <span className="flex items-center text-[#71BF45]">
                        {/* 5 full stars */}
                        <IoStarSharp />
                        <IoStarSharp />
                        <IoStarSharp />
                        <IoStarSharp />
                        <IoStarSharp />
                    </span>
                    4.5
                </p>
                {/* Stock indicator dot */}
                <div className="p-[3px] sm:p-[5px] border">
                    <div className="rounded-full bg-[#71bf45] size-2 sm:size-[10px]"></div>
                </div>
            </div>

            {/* Product title and about */}
            <div>
                <p className="font-medium text-base sm:text-2xl">Diavinco</p>
                <p className="font-medium text-xs sm:text-base text-[#848484]">
                    Blood Sugar Control Tablet
                </p>
            </div>

            {/* Price row with discount info */}
            <p className="font-semibold text-base sm:text-2xl text-[#36810B]">
                ₹ 1,300.00{" "}
                <span className="font-normal text-xs line-through text-[#848484]">
                    ₹ 1,500.00
                </span>
            </p>

            {/* Add to cart button (no logic, just UI) */}
            <button className="bg-[#093C16] rounded-md sm:rounded-[10px] py-[5px] sm:py-3 px-[10px] text-[#ffffff] font-semibold text-base w-full">
                Add To Cart
            </button>
        </div>
    );
}

export default ProductCard;
