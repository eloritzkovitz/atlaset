import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import type { TFunction } from "i18next";

/**
 * Get sorting direction options with localized labels and icons.
 * @param t - Optional translation function for localizing labels. If not provided, defaults to English.
 * @returns Array of sorting direction options.
 */
export const getDirectionOptions = (t?: TFunction) => [
  {
    value: "asc",
    label: t ? t("common:sort.ascending", "Ascending") : "Ascending",
    icon: FaArrowUp,
  },
  {
    value: "desc",
    label: t ? t("common:sort.descending", "Descending") : "Descending",
    icon: FaArrowDown,
  },
];
