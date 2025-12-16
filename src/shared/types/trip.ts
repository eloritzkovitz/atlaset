import { ALL_TRIP_CATEGORIES, ALL_TRIP_STATUSES, ALL_TRIP_TAGS } from "@features/trips/constants/trips";

export type Trip = {
  id: string;
  name: string;
  description?: string;
  favorite?: boolean;
  rating?: number | null;
  countryCodes: string[];
  locations?: Location[];
  startDate?: string;
  endDate?: string;
  fullDays?: number;
  categories?: TripCategory[];
  status?: TripStatus;
  notes?: string;
  tags?: TripTag[];
};

// Location type definition
export type Location = {
  region: string;
  cities: string[];
};

// TripCategory type definition
export type TripCategory = (typeof ALL_TRIP_CATEGORIES)[number];

// TripStatus type definition
export type TripStatus = (typeof ALL_TRIP_STATUSES)[number];

// TripTag type definition
export type TripTag = (typeof ALL_TRIP_TAGS)[number];
