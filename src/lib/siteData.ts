import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/prisma";
import { normalizeInstagramEmbedUrl } from "@/lib/embed";
import { siteDefaults } from "@/lib/siteDefaults";

const keys = [
  "businessInfo",
  "hours",
  "serviceArea",
  "socials",
  "hero",
  "seo",
  "booking",
  "integrations",
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

export const getSettings = unstable_cache(
  async () => {
    try {
      const db = getDb();
      const records = await db.setting.findMany({
        where: { key: { in: keys as unknown as string[] } },
      });

      const map = new Map(records.map((r) => [r.key, r.value]));

      const integrations = safeParse(
        map.get("integrations") ?? null,
        siteDefaults.integrations
      );

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
        seo: safeParse(map.get("seo") ?? null, siteDefaults.seo),
        booking: safeParse(map.get("booking") ?? null, siteDefaults.booking),
        integrations: {
          ...siteDefaults.integrations,
          ...integrations,
          instagramEmbedUrl: normalizeInstagramEmbedUrl(
            integrations?.instagramEmbedUrl ?? siteDefaults.integrations.instagramEmbedUrl
          ),
        },
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
        seo: siteDefaults.seo,
        booking: siteDefaults.booking,
        integrations: siteDefaults.integrations,
        trustBadges: siteDefaults.trustBadges,
      };
    }
  },
  ["settings"],
  { revalidate: 300, tags: ["settings"] }
);

export const getPublicServices = unstable_cache(
  async () => {
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
  },
  ["public-services"],
  { revalidate: 300, tags: ["services"] }
);

export const getPublicAddOns = unstable_cache(
  async () => {
    try {
      const db = getDb();
      return await db.addOn.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
    } catch {
      return [];
    }
  },
  ["public-addons"],
  { revalidate: 300, tags: ["addons"] }
);

export const getPublicGallery = unstable_cache(
  async () => {
    try {
      const db = getDb();
      return await db.galleryImage.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
    } catch {
      return [];
    }
  },
  ["public-gallery"],
  { revalidate: 300, tags: ["gallery"] }
);

export const getPublicReviews = unstable_cache(
  async (featuredOnly = false) => {
    try {
      const db = getDb();
      return await db.review.findMany({
        where: { isActive: true, ...(featuredOnly ? { isFeatured: true } : {}) },
        orderBy: { sortOrder: "asc" },
      });
    } catch {
      return [];
    }
  },
  ["public-reviews"],
  { revalidate: 300, tags: ["reviews"] }
);

export const getPublicFaq = unstable_cache(
  async () => {
    try {
      const db = getDb();
      return await db.fAQ.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
    } catch {
      return [];
    }
  },
  ["public-faq"],
  { revalidate: 300, tags: ["faq"] }
);
