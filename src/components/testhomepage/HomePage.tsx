"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Pencil, Trash, Move } from "lucide-react";

interface Cell {
  id: string;
  position: number;
  initialIndex: number;
  prompt?: string;
  result?: string;
  review?: string;
}

interface Collection {
  id: string;
  name: string;
  createdAt: string;
}

export default function HomePage() {
  const [userId, setUserId] = useState<string>("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    []
  );
  const [collectionId, setCollectionId] = useState<string>("");
  const [cells, setCells] = useState<Cell[]>([]);
  const [editingCollectionName, setEditingCollectionName] = useState(false);
  const [collectionNameInput, setCollectionNameInput] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  // Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else {
        setUserId("");
        setCollections([]);
        setFilteredCollections([]);
        setCollectionId("");
        setCells([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch collections when userId changes
  useEffect(() => {
    if (!userId) return;
    fetchCollections(userId);
  }, [userId]);

  // Fetch cells when collectionId changes
  useEffect(() => {
    if (!collectionId) {
      setCells([]);
      setCollectionNameInput("");
      return;
    }
    fetchCells(collectionId);
    // Also update collectionNameInput to selected collection's name
    const selected = collections.find((c) => c.id === collectionId);
    if (selected) setCollectionNameInput(selected.name);
  }, [collectionId, collections]);

  // Fetch collections helper
  const fetchCollections = async (userId: string) => {
    try {
      const res = await fetch(`/api/collections?userId=${userId}`);
      const data = await res.json();
      setCollections(data);
      setFilteredCollections(data);
    } catch (error) {
      console.error("Failed to fetch collections", error);
    }
  };

  // Fetch cells helper
  const fetchCells = async (collectionId: string) => {
    try {
      const res = await fetch(`/api/cells?collectionId=${collectionId}`);
      const data: Cell[] = await res.json();
      console.log("Fetched cells:", data); // Debug

      const withDefaults = data.map((cell, i) => ({
        ...cell,
        prompt: cell.prompt ?? "",
        result: cell.result ?? "",
        review: cell.review ?? "",
        initialIndex: i,
      }));
      setCells(withDefaults);
    } catch (error) {
      console.error("Failed to fetch cells", error);
      setCells([]);
    }
  };

  // Update a single field in a cell
  const updateCellField = async (
    id: string,
    field: "prompt" | "result" | "review",
    value: string
  ) => {
    setCells((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
    try {
      await fetch(`/api/cells/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
    } catch (error) {
      console.error("Failed to update cell field:", error);
    }
  };

  // Create new collection with a new cell, then refresh collections and select new one
  const handleCreateCellWithNewCollection = async () => {
    try {
      await fetch("/api/cells/new-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      await fetchCollections(userId);
      // Select last collection in list as new one
      if (collections.length > 0) {
        setCollectionId(collections[collections.length - 1].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Create new cell in existing collection, then refresh cells
  const handleCreateCellInExisting = async () => {
    if (!collectionId) return;
    try {
      await fetch("/api/cells/exist-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, collectionId }),
      });
      await fetchCells(collectionId);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete cell and update state locally
  const handleDeleteCell = async (id: string) => {
    try {
      await fetch(`/api/cells/${id}`, { method: "DELETE" });
      setCells((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Delete collection and reset selection + reload collections
  const handleDeleteCollection = async () => {
    if (!collectionId) return;
    try {
      await fetch(`/api/collections/${collectionId}`, { method: "DELETE" });
      await fetchCollections(userId);
      setCollectionId("");
      setCells([]);
    } catch (error) {
      console.error(error);
    }
  };

  // Rename collection name and refresh
  const handleRenameCollection = async () => {
    if (!collectionId) return;
    try {
      await fetch(`/api/collections/${collectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: collectionNameInput }),
      });
      setEditingCollectionName(false);
      await fetchCollections(userId);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter collections by search query
  const handleSearch = (query: string) => {
    const filtered = collections.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCollections(filtered);
  };

  // Drag & drop reorder cells, then persist order
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cells.findIndex((c) => c.id === active.id);
    const newIndex = cells.findIndex((c) => c.id === over.id);

    const newOrder = arrayMove(cells, oldIndex, newIndex).map((cell, i) => ({
      ...cell,
      position: i,
    }));

    setCells(newOrder);

    try {
      await fetch("/api/cells/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cellId: active.id, newIndex }),
      });
    } catch (error) {
      console.error("Failed to reorder cells:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-white p-6">
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={handleCreateCellWithNewCollection}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          New Cell (New Collection)
        </button>
        <button
          onClick={handleCreateCellInExisting}
          disabled={!collectionId}
          className={`px-4 py-2 rounded ${
            collectionId ? "bg-purple-600" : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          New Cell (Existing Collection)
        </button>
      </div>

      <input
        className="mt-6 w-full p-2 rounded bg-[#2a2a3d] text-white"
        placeholder="Search Collections"
        onChange={(e) => handleSearch(e.target.value)}
      />

      <div className="mt-4 flex items-center gap-2">
        <select
          className="bg-[#2a2a3d] p-2 rounded text-white"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
        >
          <option value="">Select Collection</option>
          {filteredCollections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>

        {collectionId && (
          <>
            {editingCollectionName ? (
              <>
                <input
                  value={collectionNameInput}
                  onChange={(e) => setCollectionNameInput(e.target.value)}
                  className="p-1 rounded bg-[#2a2a3d]"
                />
                <button
                  onClick={handleRenameCollection}
                  className="ml-2 px-2 py-1 bg-green-600 rounded"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <Pencil
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setEditingCollectionName(true)}
                />
                <Trash
                  className="w-4 h-4 text-red-400 cursor-pointer"
                  onClick={handleDeleteCollection}
                />
              </>
            )}
          </>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={cells.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-6 space-y-6">
            {cells.map((cell) => (
              <SortableCell
                key={cell.id}
                cell={cell}
                updateCellField={updateCellField}
                onDelete={handleDeleteCell}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableCell({
  cell,
  updateCellField,
  onDelete,
}: {
  cell: Cell;
  updateCellField: (
    id: string,
    field: "prompt" | "result" | "review",
    value: string
  ) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: cell.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Local state to avoid patch flood
  const [localPrompt, setLocalPrompt] = useState(cell.prompt ?? "");
  const [localResult, setLocalResult] = useState(cell.result ?? "");
  const [localReview, setLocalReview] = useState(cell.review ?? "");

  // Sync on cell prop update
  useEffect(() => {
    setLocalPrompt(cell.prompt ?? "");
    setLocalResult(cell.result ?? "");
    setLocalReview(cell.review ?? "");
  }, [cell]);

  const handleBlur = (field: "prompt" | "result" | "review", value: string) => {
    updateCellField(cell.id, field, value);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#2a2a3d] rounded p-4 space-y-2 shadow"
    >
      <div className="flex justify-end gap-3 items-center">
        <Move
          className="w-5 h-5 text-gray-400 cursor-grab"
          {...attributes}
          {...listeners}
        />
        <Trash
          className="w-5 h-5 text-red-400 cursor-pointer"
          onClick={() => onDelete(cell.id)}
        />
      </div>

      <input
        placeholder="Prompt"
        value={localPrompt}
        onChange={(e) => setLocalPrompt(e.target.value)}
        onBlur={() => handleBlur("prompt", localPrompt)}
        className="w-full p-2 rounded bg-[#1e1e2f] border border-gray-700"
      />
      <input
        placeholder="Result"
        value={localResult}
        onChange={(e) => setLocalResult(e.target.value)}
        onBlur={() => handleBlur("result", localResult)}
        className="w-full p-2 rounded bg-[#1e1e2f] border border-gray-700"
      />
      <input
        placeholder="Review"
        value={localReview}
        onChange={(e) => setLocalReview(e.target.value)}
        onBlur={() => handleBlur("review", localReview)}
        className="w-full p-2 rounded bg-[#1e1e2f] border border-gray-700"
      />
    </div>
  );
}
