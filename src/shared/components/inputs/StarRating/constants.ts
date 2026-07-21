// Constants for the StarRating component
export const STAR_SELECTED_COLOR = "#ffd700";
export const STAR_HOVER_COLOR = "#ffe65c";
export const STAR_UNSELECTED_COLOR = "#797875";
export const STAR_SIZE = 24;

/** Rating options for the star rating component */
export const RATING_OPTIONS = [
  { value: -1, label: "All ratings" },
  { value: 5, label: "5 stars" },
  { value: 4.5, label: "4.5 stars" },
  { value: 4, label: "4 stars" },
  { value: 3.5, label: "3.5 stars" },
  { value: 3, label: "3 stars" },
  { value: 2.5, label: "2.5 stars" },
  { value: 2, label: "2 stars" },
  { value: 1.5, label: "1.5 stars" },
  { value: 1, label: "1 star" },
  { value: 0.5, label: "0.5 stars" },
  { value: 0, label: "No rating" },
];

/** Rating options excluding the "All ratings" option. */
export const RATING_OPTIONS_NO_ALL = RATING_OPTIONS.filter(
  (opt) => opt.value !== -1,
);

/** Rating options for actions, excluding the "All ratings" and "No rating" options. */
export const RATING_ACTION_OPTIONS = [
  ...RATING_OPTIONS_NO_ALL.filter((opt) => opt.value !== 0),
  { value: undefined, label: "No rating" },
];
