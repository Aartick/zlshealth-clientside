"use client";

import React, { useState } from "react";
import { SlArrowDown } from "react-icons/sl";

const faqs = [
  {
    question: "Ingredients & Usage",
    answer:
      "This product contains natural herbs and vitamins designed to support healthy blood sugar levels. Use 1 caplet daily after meals.",
  },
  {
    question: "How Diavinco Helps",
    answer:
      "Diavinco helps regulate blood sugar, improve insulin sensitivity, and boost overall energy levels through its herbal formula.",
  },
  {
    question: "Targets These Conditions",
    answer:
      "Supports those with prediabetes, type 2 diabetes, and individuals seeking improved metabolic health.",
  },
  {
    question: "Still Have Questions?",
    answer:
      "You can contact our support team at support@example.com for further inquiries.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-5 sm:space-y-[30px]">
      {faqs.map((faq, index) => (
        <div key={index}>
          {/* Question */}
          <div
            className="flex justify-between items-center px-2.5 sm:px-4 pb-3 sm:pb-5 border-b-[2px] sm:border-b-[3px] border-[#e3e3e3] cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <p className="text-[#093C16] text-lg sm:text-2xl font-semibold">
              {faq.question}
            </p>
            <SlArrowDown
              className={`w-5 h-5 sm:w-6 sm:h-6 transform transition-transform duration-300 ${openIndex === index ? "rotate-90" : ""
                }`}
            />
          </div>

          {/* Answer */}
          <div
            className={`pt-3 sm:pt-5 overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index
                ? "max-h-60 sm:max-h-40 opacity-100"
                : "max-h-0 opacity-0"
              }`}
          >
            <p className="px-2.5 sm:px-4 pb-3 sm:pb-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
