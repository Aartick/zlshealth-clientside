import React from "react";

export default function ProductSkeleton() {
    return (
        <div className="rounded-[10px] sm:rounded-[22px] p-[10px] border-2 border-[#d9d9d9] space-y-[15px] animate-pulse">
            {/* Image Skeleton */}
            <div className="relative h-[150px] sm:h-[300px]">
                <div className="w-full h-full bg-gray-200 rounded-[10px] sm:rounded-[20px]" />
                {/* Best Seller Skeleton */}
                <div className="absolute top-5 left-[3px]">
                    <div className="w-20 h-6 bg-gray-300 rounded" />
                </div>
            </div>

            {/* Rating Skeleton */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
                <div className="p-[3px] sm:p-[5px] border">
                    <div className="rounded-full bg-gray-300 size-2 sm:size-[10px]" />
                </div>
            </div>

            {/* Title Skeleton */}
            <div className="space-y-2">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>

            {/* Tags Skeleton */}
            <div className="flex items-center gap-2.5 overflow-x-scroll scrollbar-hide">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="border-2 border-[#e3e3e3] py-[5px] px-5 rounded-[30px] bg-gray-200 h-6 w-16"
                    />
                ))}
            </div>

            {/* Highlight Skeleton */}
            <div className="h-4 w-32 bg-gray-200 rounded" />

            {/* Price Skeleton */}
            <div className="flex items-center gap-2">
                <div className="h-6 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-300 rounded" />
            </div>
        </div>
    );
}
