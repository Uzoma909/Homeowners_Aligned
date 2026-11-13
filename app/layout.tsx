import type { Metadata, Viewport } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import { IntroGate } from "@/components/portfolio/IntroGate";
import {
  INTRO_STORAGE_KEY,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space",
  display: "swap",
});

const TITLE = "Homeowners Aligned | HOA Data Engineering Portfolio Project";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s | Homeowners Aligned",
  },
  description: SITE_DESCRIPTION,
  manifest: "/manifest.json",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/apple-touch-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint. If the intro screen was already dismissed in this
 * browser session, mark <html> so CSS hides it immediately (no flash).
 */
const INTRO_SEEN_SCRIPT = `try{if(sessionStorage.getItem(${JSON.stringify(
  INTRO_STORAGE_KEY
)})==="1"){document.documentElement.setAttribute("data-intro-seen","1")}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SEEN_SCRIPT }} />
        <noscript>
          <style>{`#intro-gate{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen">
        <div id="app-root">{children}</div>
        <IntroGate />
      </body>
    </html>
  );
}
