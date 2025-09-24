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

function ProductCard() {
    return (
        // Product card container
        <div className="rounded-3xl p-3 bg-white border border-[#71BF45] space-y-[18px] shadow-2xl">
            {/* Product image section */}
            <div className="relative h-[150px] sm:h-[259px] w-full">
                <Image
                    src='/prodImg.png'
                    fill
                    alt="productImg"
                    className="rounded-[10px] sm:rounded-[14px]"
                />
                {/* Wishlist (favorite) icon */}
                <div className="flex items-center justify-between w-full absolute top-3 px-3">
                    <div className="border bg-white p-2.5">
                        <div className="size-2.5 rounded-full bg-[#71BF45]" />
                    </div>
                    <div className="rounded-full p-2.5 bg-[#ffffff] text-[#2e2e2e] text-[18px]">
                        <BsSuitHeart />
                    </div>
                </div>
            </div>

            {/* Product title and about */}
            <div>
                <p className="font-medium text-base sm:text-2xl">Diavinco</p>
                <p className="font-medium text-xs sm:text-sm text-[#848484]">
                    Blood Sugar Control Tablet
                </p>
            </div>

            {/* Price row with discount info */}
            <p className="font-extrabold text-base sm:text-xl text-[#093C16]">
                ₹ 1,300.00{" "}
                <span className="font-normal text-xs line-through text-[#848484]">
                    ₹ 1,500.00
                </span>
                <span className="text-medium text-xs text-[#71BF45]">(28% off)</span>
            </p>

            {/* Add to cart button (no logic, just UI) */}
            <button className="
            py-[5px] sm:py-3
            border border-[#093C16]
            rounded-md sm:rounded-[10px]
            bg-white text-[#093C16]
            hover:bg-[#093C16] hover:text-[#ffffff] 
            font-semibold w-full cursor-pointer"
            >
                Add To Cart
            </button>
        </div>
    );
}

export default ProductCard;
