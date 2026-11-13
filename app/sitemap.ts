import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Only the pages meant for search engines are listed: the home page, the
 * technical case study, and the supporting pages. Individual HOA profiles
 * are deliberately left out (they are `noindex`).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/project", priority: 0.9 },
    { path: "/about", priority: 0.6 },
    { path: "/about/tx", priority: 0.5 },
    { path: "/disclaimer", priority: 0.3 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/contact", priority: 0.2 },
  ];

  return pages.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
