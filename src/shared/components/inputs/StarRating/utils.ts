import type { TFunction } from "i18next";
import {
  RATING_VALUES,
  RATING_ACTION_OPTIONS,
  type RatingItem,
  type ResolvedRatingOption,
} from "./constants";

/** Formats a single rating item with translation. */
export function formatRatingOption(
  item: RatingItem,
  t: TFunction,
): ResolvedRatingOption {
  if (item.key === "all") {
    return { value: item.value, label: t("components.starRating.all") };
  }
  if (item.key === "none" || item.value === 0 || item.value === undefined) {
    return { value: item.value, label: t("components.starRating.none") };
  }
  return {
    value: item.value,
    label: t("components.starRating.star", { count: item.value }),
  };
}

/** Get all translated rating options. */
export function getRatingOptions(
  t: TFunction,
): Array<ResolvedRatingOption & { value: number }> {
  return RATING_VALUES.map((item) => ({
    ...formatRatingOption(item, t),
    value: item.value!,
  }));
}

/** Get translated action rating options with clearing/undefined options. */
export function getRatingActionOptions(t: TFunction): ResolvedRatingOption[] {
  return RATING_ACTION_OPTIONS.map((item) => formatRatingOption(item, t));
}
