import { useState } from "react";

const CommentText = ({ text }: { text: string }) => {
    const maxLength = 60; // you can adjust
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => setIsExpanded(!isExpanded);

    const formatted = text?.replace(/\n/g, "<br/>");

    const isLongText = text?.length > maxLength;
    const displayedText = isExpanded
        ? formatted
        : formatted?.substring(0, maxLength) + (isLongText ? "..." : "");

    return (
        <>
            <p
                className="text-gray-800"
                dangerouslySetInnerHTML={{
                    __html: displayedText
                }}
            >
            </p>
            {isLongText && (
                <button
                    className="text-[#017BD2] ml-2 underline"
                    onClick={handleToggle}
                >
                    {isExpanded ? "See less" : "See more"}
                </button>
            )}
        </>
    );
};

export default CommentText;
