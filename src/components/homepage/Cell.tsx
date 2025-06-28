"use client";

import Review from '@/components/homepage/Review';
import PromptResult from '@/components/homepage/PromptResult';
import Add from '@/components/homepage/Add';
import { useState } from "react";

interface Item {
  id: number;
  type: 'PromptResult' | 'Review';
}

export default function Cell() {
  const [items, setItems] = useState<Item[]>([]);
    //{ id: 1, type: 'PromptResult' },
    //{ id: 2, type: 'Review' },

  const addCell = (index: number) => {
    const newCell: Item  = { id: items.length + 1, type: 'PromptResult' };
    setItems([...items.slice(0, index + 1), newCell, ...items.slice(index + 1)]);
  };

  const addReview = (index: number) => {
    const newReview: Item  = { id: items.length + 1, type: 'Review' };
    setItems([...items.slice(0, index + 1), newReview, ...items.slice(index + 1)]);
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative group w-full max-w-2xl mt-8 mb-4">
        <Add onAddCell={() => addCell(-1)} onAddReview={() => addReview(-1)} alwaysVisible/>
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="relative group w-full">
          {item.type === 'PromptResult' ? (
            <PromptResult onDelete={() => handleDelete(item.id)} />
          ) : (
            <Review onDelete={() => handleDelete(item.id)} />
          )}
          <Add onAddCell={() => addCell(index)} onAddReview={() => addReview(index)} />
        </div>
      ))}
    </div>
  );
}