import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(req: Request) {
  const db = getDb();
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const imageUrl = String(formData.get("imageUrl") || "");
  const category = String(formData.get("category") || "interior");
  const alt = String(formData.get("alt") || "Gallery image");

  if (!file && !imageUrl) {
    return NextResponse.json(
      { error: "Upload a file or provide an image URL." },
      { status: 400 }
    );
  }

  let imagePath = imageUrl;

  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\\s+/g, "-")}`;

    try {
      const { env } = getCloudflareContext();
      const cfEnv =
        env as unknown as
          | {
              R2_BUCKET?: {
                put: (
                  key: string,
                  value: ArrayBuffer | Uint8Array,
                  options?: { httpMetadata?: { contentType?: string } }
                ) => Promise<void>;
              };
              R2_PUBLIC_URL?: string;
            }
          | undefined;
      const r2 = cfEnv?.R2_BUCKET;
      const publicUrl = cfEnv?.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL;

      if (r2) {
        const key = `uploads/${filename}`;
        await r2.put(key, buffer, {
          httpMetadata: { contentType: file.type || "application/octet-stream" },
        });
        if (!publicUrl) {
          return NextResponse.json(
            { error: "R2_PUBLIC_URL is required to serve uploaded images." },
            { status: 500 }
          );
        }
        const baseUrl = publicUrl.endsWith("/")
          ? publicUrl.slice(0, -1)
          : publicUrl;
        imagePath = `${baseUrl}/${key}`;
      } else {
        const { writeFile, mkdir } = await import("fs/promises");
        const path = await import("path");
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });
        const filepath = path.join(uploadsDir, filename);
        await writeFile(filepath, buffer);
        imagePath = `/uploads/${filename}`;
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Image upload failed." },
        { status: 500 }
      );
    }
  }

  const max = await db.galleryImage.aggregate({ _max: { sortOrder: true } });
  const nextSort = (max._max.sortOrder ?? 0) + 1;

  const image = await db.galleryImage.create({
    data: {
      url: imagePath,
      alt,
      category: category as never,
      sortOrder: nextSort,
    },
  });

  return NextResponse.json({ ok: true, image });
}
