"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createCell } from "@/app/server/createCellWithNewCollection";
import { getCellPositions } from "@/app/server/getCellPositions";
import { getCollections } from "@/app/server/getCollection";
import { updateCellField } from "@/app/server/updateCellField";

export default function HomePage() {
  const [userId, setUserId] = useState<string>("");
  const [collectionId, setCollectionId] = useState<string>("");
  const [cellPositions, setCellPositions] = useState<
    { id: string; position: number }[]
  >([]);
  const [collections, setCollections] = useState<
    { id: string; name: string; createdAt: Date }[]
  >([]);
  const [cellId, setCellId] = useState<string>(""); // must be set when a cell is selected/created
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [review, setReview] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUserId(firebaseUser.uid);
      } else {
        console.warn("No user found. Redirect to login if needed.");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      setCollections(await getCollections(userId));
    };
    if (userId) fetchCollections();
  }, [userId]);

  useEffect(() => {
    const fetchPositions = async () => {
      if (collectionId) {
        setCellPositions(await getCellPositions(collectionId));
      }
    };
    fetchPositions();
  }, [collectionId]);

  const handleCreateCell = async () => {
    if (!userId) {
      alert("Please select a collection.");
      return;
    }

    try {
      await createCell({ userId });
      alert("New cell created in collection!");
      setCollections(await getCollections(userId));
    } catch (err) {
      console.error("Failed to create cell:", err);
    }
  };

  const handleFieldChange = async (
    field: "prompt" | "result" | "review",
    value: string
  ) => {
    if (!cellId) return;
    await updateCellField({ cellId, field, value });
  };

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-white p-6 space-y-6">
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          onClick={handleCreateCell}
        >
          New Cell
        </button>
      </div>

      <form className="bg-[#2a2a3d] p-6 rounded shadow-md max-w-md space-y-4">
        <div>
          <label className="block mb-1 text-sm text-gray-300">Collection</label>
          <select
            className="w-full bg-[#1e1e2f] text-white border border-gray-600 rounded p-2"
            onChange={(e) => setCollectionId(e.target.value)}
            value={collectionId}
          >
            <option value="">Select a collection</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">
            Cell Number
          </label>
          <select
            className="w-full bg-[#1e1e2f] text-white border border-gray-600 rounded p-2"
            value={cellId}
            onChange={(e) => setCellId(e.target.value)}
          >
            <option value="">Select a cell</option>
            {cellPositions.map((cell) => (
              <option key={cell.id} value={cell.id}>
                Cell {cell.position}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Prompt</label>
          <input
            type="text"
            value={prompt}
            onChange={async (e) => {
              const value = e.target.value;
              setPrompt(value);
              await handleFieldChange("prompt", value);
            }}
            className="w-full bg-[#1e1e2f] text-white border border-gray-600 rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Result</label>
          <input
            type="text"
            value={result}
            onChange={async (e) => {
              const value = e.target.value;
              setResult(value);
              await handleFieldChange("result", value);
            }}
            className="w-full bg-[#1e1e2f] text-white border border-gray-600 rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Review</label>
          <input
            type="text"
            value={review}
            onChange={async (e) => {
              const value = e.target.value;
              setReview(value);
              await handleFieldChange("review", value);
            }}
            className="w-full bg-[#1e1e2f] text-white border border-gray-600 rounded p-2"
          />
        </div>
      </form>
    </div>
  );
}
