import { getDb } from "@/lib/prisma";
import { siteDefaults } from "@/lib/siteDefaults";

const keys = [
  "businessInfo",
  "hours",
  "serviceArea",
  "socials",
  "seo",
  "booking",
  "trustBadges",
] as const;

type SettingsKey = (typeof keys)[number];

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function getSettings() {
  const db = getDb();
  const records = await db.setting.findMany({
    where: { key: { in: keys as unknown as string[] } },
  });

  const map = new Map(records.map((r) => [r.key, r.value]));

  return {
    businessInfo: safeParse(map.get("businessInfo") ?? null, siteDefaults.businessInfo),
    hours: safeParse(map.get("hours") ?? null, siteDefaults.hours),
    serviceArea: safeParse(map.get("serviceArea") ?? null, siteDefaults.serviceArea),
    socials: safeParse(map.get("socials") ?? null, siteDefaults.socials),
    seo: safeParse(map.get("seo") ?? null, siteDefaults.seo),
    booking: safeParse(map.get("booking") ?? null, siteDefaults.booking),
    trustBadges: safeParse(
      map.get("trustBadges") ?? null,
      siteDefaults.trustBadges
    ),
  };
}

export async function getPublicServices() {
  const db = getDb();
  return db.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { priceTiers: true },
  });
}

export async function getPublicAddOns() {
  const db = getDb();
  return db.addOn.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublicGallery() {
  const db = getDb();
  return db.galleryImage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublicReviews(featuredOnly = false) {
  const db = getDb();
  return db.review.findMany({
    where: { isActive: true, ...(featuredOnly ? { isFeatured: true } : {}) },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublicFaq() {
  const db = getDb();
  return db.fAQ.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}
