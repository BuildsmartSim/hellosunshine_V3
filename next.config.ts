import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack/Webpack from trying to bundle native Node addons.
  // @resvg/resvg-js ships a .node binary that must stay server-external.
  serverExternalPackages: ["@resvg/resvg-js", "satori"],

  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
