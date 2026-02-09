"use client";

import { useState } from "react";

export default function GalleryUpload() {
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setMessage("");
    const res = await fetch("/api/admin/gallery/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Upload failed.");
      return;
    }

    setMessage("Uploaded successfully.");
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(new FormData(event.currentTarget));
      }}
    >
      <div className="grid gap-2 text-sm font-semibold">
        Image file
        <input name="file" type="file" className="text-xs text-[var(--muted)]" />
      </div>
      <div className="grid gap-2 text-sm font-semibold">
        Or image URL
        <input
          name="imageUrl"
          placeholder="https://..."
          className="input-surface rounded-xl px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-2 text-sm font-semibold">
        Category
        <select
          name="category"
          className="input-surface rounded-xl px-3 py-2 text-sm"
        >
          <option value="interior">Interior</option>
          <option value="exterior">Exterior</option>
          <option value="paint">Paint</option>
          <option value="wheels">Wheels</option>
        </select>
      </div>
      <div className="grid gap-2 text-sm font-semibold">
        Alt text
        <input
          name="alt"
          placeholder="Alt text"
          className="input-surface rounded-xl px-3 py-2 text-sm"
        />
      </div>
      <button className="self-start rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white">
        Upload
      </button>
      {message ? <p className="text-xs text-[var(--muted)]">{message}</p> : null}
    </form>
  );
}
