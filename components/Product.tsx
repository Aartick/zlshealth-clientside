/**
 * Product Component
 * Displays a single product card in a product grid or list.
 *
 * Props:
 * - product {ProductType}: The product object to display.
 *
 * State/Derived:
 * - rating {number}: Hardcoded product rating for display.
 * - discountedPrice {number}: Price after applying discount.
 *
 * Functions:
 * - renderStars: Renders star icons based on rating.
 *
 * Usage:
 * - Shows product image, name, about, tags, highlights, rating, price (with discount), and "Best Seller" badge.
 * - Users can add the product to their cart or wishlist directly from the card.
 * - Clicking the product name navigates to the product description page.
 */

"use client"

import Image from 'next/image';
import Link from 'next/link';
import CartButton from './CartButton';
import WishlistButton from './WishlistButton';
import { product } from '@/interfaces/products';

interface ProductProps {
    product: product
}

function Product({ product }: ProductProps) {
    // Calculate discounted price
    const discountedPrice = (product.price - (product.price * product.discount / 100)).toFixed(2);

    return (
        // Product card container
        <div className="rounded-3xl p-3 bg-white border border-[#71BF45] space-y-[18px]">
            {/* Product image section */}
            <div className="relative h-[150px] sm:h-[300px]">
                <Image
                    src={product.productImg.url}
                    fill
                    alt={product.name}
                    className="rounded-[10px] sm:rounded-[20px] object-cover"
                />
                {/* Best Seller badge */}
                {product.bestSeller && (<div className="absolute top-5 left-[3px] inline-block">
                    <div
                        className="bg-[#71BF45] text-white text-xs font-bold px-3 py-2"
                        style={{
                            clipPath:
                                'polygon(0 0, 100% 0, calc(100% - 8px) 50%, 100% 100%, 0 100%)'
                        }}
                    >
                        Best Seller
                    </div>
                </div>)}

                {/* Wishlist (favorite) icon */}
                <div className="absolute top-3 right-3">
                    <WishlistButton product={product} />
                </div>
            </div>

            {/* Product title and about, links to product description */}
            <Link href={`/productDescription/${product._id}`}>
                <p className="font-medium text-base sm:text-2xl h-[50px] md:h-[64px] line-clamp-2">{product.name}</p>
                <p className="font-medium text-xs sm:text-base text-[#848484] line-clamp-2">
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
                        <span className="font-medium text-xs text-[#71BF45]">({product.discount}% off)</span>
                    </>
                )}
            </p>

            {/* Add to cart button */}
            <CartButton product={product} />
        </div >
    );
}

export default Product
