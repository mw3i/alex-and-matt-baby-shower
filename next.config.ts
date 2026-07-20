import type { NextConfig } from "next";

// For a project-site URL like https://user.github.io/repo-name/,
// set BASE_PATH and NEXT_PUBLIC_BASE_PATH=/repo-name in CI (or Makefile).
const basePath = (
  process.env.BASE_PATH ||
  process.env.NEXT_PUBLIC_BASE_PATH ||
  ""
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: {
    // Ensure client + Image src prefixing see the same value at build time.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
