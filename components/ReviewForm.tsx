"use client";
import { axiosClient } from "@/utils/axiosClient";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { IoStarSharp } from "react-icons/io5";

export default function ReviewForm({
    productId,
    onClose,
}: {
    productId: string;
    onClose: () => void;
}) {
    const [rating, setRating] = useState<number | null>(null);
    const [hover, setHover] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);

    // Close when pressing ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // Close when clicking outside modal
    const handleOutsideClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const handleSubmit = async () => {
        if (!rating || !comment) return;

        try {
            setLoading(true);

            const res = await axiosClient.post("/api/products/review", {
                productId,
                rating,
                comment,
            });
            toast.success("done")
            toast.success(res.data.result);
            onClose();
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] transition-opacity animate-fadeIn"
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl max-w-xl w-full mx-4 animate-slideIn"
            >
                <h3 className="text-2xl font-semibold text-[#093C16] mb-4">
                    Write a Review
                </h3>

                {/* Rating Stars */}
                <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <IoStarSharp
                            key={star}
                            size={36}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(null)}
                            className={`cursor-pointer transition-all ${(hover ?? rating!) >= star
                                ? "text-[#71BF45] scale-110"
                                : "text-gray-300"
                                }`}
                        />
                    ))}
                </div>

                {/* Comment Box */}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share details about your experience..."
                    className="w-full p-4 text-gray-900 bg-[#e3e3e3] rounded-xl outline-none focus:ring-2 focus:ring-[#71bf45] resize-none"
                    rows={4}
                />

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!rating || !comment || loading}
                    className={`mt-4 w-full py-3 rounded-xl text-lg font-semibold transition-all ${!rating || !comment || loading
                        ? "bg-[#e3e3e3] text-gray-500 cursor-not-allowed"
                        : "bg-[#093C16] hover:bg-[#093C16]/95 text-white"
                        }`}
                >
                    {loading ? "Submitting..." : "Submit Review"}
                </button>
            </div>
        </div>
    );
}
