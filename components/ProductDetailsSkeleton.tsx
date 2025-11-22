export default function ProductDetailsSkeleton() {
  return (
    <div className="flex-1 px-3 py-3 md:py-10 lg:py-6 animate-pulse">
      {/* Name, about & price section */}
      <div className="space-y-4 border-b-[3px] border-[#e3e3e3] px-2.5 pb-5">

        {/* Product name */}
        <div className="space-y-2">
          <div className="h-6 w-40 bg-gray-200 rounded"></div>
          <div className="h-4 w-56 bg-gray-200 rounded"></div>
        </div>

        {/* Description */}
        <div className="h-10 w-full bg-gray-200 rounded"></div>

        {/* Price & taxes */}
        <div className="space-y-2">
          <div className="h-6 w-28 bg-gray-200 rounded"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Quantity dropdown */}
        <div className="space-y-2 w-fit">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-9 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Buttons */}
        <div className="flex md:flex-col lg:flex-row items-center gap-3">
          <div className="h-10 rounded-md bg-gray-200 w-full"></div>
          <div className="h-10 rounded-md bg-gray-200 w-full"></div>
        </div>
      </div>

      {/* Quick product details */}
      <div className="border-b-[3px] border-[#e3e3e3] px-2.5 py-5 space-y-5">
        <div className="h-4 w-40 bg-gray-200 rounded"></div>

        {/* 5 List items skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2.5">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-3 w-40 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
