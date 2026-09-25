import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/hydropurify-os",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;