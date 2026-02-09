import { getDb } from "@/lib/prisma";
import { siteDefaults } from "@/lib/siteDefaults";

const keys = [
  "businessInfo",
  "hours",
  "serviceArea",
  "socials",
  "hero",
  "homepagePricing",
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
  try {
    const db = getDb();
    const records = await db.setting.findMany({
      where: { key: { in: keys as unknown as string[] } },
    });

    const map = new Map(records.map((r) => [r.key, r.value]));

    return {
      businessInfo: safeParse(
        map.get("businessInfo") ?? null,
        siteDefaults.businessInfo
      ),
      hours: safeParse(map.get("hours") ?? null, siteDefaults.hours),
      serviceArea: safeParse(
        map.get("serviceArea") ?? null,
        siteDefaults.serviceArea
      ),
      socials: safeParse(map.get("socials") ?? null, siteDefaults.socials),
      hero: safeParse(map.get("hero") ?? null, siteDefaults.hero),
      homepagePricing: safeParse(
        map.get("homepagePricing") ?? null,
        siteDefaults.homepagePricing
      ),
      seo: safeParse(map.get("seo") ?? null, siteDefaults.seo),
      booking: safeParse(map.get("booking") ?? null, siteDefaults.booking),
      trustBadges: safeParse(
        map.get("trustBadges") ?? null,
        siteDefaults.trustBadges
      ),
    };
  } catch {
    return {
      businessInfo: siteDefaults.businessInfo,
      hours: siteDefaults.hours,
      serviceArea: siteDefaults.serviceArea,
      socials: siteDefaults.socials,
      hero: siteDefaults.hero,
      homepagePricing: siteDefaults.homepagePricing,
      seo: siteDefaults.seo,
      booking: siteDefaults.booking,
      trustBadges: siteDefaults.trustBadges,
    };
  }
}

export async function getPublicServices() {
  try {
    const db = getDb();
    return await db.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { priceTiers: true },
    });
  } catch {
    return [];
  }
}

export async function getPublicAddOns() {
  try {
    const db = getDb();
    return await db.addOn.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getPublicGallery() {
  try {
    const db = getDb();
    return await db.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getPublicReviews(featuredOnly = false) {
  try {
    const db = getDb();
    return await db.review.findMany({
      where: { isActive: true, ...(featuredOnly ? { isFeatured: true } : {}) },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getPublicFaq() {
  try {
    const db = getDb();
    return await db.fAQ.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}
