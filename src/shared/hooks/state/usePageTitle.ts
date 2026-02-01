import { useEffect } from "react";

/**
 * Sets the document title and restores the previous title on unmount.
 * @param title The page-specific title (without the app suffix)
 * @param options Optional: { suffix: string, fallback: string }
 */
export function usePageTitle(
  title: string | undefined,
  options?: { suffix?: string; fallback?: string },
) {
  useEffect(() => {
    const suffix = options?.suffix ?? "";
    const fallback = options?.fallback ?? "Atlaset";
    if (title) {
      document.title = title + suffix;
    } else {
      document.title = fallback + suffix;
    }
    return () => {
      document.title = fallback;
    };
  }, [title, options?.suffix, options?.fallback]);
}
