import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack/Webpack from bundling native Node addons.
  serverExternalPackages: ["@resvg/resvg-js", "satori"],

  images: {
    // Allow Next.js Image to serve from Supabase Storage (social post images, avatars etc.)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
