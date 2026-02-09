"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Tabs from "@/components/Tabs";

type Resource = {
  slug: string;
  type: "Guide" | "Changelog";
  title: string;
  excerpt: string;
  author: string;
  date: string;
};

export default function ResourcesList({ posts }: { posts: Resource[] }) {
  const [filter, setFilter] = useState("all");
  const tabs = [
    { label: "All", value: "all" },
    { label: "Guides", value: "Guide" },
    { label: "Changelog", value: "Changelog" },
  ];

  const filtered = useMemo(() => {
    if (filter === "all") return posts;
    return posts.filter((post) => post.type === filter);
  }, [filter, posts]);

  return (
    <div className="grid gap-8">
      <Tabs tabs={tabs} value={filter} onChange={setFilter} />
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/resources/${post.slug}`}
            className="group card-surface card-hover p-6 transition"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              {post.type}
            </div>
            <h3 className="mt-3 text-xl font-semibold">{post.title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{post.excerpt}</p>
            <div className="mt-4 text-xs font-semibold text-[var(--muted)]">
              {post.author} · {post.date}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
