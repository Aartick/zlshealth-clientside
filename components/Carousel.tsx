import React, { useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const slides = [
  {
    id: 1,
    image: "/Carousel.png",
    title: "Science-Backed Herbal Care",
    subTitle: "Expert-formulated supplements to support your wellness journey.",
  },
  {
    id: 2,
    image: "/reviewImg2.jpg",
    title: "Science-Backed Herbal Care",
    subTitle: "Expert-formulated supplements to support your wellness journey.",
  },
  {
    id: 3,
    image: "/reviewImg3.jpg",
    title: "Science-Backed Herbal Care",
    subTitle: "Expert-formulated supplements to support your wellness journey.",
  },
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative overflow-hidden w-[1264px] h-[624px] rounded-3xl">
      <div className="relative w-full h-full">
        <div
          key={slides[currentIndex].id}
          className={`absolute w-full h-full transition-transform duration-700 ease-in-out ${
            direction === "right"
              ? "translate-x-0 animate-slide-in-right"
              : "translate-x-0 animate-slide-in-left"
          }`}
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-fill border-2 border-[#f3f3f3] rounded-3xl"
          />

          {/* Content on top-left */}
          <div className="absolute top-10 left-[50px] space-y-[30px]">
            <h2 className="text-[50px] font-normal">
              {slides[currentIndex].title}
            </h2>
            <p className="text-2xl font-normal">
              {slides[currentIndex].subTitle}
            </p>
            <button className="py-[10px] px-5 rounded-[10px] bg-[#093C16] font-semibold text-2xl text-white">
              Shop Now
            </button>
          </div>
        </div>

        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 text-black p-2 rounded-full shadow-md transition backdrop-blur-sm cursor-pointer"
        >
          <MdOutlineKeyboardArrowLeft size={30} />
        </button>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 text-black p-2 rounded-full shadow-md transition backdrop-blur-sm cursor-pointer"
        >
          <MdOutlineKeyboardArrowRight size={30} />
        </button>
      </div>
    </div>
  );
}
