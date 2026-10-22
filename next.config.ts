import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hides the floating "N" dev tools badge in the bottom-left corner
  // during `next dev`. Build/runtime errors are still surfaced elsewhere
  // (terminal output, error overlay) — this only hides the indicator icon.
  devIndicators: false,
};

export default nextConfig;
