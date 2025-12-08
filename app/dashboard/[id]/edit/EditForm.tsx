"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function EditForm({ post }: { post: any }) {
  // Debug (niet verwijderen, handig)
  console.log("EditForm got post:", post);

  if (!post) return <p>Bezig met laden...</p>;

  const [title, setTitle] = useState(post.title ?? "");
  const [content, setContent] = useState(post.content ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    // Alleen meesturen als nieuwe afbeelding werd gekozen
    if (image) {
      formData.append("image", image);
    }

    // ⭐ BELANGRIJK → Laravel update = POST + method spoofing
    formData.append("_method", "PUT");

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "POST", // ← Bewust POST, want FormData + PUT werkt niet in browsers
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message || "Er ging iets mis...");
      return;
    }

    // success
    window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-red-600 bg-red-50 border border-red-300 p-3 rounded">
          {error}
        </p>
      )}

      {/* TITLE */}
      <div>
        <label className="block mb-1 font-medium">Titel</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* CONTENT */}
      <div>
        <label className="block mb-1 font-medium">Inhoud</label>
        <textarea
          className="w-full border rounded p-2"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* IMAGE UPLOAD */}
      <div className="flex flex-col gap-2">
        <label className="block font-medium">Afbeelding (optioneel)</label>

        <label
          htmlFor="image"
          className="flex items-center gap-3 border border-gray-300 rounded-md px-4 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition"
        >
          <span className="text-gray-700">
            {image
              ? "📸 Nieuwe afbeelding gekozen"
              : "➕ Kies nieuwe afbeelding"}
          </span>
        </label>

        <input
          id="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        {/* Preview huidige afbeelding */}
        {post.image && !image && (
          <img
            src={post.image}
            alt="Huidige afbeelding"
            className="h-32 w-32 object-cover rounded border mt-2"
          />
        )}

        {/* Preview nieuwe afbeelding */}
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="h-32 w-32 object-cover rounded border mt-2"
          />
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        {loading ? "Bezig..." : "Opslaan"}
      </Button>
    </form>
  );
}
