import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow large image uploads (up to 20MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  // Jimp uses native Node.js modules that shouldn't be bundled
  serverExternalPackages: ["jimp", "@jimp/utils", "exifr", "mongoose"],
};

export default nextConfig;
