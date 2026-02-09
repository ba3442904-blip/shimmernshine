import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const runtime = "nodejs";

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

  const hasFile = !!file && file.size > 0;

  if (!hasFile && !imageUrl) {
    return NextResponse.json(
      { error: "Upload a file or provide an image URL." },
      { status: 400 }
    );
  }

  let imagePath = imageUrl;

  if (hasFile) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\\s+/g, "-")}`;

    try {
      const endpoint = process.env.R2_ENDPOINT;
      const accessKeyId = process.env.R2_ACCESS_KEY_ID;
      const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
      const bucket = process.env.R2_BUCKET;
      const publicUrl = process.env.R2_PUBLIC_URL;
      const allowLocal = process.env.ALLOW_LOCAL_UPLOADS === "true";

      if (endpoint && accessKeyId && secretAccessKey && bucket && publicUrl) {
        const client = new S3Client({
          region: "auto",
          endpoint,
          credentials: { accessKeyId, secretAccessKey },
        });
        const key = `uploads/${filename}`;
        await client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: file.type || "application/octet-stream",
          })
        );
        const baseUrl = publicUrl.endsWith("/")
          ? publicUrl.slice(0, -1)
          : publicUrl;
        imagePath = `${baseUrl}/${key}`;
      } else if (allowLocal) {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });
        const filepath = path.join(uploadsDir, filename);
        await writeFile(filepath, buffer);
        imagePath = `/uploads/${filename}`;
      } else {
        return NextResponse.json(
          { error: "Image storage is not configured." },
          { status: 500 }
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Image upload failed.";
      return NextResponse.json({ error: message }, { status: 500 });
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
