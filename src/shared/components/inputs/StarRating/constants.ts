// Constants for the StarRating component
export const STAR_SELECTED_COLOR = "#ffd700";
export const STAR_HOVER_COLOR = "#ffe65c";
export const STAR_UNSELECTED_COLOR = "#797875";
export const STAR_SIZE = 24;

/** Represents a rating option item. */
export interface RatingItem {
  value?: number;
  key?: "all" | "none";
}

/** Represents a resolved rating option item. */
export interface ResolvedRatingOption {
  value?: number;
  label: string;
}

/** Base rating values. */
export const RATING_VALUES: RatingItem[] = [
  { value: -1, key: "all" },
  { value: 5 },
  { value: 4.5 },
  { value: 4 },
  { value: 3.5 },
  { value: 3 },
  { value: 2.5 },
  { value: 2 },
  { value: 1.5 },
  { value: 1 },
  { value: 0.5 },
  { value: 0, key: "none" },
];

/** Rating options excluding "All ratings". */
export const RATING_OPTIONS_NO_ALL = RATING_VALUES.filter(
  (opt) => opt.value !== -1,
);

/** Action options including clearing/undefined rating. */
export const RATING_ACTION_OPTIONS: RatingItem[] = [
  ...RATING_OPTIONS_NO_ALL.filter((opt) => opt.value !== 0),
  { value: undefined, key: "none" },
];
