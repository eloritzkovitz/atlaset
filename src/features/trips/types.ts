import type { TripCategory, TripStatus, TripTag } from "@types";

// Sort keys for trips

export type TripSortByKey =
  | "name"
  | "rating"
  | "countries"
  | "year"
  | "startDate"
  | "endDate"
  | "fullDays"
  | "categories"
  | "status"
  | "tags";

export type TripSortBy = `${TripSortByKey}-asc` | `${TripSortByKey}-desc`;

// Filter keys for trips

export type TripFilters = {
  name: string;
  rating: number | null;
  country: string[];
  year: string[];
  categories: TripCategory[];
  status: TripStatus | "";
  tags: TripTag[];
};

export type TripFilterState = TripFilters & {
  local: boolean;
  abroad: boolean;
  completed: boolean;
  upcoming: boolean;
  favorite: boolean;
};
