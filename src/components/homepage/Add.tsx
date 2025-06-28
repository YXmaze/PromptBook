"use client";

import { Plus } from "lucide-react";

type AddProps = {
  onAddCell: () => void;
  onAddReview: () => void;
  alwaysVisible?: boolean;
};

export default function Add({ onAddCell, onAddReview, alwaysVisible }: AddProps) {
  return (
    <div className={`absolute flex items-center bottom-[-1.25rem] left-1/2 transform -translate-x-1/2 space-x-2 p-2 ${alwaysVisible ? '' : 'hidden group-hover:flex'}`}>
      <button
        onClick={onAddCell}
        className="flex items-center space-x-1 px-2 py-1 bg-[#F4F3EF] border border-gray-900/70 text-gray-900/70 text-sm rounded-full hover:bg-[#E5DFD8] transition"
      >
        <Plus className="text-lg" />
        <span>Cell</span>
      </button>
      <button
        onClick={onAddReview}
        className="flex items-center space-x-1 px-2 py-1 bg-[#F4F3EF] border border-gray-900/70 text-gray-900/70 text-sm rounded-full hover:bg-[#E5DFD8] transition"
      >
        <Plus className="text-lg" />
        <span>Review</span>
      </button>
    </div>
  );
}
