/**
 * Utility functions related to environment checks and global objects.
 */

export type BackendDescriptor = string | { envVar: string };

/** Reads a key from import.meta.env.
 * @param key - The environment variable key to read.
 * @returns The value of the environment variable or undefined if not set.
 */
export function getImportMetaEnv(key: string): string | undefined {
  return (import.meta.env as Record<string, string | undefined>)[key];
}

/**
 * Resolve a backend URL from either a string URL or an env-var descriptor.
 * @param backend - A string URL or an object with an `envVar` key specifying the environment variable name.
 * @returns The resolved backend URL or undefined if not found.
 */
export function resolveBackendUrl(
  backend?: BackendDescriptor,
): string | undefined {
  if (!backend) return undefined;
  if (typeof backend === "string") return backend;
  const key = (backend as { envVar: string }).envVar;
  let fromMeta;
  try {
    fromMeta = getImportMetaEnv(key);
  } catch {
    fromMeta = undefined;
  }
  if (fromMeta) return fromMeta;
  if (typeof process !== "undefined" && process.env) return process.env[key];
  return undefined;
}

/** Checks if the window object is defined for SSR-safe usage. */
export function isWindowDefined() {
  return typeof window !== "undefined";
}
