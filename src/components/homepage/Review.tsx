"use client"

import { Trash2, Pencil, Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ReviewProps = {
  onDelete: () => void;
};

export default function Review({ onDelete }: ReviewProps) {
    const reviewRef = useRef<HTMLTextAreaElement>(null);
    const [isReviewVisible, setReviewVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(true);
    const [reviewMarkdown, setReviewMarkdown] = useState("");

    const autoResize = (textarea: HTMLTextAreaElement | null) => {
        if (textarea) {
            textarea.style.height = "auto"; // Reset height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
        }
    }

    useEffect(() => {
        const handleInput = (e: Event) => {
            autoResize(e.target as HTMLTextAreaElement);
        };

        const review = reviewRef.current;
        if (review) {
            review.addEventListener("input", handleInput);
            autoResize(review); // Initial resize
        }
        return () => {
            if (review) review.removeEventListener("input", handleInput);
        };
    }, []);

    const toggleReviewVisibility = () => {
        setReviewVisible(!isReviewVisible);
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        if (!isEditing && reviewRef.current) {
            setTimeout(() => autoResize(reviewRef.current), 0);
        }
    }

    const handleTrashClick = () => {
        console.log("Trash icon clicked");
        onDelete();
    };

    return (
        <div className="w-screen max-w-none bg-[#F4F3EF] shadow-sm rounded-md p-2 relative">
            <div className="w-full p-2 bg-[#E5DFD8] rounded-md border border-black">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-900/70">review :</div>
                    {/* Icons at top right */}
                    <div className="flex items-center">
                        {reviewMarkdown && (
                            <button
                                onClick={toggleEditMode}
                                className="p-1 rounded-full hover:bg-gray-300 transition transform cursor-pointer"
                            >
                                {isEditing ? (
                                    <Check className="text-gray-900/70 size-5" />
                                ) : (
                                    <Pencil className="text-gray-900/70 size-4.5" />
                                )}
                            </button>
                        )}
                        <button
                            onClick={handleTrashClick}
                            className="p-1 rounded-full hover:bg-gray-300 transition transform cursor-pointer"
                        >
                            <Trash2 className="text-gray-900/70 size-4.5" />
                        </button>
                        <button
                            onClick={toggleReviewVisibility}
                            className="p-1 rounded-full hover:bg-gray-300 transition transform cursor-pointer"
                        >
                            <ChevronDown
                                className={`text-gray-900/70 size-5 transition-transform duration-200 ${
                                    isReviewVisible ? "rotate-0" : "rotate-180"
                                }`}
                            />
                        </button>
                    </div>
                </div>
                {isReviewVisible && (
                    <div className="ml-2">
                        {isEditing ? (
                            <textarea
                                ref={reviewRef}
                                className="w-full bg-transparent text-base text-black outline-none resize-none"
                                rows={1}
                                value={reviewMarkdown}
                                onChange={(e) => {
                                    setReviewMarkdown(e.target.value);
                                    autoResize(reviewRef.current);
                                }}
                                placeholder="Enter markdown here (e.g., **bold**, *italic*, [link](url))..."
                            ></textarea>
                        ) : (
                            <div className="bg-transparent rounded-md">
                                <div className="prose prose-sm text-black">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {reviewMarkdown || "Preview will appear here..."}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}