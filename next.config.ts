import type { NextConfig } from "next";

// For a project-site URL like https://user.github.io/repo-name/,
// set BASE_PATH=/repo-name in the GitHub Actions env (or Makefile).
const basePath = process.env.BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
