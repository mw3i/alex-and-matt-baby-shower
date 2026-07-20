/** Must match next.config basePath (set via NEXT_PUBLIC_BASE_PATH in CI). */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(
  /\/$/,
  "",
);

/** Prefix a root-absolute public path for GitHub project pages. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
