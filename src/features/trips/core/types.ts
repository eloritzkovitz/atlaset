import type { Permission } from "@features/user/permissions/types";
import { ALL_TRIP_CATEGORIES } from "./constants/categories";
import { ALL_TRIP_STATUSES } from "./constants/statuses";
import { ALL_TRIP_TAGS } from "./constants/tags";
import type { TripPhoto } from "../photos/types";

/** Represents a trip. */
export type Trip = {
  /** The unique identifier for the trip. */
  id: string;
  /** The name of the trip. */
  name: string;
  /** A detailed description of the trip. */
  description?: string;
  /** Indicates if the trip is marked as a favorite. */
  favorite?: boolean;
  /** The rating given to the trip. */
  rating?: number | null;
  /** List of country ISO codes associated with the trip. */
  countryCodes: string[];
  /** List of location IDs visited during the trip. */
  locationIds?: number[];
  /** The start date of the trip in ISO format. */
  startDate?: string;
  /** The end date of the trip in ISO format. */
  endDate?: string;
  /** Total number of full days spent on the trip. */
  fullDays?: number;
  /** UIDs of participants in this trip. */
  participants?: string[];
  /** UIDs of users with whom the trip is shared. */
  sharedWith?: string[];
  /** Additional attributes for the trip. */
  categories?: TripCategory[];
  /** The current status of the trip. */
  status?: TripStatus;
  /** Additional notes about the trip. */
  notes?: string;
  /** Tags associated with the trip. */
  tags?: TripTag[];
  /** Photos associated with the trip. */
  photos?: TripPhoto[];
  /** URL of an external photo album for the trip. */
  photoAlbumUrl?: string;
  /** URL of a Google Maps link for the trip. */
  googleMapsUrl?: string;
};

/** The type of a shared trip. */
export type SharedTripType = "participant" | "shared";

/** Represents a shared trip reference. */
export type SharedTrip = {
  ownerUid: string;
  tripId: string;
  type?: SharedTripType;
  permission?: Permission;
};

/** Represents trip share drafts keyed by recipient UID. */
export type TripShares = ReadonlyMap<string, SharedTrip>;

/** Represents a trip category. */
export type TripCategory = (typeof ALL_TRIP_CATEGORIES)[number];

/** Represents the current status of a trip. */
export type TripStatus = (typeof ALL_TRIP_STATUSES)[number];

/** Represents a tag associated with a trip. */
export type TripTag = (typeof ALL_TRIP_TAGS)[number];

/** Sort keys for trips. */
export type TripSortByKey =
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
  | "tags";

/** Sort by options for trips. */
export type TripSortBy = `${TripSortByKey}-asc` | `${TripSortByKey}-desc`;

/** Filter keys for trips. */
export type TripFilters = {
  name: string;
  rating: number | null;
  country: string[];
  year: string[];
  participants: string[];
  categories: TripCategory[];
  status: TripStatus | null;
  tags: TripTag[];
};

/** Filter state for trips. */
export type TripFilterState = TripFilters & {
  local: boolean;
  abroad: boolean;
  completed: boolean;
  upcoming: boolean;
  planned: boolean;
  cancelled: boolean;
  favorite: boolean;
};
