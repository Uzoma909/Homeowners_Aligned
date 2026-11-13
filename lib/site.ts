/**
 * Site-wide constants for the portfolio build.
 * Keep project facts here so the pages, sitemap, and metadata stay in sync.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://homeownersaligned.com"
).replace(/\/$/, "");

export const SITE_NAME = "Homeowners Aligned";

export const SITE_TAGLINE = "An independent data engineering portfolio project";

export const SITE_DESCRIPTION =
  "A data engineering portfolio project that collects public Texas HOA records, extracts structured data from filed documents, and presents it as searchable profiles with an experimental transparency score.";

export const CONTACT_EMAIL = "contact@homeownersaligned.com";

/** Public source repository. Leave empty to hide the "View source" links. */
export const REPO_URL = process.env.NEXT_PUBLIC_REPO_URL || "";

/** sessionStorage key used by the intro screen. Also referenced by the inline script in app/layout.tsx. */
export const INTRO_STORAGE_KEY = "ha-intro-seen";
