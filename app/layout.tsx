import type { Metadata, Viewport } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import { SignupNudge } from "@/components/ui/SignupNudge";

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

export const metadata: Metadata = {
  title: {
    default: "Homeowners Aligned | HOA Transparency Platform",
    template: "%s | Homeowners Aligned",
  },
  description:
    "The first independent Health Score for HOAs. Check your community's financial health, governance quality, and resident satisfaction — for free.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://homeownersaligned.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Homeowners Aligned",
    title: "Homeowners Aligned | HOA Transparency Platform",
    description:
      "The first independent Health Score for HOAs. Check your community's financial health, governance quality, and resident satisfaction — for free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Homeowners Aligned | HOA Transparency Platform",
    description:
      "The first independent Health Score for HOAs. Honest. Open. Accountable.",
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
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen">
        {children}
        <SignupNudge />
      </body>
    </html>
  );
}
