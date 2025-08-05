
function BenefitsCard({ data }: any) {
    return (
        <div className="w-[407px] rounded-[26px] p-[20px] border border-[#cdcdcd] space-y-[16px] shadow-md shadow-[#cdcdcd]">
            <div className="relative">
                <img src={data.img} className="rounded-2xl w-full h-[270px]" />
                <p className="absolute left-3 right-3 bottom-2 rounded-[40px] border border-[#e3e3e3] py-[7px] px-4 font-normal text-base text-center text-nowrap text-[#ffffff] backdrop-blur-sm">
                    {data.title}
                </p>
            </div>

            <p className="text-center text-base font-normal text-[#093C16]">
                {data.description}
            </p>
        </div>
    );
}

export default BenefitsCard;
