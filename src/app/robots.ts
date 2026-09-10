import type { MetadataRoute } from "next";
import { seo } from "@/config/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(seo.siteUrl ? { allow: "/" } : { disallow: "/" }),
    },
    ...(seo.siteUrl ? { sitemap: `${seo.siteUrl}/sitemap.xml` } : {}),
  };
}
