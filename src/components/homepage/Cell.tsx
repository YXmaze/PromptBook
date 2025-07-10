"use client";

import Review from '@/components/homepage/Review';
import PromptResult from '@/components/homepage/PromptResult';
import Add from '@/components/homepage/Add';
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Item {
  id: number;
  type: 'PromptResult' | 'Review';
}

interface DraggableCellProps {
  item: Item;
  index: number;
  moveCell: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: number) => void;
  addCell: (index: number) => void;
  addReview: (index: number) => void;
}

const ItemType = "CELL";

const DraggableCell: React.FC<DraggableCellProps> = ({ item, index, moveCell, onDelete, addCell, addReview }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveCell(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative group w-full ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {item.type === 'PromptResult' ? (
        <PromptResult onDelete={() => onDelete(item.id)} />
      ) : (
        <Review onDelete={() => onDelete(item.id)} />
      )}
      <Add onAddCell={() => addCell(index)} onAddReview={() => addReview(index)} />
    </div>
  );
};

export default function Cell() {
  const [items, setItems] = useState<Item[]>([]);

  const addCell = (index: number) => {
    const newCell: Item = { id: items.length + 1, type: 'PromptResult' };
    setItems([...items.slice(0, index + 1), newCell, ...items.slice(index + 1)]);
  };

  const addReview = (index: number) => {
    const newReview: Item = { id: items.length + 1, type: 'Review' };
    setItems([...items.slice(0, index + 1), newReview, ...items.slice(index + 1)]);
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const moveCell = (dragIndex: number, hoverIndex: number) => {
    const updatedItems = [...items];
    const [draggedItem] = updatedItems.splice(dragIndex, 1);
    updatedItems.splice(hoverIndex, 0, draggedItem);
    setItems(updatedItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-start space-y-1 w-full">
        <div className="relative group w-full mt-2 mb-4">
          <Add onAddCell={() => addCell(-1)} onAddReview={() => addReview(-1)} alwaysVisible />
        </div>

        {items.map((item, index) => (
          <DraggableCell
            key={item.id}
            item={item}
            index={index}
            moveCell={moveCell}
            onDelete={handleDelete}
            addCell={addCell}
            addReview={addReview}
          />
        ))}
      </div>
    </DndProvider>
  );
}