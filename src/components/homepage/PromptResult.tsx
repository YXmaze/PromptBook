"use client"

import { useEffect, useRef } from "react";
import { GitCompareArrows, Trash2, EllipsisVertical } from "lucide-react";

type PromptResultProps = {
  onDelete: () => void;
};

export default function PromptResult({onDelete}: PromptResultProps) {
    
    const handleCompareClick = () => {
        console.log("Compare icon clicked");
    };

    const handleTrashClick = () => {
        console.log("Trash icon clicked");
        onDelete();
    };

    const handleMoreClick = () => {
        console.log("More icon clicked");
    };

    const autoResize = (textarea: HTMLTextAreaElement | null) => {
        if (textarea) {
            textarea.style.height = "auto"; // Reset height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
        }
    }

    const promptRef = useRef<HTMLTextAreaElement>(null);
    const resultRef = useRef<HTMLTextAreaElement>(null);

    // handle auto-resizing of textareas
    useEffect(() => {
        const handleInput = (e: Event) => {
            autoResize(e.target as HTMLTextAreaElement);
        };

        const prompt = promptRef.current;
        const result = resultRef.current;

        if (prompt) {
            prompt.addEventListener("input", handleInput);
            autoResize(prompt); // Initial resize
        }
        if (result) {
            result.addEventListener("input", handleInput);
            autoResize(result); // Initial resize
        }
        // Cleanup event listeners
        return () => {
            if (prompt) prompt.removeEventListener("input", handleInput);
            if (result) result.removeEventListener("input", handleInput);
        };
    }, []);

    return (
        <div className="w-screen max-w-none bg-[#F4F3EF] shadow-sm rounded-md p-2 relative">
            {/* Icons at top right */}
            <div className="absolute top-1 right-2 flex items-center">
                <button 
                    onClick={handleCompareClick}
                    className="p-1 rounded-full hover:bg-gray-200 hover:scale-100 transition transform cursor-pointer"
                >
                    <GitCompareArrows className="text-gray-900/70 size-4.5" />
                </button>
                <button
                    onClick={handleTrashClick}
                    className="p-1 rounded-full hover:bg-gray-200 hover:scale-100 transition transform cursor-pointer"
                >
                    <Trash2 className="text-gray-900/70 size-4.5" />
                </button>
                <button
                    onClick={handleMoreClick}
                    className="p-1 rounded-full hover:bg-gray-200 hover:scale-100 transition transform cursor-pointer"
                >
                    <EllipsisVertical className="text-gray-900/70 size-4.5" />
                </button>
            </div>

            <div className="flex flex-col justify-between items-start pt-8">
                {/* prompt */}
                <div className="w-full p-2 bg-[#E5DFD8] rounded-md border border-black mb-2">
                    <div className="text-sm text-gray-900/70">prompt :</div>
                    <textarea
                        ref={promptRef}
                        className="ml-2 w-full bg-transparent text-base text-black outline-none resize-none"
                        placeholder=""
                        rows={1}
                    ></textarea>
                </div>
                {/* result */}
                <div className="w-full p-2 bg-[#E5DFD8] rounded-md border border-black">
                    <div className="text-sm text-gray-900/70">result :</div>
                    <textarea
                        ref={resultRef}
                        className="ml-2 w-full bg-transparent text-base text-black outline-none resize-none"
                        rows={1}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}