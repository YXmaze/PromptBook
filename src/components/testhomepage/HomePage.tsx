"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function HomePage() {
  const [userId, setUserId] = useState<string>("");
  const [collectionId, setCollectionId] = useState<string>("");
  const [cellPositions, setCellPositions] = useState<
    { id: string; position: number }[]
  >([]);
  const [collections, setCollections] = useState<
    { id: string; name: string; createdAt: string }[]
  >([]);
  const [filteredCollections, setFilteredCollections] = useState<
    { id: string; name: string; createdAt: string }[]
  >([]);
  const [cellId, setCellId] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [review, setReview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
    if (!userId) return;
    fetch(`/api/collections?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        setFilteredCollections(data);
      })
      .catch((err) => console.error("Failed to fetch collections:", err));
  }, [userId]);

  useEffect(() => {
    if (!collectionId) return;
    fetch(`/api/cells?collectionId=${collectionId}`)
      .then((res) => res.json())
      .then((data) => setCellPositions(data))
      .catch((err) => console.error("Failed to fetch cell positions:", err));
  }, [collectionId]);

  useEffect(() => {
    if (!cellId) {
      setPrompt("");
      setResult("");
      setReview("");
      return;
    }
    fetch(`/api/cells/${cellId}`)
      .then((res) => res.json())
      .then((cell) => {
        setPrompt(cell.prompt || "");
        setResult(cell.result || "");
        setReview(cell.review || "");
      })
      .catch((err) => console.error("Failed to fetch cell details:", err));
  }, [cellId]);

  const handleCreateCellWithNewCollection = async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/cells/new-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Create cell failed");
      alert("New cell with new collection created");

      const colRes = await fetch(`/api/collections?userId=${userId}`);
      const colData = await colRes.json();
      setCollections(colData);
      setFilteredCollections(colData);
    } catch (error) {
      console.error(error);
      alert("Error creating cell");
    }
  };

  const handleCreateCellInExisting = async () => {
    if (!userId || !collectionId) return;
    try {
      const res = await fetch("/api/cells/exist-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, collectionId }),
      });
      if (!res.ok)
        throw new Error("Failed to create cell in existing collection");

      const data = await fetch(`/api/cells?collectionId=${collectionId}`).then(
        (r) => r.json()
      );
      setCellPositions(data);
      alert("New cell added to existing collection!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFieldChange = async (
    field: "prompt" | "result" | "review",
    value: string
  ) => {
    if (!cellId) return;

    if (field === "prompt") setPrompt(value);
    else if (field === "result") setResult(value);
    else if (field === "review") setReview(value);

    try {
      await fetch(`/api/cells/${cellId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
    } catch (error) {
      console.error("Failed to update cell field:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = collections.filter((col) =>
      col.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCollections(filtered);
  };

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-white p-6 space-y-6">
      <div className="flex gap-4 flex-wrap">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          onClick={handleCreateCellWithNewCollection}
        >
          New Cell (New Collection)
        </button>
        <button
          className={`px-4 py-2 rounded transition-colors ${
            collectionId
              ? "bg-purple-600 hover:bg-purple-500"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          onClick={handleCreateCellInExisting}
          disabled={!collectionId}
        >
          New Cell (Existing Collection)
        </button>
      </div>

      <form
        className="bg-[#2a2a3d] p-6 rounded shadow-md max-w-md space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label className="block mb-1 text-sm text-gray-300">
            Search Collections
          </label>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-[#1e1e2f] text-white border border-gray-600 rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Collection</label>
          <select
            className="w-full bg-[#1e1e2f] text-white border border-gray-600 rounded p-2"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
          >
            <option value="">Select a collection</option>
            {filteredCollections.map((col) => (
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
                Cell {cell.position + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Prompt</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => handleFieldChange("prompt", e.target.value)}
            className="w-full bg-[#1e1e2f] text-white border border-gray-600 rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Result</label>
          <input
            type="text"
            value={result}
            onChange={(e) => handleFieldChange("result", e.target.value)}
            className="w-full bg-[#1e1e2f] text-white border border-gray-600 rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Review</label>
          <input
            type="text"
            value={review}
            onChange={(e) => handleFieldChange("review", e.target.value)}
            className="w-full bg-[#1e1e2f] text-white border border-gray-600 rounded p-2"
          />
        </div>
      </form>
    </div>
  );
}
