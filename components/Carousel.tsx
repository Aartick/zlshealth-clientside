/**
 * Carousel Component
 *
 * This component displays an image carousel with slide transitions.
 * Users can navigate between slides using left/right arrow buttons.
 * Each slide shows an image, title, subtitle, and a "Shop Now" button.
 * The carousel animates transitions and is styled responsively.
 */

import Image from "next/image";
import React, { useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

// Array of slides for the carousel
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
  // State for current slide index
  const [currentIndex, setCurrentIndex] = useState(0);
  // State for slide direction (used for animation)
  const [direction, setDirection] = useState("right");

  // Go to previous slide
  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Go to next slide
  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    // Carousel container
    <div className="relative w-full max-w-[1264px] aspect-[2/1] sm:aspect-[2.3/1] mx-auto rounded-3xl overflow-hidden">
      <div className="relative w-full h-full">
        {/* Slide content with transition animation */}
        <div
          key={slides[currentIndex].id}
          className={`absolute w-full h-full transition-all duration-700 ease-in-out ${
            direction === "right"
              ? "translate-x-0 animate-slide-in-right"
              : "translate-x-0 animate-slide-in-left"
          }`}
        >
          {/* Slide image */}
          <Image
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            fill
            sizes="100vw"
            className="object-fill rounded-3xl"
            priority
          />

          {/* Slide text and button overlay */}
          <div className="absolute top-6 sm:top-10 left-4 sm:left-10 space-y-4 sm:space-y-[30px] max-w-[90%] sm:max-w-[60%]">
            <h2 className="text-2xl sm:text-4xl md:text-[50px] font-normal text-white drop-shadow-lg">
              {slides[currentIndex].title}
            </h2>
            <p className="text-base sm:text-xl md:text-2xl font-normal text-white drop-shadow">
              {slides[currentIndex].subTitle}
            </p>
            <button className="py-2 sm:py-[10px] px-4 sm:px-5 rounded-[10px] bg-[#093C16] font-semibold text-white text-base sm:text-xl cursor-pointer">
              Shop Now
            </button>
          </div>
        </div>

        {/* Previous slide button */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-1 sm:left-4 transform -translate-y-1/2 text-white p-2 rounded-full shadow-md transition backdrop-blur-sm cursor-pointer"
        >
          <MdOutlineKeyboardArrowLeft size={30} />
        </button>

        {/* Next slide button */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-1 sm:right-4 transform -translate-y-1/2 text-white p-2 rounded-full shadow-md transition backdrop-blur-sm cursor-pointer"
        >
          <MdOutlineKeyboardArrowRight size={30} />
        </button>
      </div>
    </div>
  );
}
