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

import { product } from "@/interfaces/products";
import Image from "next/image";
import WishlistButton from "./WishlistButton";
import CartButton from "./CartButton";
import Link from "next/link";

interface ProductProps {
    product: product
}

function ProductCard({ product }: ProductProps) {
    const discountedPrice = (product.price - (product.price * product.discount / 100)).toFixed(2);

    return (
        // Product card container
        <div className="rounded-3xl p-3 bg-white border border-[#71BF45] space-y-[18px] shadow-2xl">
            {/* Product image section */}
            <div className="relative h-[150px] sm:h-[259px] w-full">
                <Image
                    src={product.productImg.url}
                    fill
                    alt={product.name}
                    className="rounded-[10px] sm:rounded-[14px]"
                />
                {/* Wishlist (favorite) icon */}
                <div className="flex items-center justify-between w-full absolute top-3 px-3">
                    <div className="border bg-white p-2.5">
                        <div className="size-2.5 rounded-full bg-[#71BF45]" />
                    </div>
                    <WishlistButton product={product} />
                </div>
            </div>

            {/* Product title and about */}
            <Link href={`/productDescription/${product._id}`}>
                <p className="font-medium text-base sm:text-2xl">{product.name}</p>
                <p className="font-medium text-xs sm:text-sm text-[#848484]">
                    {product.about}
                </p>
            </Link>

            {/* Price row with discount info */}
            <p className="font-extrabold text-base sm:text-xl text-[#093C16]">
                ₹{discountedPrice}{" "}
                {product.discount !== 0 && (
                    <>
                        <span className="font-normal text-xs line-through text-[#848484]">
                            ₹{product.price}
                        </span>{" "}
                        <span className="text-medium text-xs text-[#71BF45]">({product.discount}% off)</span>
                    </>
                )}
            </p>

            {/* Add to cart button component*/}
            <CartButton product={product} />
        </div>
    );
}

export default ProductCard;
