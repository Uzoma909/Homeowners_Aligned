import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  // Routes removed when the site became a read-only portfolio project.
  // Redirect instead of 404 so old links and bookmarks still land somewhere useful.
  async redirects() {
    return [
      { source: "/auth/:path*", destination: "/", permanent: false },
      { source: "/pricing", destination: "/project", permanent: false },
      { source: "/agents", destination: "/project", permanent: false },
      { source: "/blog", destination: "/project", permanent: false },
      { source: "/methodology", destination: "/project#scoring", permanent: false },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
