/**
 * FAQ Component
 *
 * This component displays a list of frequently asked questions (FAQs) with expandable answers.
 * Users can click on a question to expand or collapse its answer.
 * Only one answer is shown at a time for better readability.
 */

"use client";

import { axiosClient } from "@/utils/axiosClient";
import React, { useEffect, useState } from "react";
import { SlArrowDown } from "react-icons/sl";

interface productId {
  productId?: string
}

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

export default function FAQ({ productId }: productId) {
  // State to track which FAQ is open (expanded)
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([])


  // Toggle open/close for a FAQ item
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    //    Fetch FAQs
    const fetchFaqs = async () => {
      try {
        const res = await axiosClient.get(`/api/products/faq?productId=${productId}`)
        const data = res.data.result;
        if (!data.items) {
          setFaqs([])
          return
        }

        setFaqs(data.items)
      } catch { }
    }

    fetchFaqs()
  }, [productId])

  return (
    <div className="space-y-3 px-6">
      {/* Render each FAQ item */}
      {
        faqs.length !== 0 ?
          faqs.map((faq, index) => (
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
          ))
          : (
            <></>
          )
      }
    </div>
  );
}
