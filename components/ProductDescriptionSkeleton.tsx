import React from "react";

const ProductDescriptionSkeleton = () => {
    return (
        <div className="flex-1 p-3 md:p-6 flex space-x-4">
            {/* Thumbnail skeletons */}
            <div className="flex flex-col space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-[150px] h-[150px] rounded-md bg-gray-200 animate-pulse"
                    />
                ))}
            </div>

            {/* Main product image skeleton */}
            <div className="flex-2 relative w-[525px] md:h-[492px]">
                <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-gray-200 rounded-full animate-pulse" />

                <div className="w-full h-full rounded-md bg-gray-200 animate-pulse" />
            </div>
        </div>
    );
};

export default ProductDescriptionSkeleton;
