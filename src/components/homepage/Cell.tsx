"use client";

import Review from "@/components/homepage/Review";
import PromptResult from "@/components/homepage/PromptResult";
import Add from "@/components/homepage/Add";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface Item {
  id: number;
  type: "PromptResult" | "Review";
}

interface DraggableCellProps {
  item: Item;
  index: number;
  onDelete: (id: number) => void;
  addCell: (index: number) => void;
  addReview: (index: number) => void;
}

function DraggableCell({
  item,
  index,
  onDelete,
  addCell,
  addReview,
}: DraggableCellProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100%", // Ensure consistent width
    minWidth: "100%", // Prevent shrinking
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group w-full max-w-2xl flex flex-shrink-0"
    >
      {/* Gray Jupyter-style drag bar */}
      <div
        {...attributes}
        {...listeners}
        className="w-2 mr-2 cursor-grab group-hover:bg-gray-300 transition-colors duration-200"
      >
        <div className="h-full w-1 bg-gray-200 group-hover:bg-gray-400 rounded" />
      </div>

      <div className="flex-1">
        {item.type === "PromptResult" ? (
          <PromptResult onDelete={() => onDelete(item.id)} />
        ) : (
          <Review onDelete={() => onDelete(item.id)} />
        )}

        <Add
          onAddCell={() => addCell(index)}
          onAddReview={() => addReview(index)}
        />
      </div>
    </div>
  );
}

export default function Cell() {
  const [items, setItems] = useState<Item[]>([]);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const addCell = (index: number) => {
    const newItem: Item = {
      id: Date.now(),
      type: "PromptResult",
    };
    const insertIndex = index + 1;
    setItems((prev) => [
      ...prev.slice(0, insertIndex),
      newItem,
      ...prev.slice(insertIndex),
    ]);
  };

  const addReview = (index: number) => {
    const newItem: Item = {
      id: Date.now(),
      type: "Review",
    };
    const insertIndex = index + 1;
    setItems((prev) => [
      ...prev.slice(0, insertIndex),
      newItem,
      ...prev.slice(insertIndex),
    ]);
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const dragged = items.find((item) => item.id === event.active.id);
    setDraggedItem(dragged || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    setItems((items) => arrayMove(items, oldIndex, newIndex));
    setDraggedItem(null);
  };

  return (
    <div className="flex flex-col items-start space-y-1 w-full ml-2">
      <div className="relative group w-full mt-2 mb-4">
        <Add
          onAddCell={() => addCell(-1)}
          onAddReview={() => addReview(-1)}
          alwaysVisible
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item, index) => (
            <DraggableCell
              key={item.id}
              item={item}
              index={index}
              onDelete={handleDelete}
              addCell={addCell}
              addReview={addReview}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {draggedItem ? (
            <div className="w-full max-w-2xl flex flex-shrink-0">
              <div className="w-2 mr-2 bg-gray-200 rounded" />
              <div className="flex-1">
                {draggedItem.type === "PromptResult" ? (
                  <PromptResult onDelete={() => {}} />
                ) : (
                  <Review onDelete={() => {}} />
                )}
                <Add onAddCell={() => {}} onAddReview={() => {}} />
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}