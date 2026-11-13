import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Indexing policy for the portfolio build:
 * - Home, the case study, the about pages, and the notices are indexable.
 * - /search is an unbounded set of query URLs, so crawling it is disallowed.
 * - HOA profiles (/community/*) are not blocked here; they carry a `noindex`
 *   meta tag instead, which only works if crawlers are allowed to fetch them.
 * - /command is the admin route and is never crawlable.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/command", "/search"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
