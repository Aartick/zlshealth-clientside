/**
 * FAQ Component
 *
 * This component displays a list of frequently asked questions (FAQs) with expandable answers.
 * Users can click on a question to expand or collapse its answer.
 * Only one answer is shown at a time for better readability.
 */

"use client";

import React, { useState } from "react";
import { SlArrowDown } from "react-icons/sl";

// Array of FAQ questions and answers
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
  // State to track which FAQ is open (expanded)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle open/close for a FAQ item
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {/* Render each FAQ item */}
      {faqs.map((faq, index) => (
        <div key={index}>
          {/* Question row, clickable to expand/collapse answer */}
          <div
            className="flex justify-between items-center px-2.5 pb-2.5 border-b-2 sm:border-b-[3px] border-[#e3e3e3] cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <p className="text-[#093C16] text-sm font-medium">
              {faq.question}
            </p>
            {/* Arrow icon rotates when open */}
            <SlArrowDown
              className={`w-5 h-5 transform transition-transform duration-300 ${openIndex === index ? "rotate-90" : ""
                }`}
            />
          </div>

          {/* Answer section, expands/collapses with animation */}
          <div
            className={`pt-3 overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index
                ? "max-h-60 sm:max-h-40 opacity-100"
                : "max-h-0 opacity-0"
              }`}
          >
            <p className="px-2.5 pb-2.5 text-sm text-gray-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
