import { ALL_TRIP_CATEGORIES, ALL_TRIP_STATUSES, ALL_TRIP_TAGS } from "@features/trips/constants/trips";

/**
 * Represents a trip with various attributes.
 */
export type Trip = {
  /** The unique identifier for the trip */
  id: string;
  /** The name of the trip */
  name: string;
  /** A detailed description of the trip */
  description?: string;
  /** Indicates if the trip is marked as a favorite */
  favorite?: boolean;
  /** The rating given to the trip */
  rating?: number | null;
  /** List of country ISO codes associated with the trip */
  countryCodes: string[];
  /** List of locations visited during the trip */
  locations?: Location[];
  /** The start date of the trip in ISO format */
  startDate?: string;
  /** The end date of the trip in ISO format */
  endDate?: string;
  /** Total number of full days spent on the trip */
  fullDays?: number;
  /** Additional attributes for the trip */
  categories?: TripCategory[];
  /** The current status of the trip */
  status?: TripStatus;
  /** Additional notes about the trip */
  notes?: string;
  /** Tags associated with the trip */
  tags?: TripTag[];
};

/**
 * Represents a geographical location with region and cities.
 */
export type Location = {
  region: string;
  cities: string[];
};

/* Represents a trip category */
export type TripCategory = (typeof ALL_TRIP_CATEGORIES)[number];

/* Represents the current status of a trip */
export type TripStatus = (typeof ALL_TRIP_STATUSES)[number];

/* Represents a tag associated with a trip */
export type TripTag = (typeof ALL_TRIP_TAGS)[number];
