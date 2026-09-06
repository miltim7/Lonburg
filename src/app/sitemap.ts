import type { MetadataRoute } from "next";
import { seo } from "@/config/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return seo.siteUrl
    ? [{ url: seo.siteUrl, changeFrequency: "monthly", priority: 1 }]
    : [];
}
