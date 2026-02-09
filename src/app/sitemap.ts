import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "http://localhost:3000";
  const routes = [
    "",
    "/services",
    "/pricing",
    "/gallery",
    "/reviews",
    "/service-area",
    "/faq",
    "/contact",
    "/book",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
