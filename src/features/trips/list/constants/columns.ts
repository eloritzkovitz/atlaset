export type ColumnKey =
  | "select"
  | "name"
  | "rating"
  | "countries"
  | "year"
  | "startDate"
  | "endDate"
  | "fullDays"
  | "participants"
  | "categories"
  | "status"
  | "tags"
  | "actions";

// Minimum widths for each column
export const MIN_WIDTHS: Record<ColumnKey, number> = {
  select: 30,
  name: 80,
  rating: 40,
  countries: 60,
  year: 30,
  startDate: 30,
  endDate: 30,
  fullDays: 40,
  participants: 80,
  categories: 80,
  status: 60,
  tags: 80,
  actions: 20,
};

// Default widths for each column
export const DEFAULT_WIDTHS: Record<ColumnKey, number> = {
  select: 30,
  name: 150,
  rating: 150,
  countries: 200,
  year: 110,
  startDate: 50,
  endDate: 50,
  fullDays: 40,
  participants: 150,
  categories: 180,
  status: 120,
  tags: 120,
  actions: 10,
};
