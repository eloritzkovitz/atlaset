import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Sets the document title and dynamically appends the localized application suffix.
 * @param title The page-specific title.
 * @param options Optional overrides for the fallback or separator format.
 */
export function usePageTitle(
  title: string | undefined,
  options?: { fallback?: string; separator?: string; disableSuffix?: boolean },
) {
  const { t: tCommon } = useTranslation("common");
  const appName = tCommon("appName", "Atlaset");

  // Set the document title when the component mounts or when the title changes
  useEffect(() => {
    const fallback = options?.fallback ?? appName;
    const separator = options?.separator ?? " | ";
    const disableSuffix = options?.disableSuffix ?? false;

    // If title is provided, set the document title with the suffix; otherwise, use the fallback
    if (title) {
      document.title = disableSuffix ? title : `${title}${separator}${appName}`;
    } else {
      document.title = fallback;
    }

    return () => {
      document.title = fallback;
    };
  }, [
    title,
    appName,
    options?.fallback,
    options?.separator,
    options?.disableSuffix,
  ]);
}
