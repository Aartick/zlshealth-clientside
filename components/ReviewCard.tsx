import { IoStarSharp } from "react-icons/io5";

function ReviewCard({ data }: any) {
    return (
        <div className="flex items-center w-[933px] gap-[55px] rounded-[40px] p-[30px] mb-5 shadow-lg shadow-[#b9b9b9]">
            <img
                src={data.img}
                alt="review img"
                className="w-[320px] h-[338px] rounded-[20px] border-4 border-[#71BF45]"
            />
            <div className="space-y-10">
                <div className="flex items-center text-[#71BF45]">
                    <IoStarSharp size={16} />
                    <IoStarSharp size={16} />
                    <IoStarSharp size={16} />
                    <IoStarSharp size={16} />
                    <IoStarSharp size={16} />
                    <p className="font-normal text-xs text-[#848484]">4.8</p>
                </div>

                <div className="space-y-2 font-normal">
                    <p className="text-2xl">{data.title}</p>
                    <p className="text-base text-[#36810B]">{data.name}</p>

                    <p className="text-base text-[#848484]">{data.designation}</p>
                </div>

                <p className="font-normal italic text-base">
                    {data.review}
                    <span className="text-blue-500">see more.</span>
                </p>
            </div>
        </div>
    );
}

export default ReviewCard;
