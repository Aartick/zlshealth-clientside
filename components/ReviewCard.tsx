/**
 * ReviewCard Component
 * Displays a single customer review card.
 *
 * Props:
 * - data {Object}: Review data containing image, title, name, designation, and review text.
 *
 * Usage:
 * - Shows reviewer image, rating (stars), review title, reviewer name, designation, and review text.
 * - Used for testimonial or review sections in product or landing pages.
 */

import Image from "next/image";
import { IoStarSharp } from "react-icons/io5";

function ReviewCard({ data }: any) {
    return (
        // Card container
        <div className="flex items-center w-[344px] sm:w-[933px] gap-5 sm:gap-[55px] rounded-[20px] sm:rounded-[40px] p-3 sm:p-[30px] mb-5 shadow-lg shadow-[#b9b9b9]">
            {/* Reviewer image */}
            <div className="relative h-[174px] w-full sm:h-[338px]">
                <Image
                    src={data.img}
                    alt="review img"
                    fill
                    className="rounded-[10px] sm:rounded-[20px] border-4 border-[#71BF45]"
                />
            </div>
            {/* Review details section */}
            <div className="space-y-3 sm:space-y-10">
                {/* Rating row (5 stars + rating value) */}
                <div className="flex items-center text-[#71BF45]">
                    <IoStarSharp size={16} />
                    <IoStarSharp size={16} />
                    <IoStarSharp size={16} />
                    <IoStarSharp size={16} />
                    <IoStarSharp size={16} />
                    <p className="font-normal text-xs text-[#848484]">4.8</p>
                </div>

                {/* Reviewer name, title, and designation */}
                <div className="space-y-0.5 sm:space-y-2 font-normal">
                    <p className="text-xs sm:text-2xl">{data.title}</p>
                    <p className="text-xs sm:text-base text-[#36810B]">{data.name}</p>
                    <p className="text-xs sm:text-base text-[#848484]">{data.designation}</p>
                </div>

                {/* Review text */}
                <p className="font-normal italic text-xs sm:text-base">
                    {data.review}
                    <span className="text-blue-500">see more.</span>
                </p>
            </div>
        </div>
    );
}

export default ReviewCard;
