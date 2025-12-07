"use client";

import { useState } from "react";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // FRONTEND VALIDATION
    if (!title.trim()) {
      setError("Titel is verplicht.");
      setLoading(false);
      return;
    }

    if (!content.trim()) {
      setError("Inhoud is verplicht.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Er ging iets mis op de server.");
      setLoading(false);
      return;
    }

    setLoading(false);
    window.location.href = "/dashboard";
  }

  return (
    <div className="max-w-2xl mx-auto py-36 px-6">
      <h1 className="text-2xl font-semibold mb-6">Nieuwe Post Aanmaken</h1>

      {error && (
        <p className="text-red-600 mb-4 border border-red-300 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Titel</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Inhoud</label>
          <textarea
            className="w-full border rounded p-2"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block font-medium">Afbeelding (optioneel)</label>

          <label
            htmlFor="image"
            className="
              flex items-center gap-3 
              border border-gray-300 
              rounded-md px-4 py-2 
              cursor-pointer 
              bg-gray-50 
              hover:bg-gray-100 
              active:bg-gray-200
              transition
            "
          >
            <span className="text-gray-700">
              {image ? "📸 Afbeelding geselecteerd" : "➕ Kies een afbeelding"}
            </span>
          </label>

          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImage(file);
            }}
          />

          {image && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Bezig..." : "Post aanmaken"}
        </button>
      </form>
    </div>
  );
}
