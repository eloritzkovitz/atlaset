import { createContext, useContext } from "react";
import type { Trip } from "@features/trips/types";

export interface TripsContextType {
  trips: Trip[];
  loading: boolean;
  sharedTripIds: Set<string>;
  selectedTripIds: string[];
  setSelectedTripIds: (ids: string[]) => void;
  selectTrip: (id: string) => void;
  selectAllTrips: (filteredIds: string[]) => void;
  isAllSelected: (filteredTrips: Trip[]) => boolean;
  handleBulkDuplicate: (tripIds: string[]) => void;
  handleBulkDelete: (tripIds: string[]) => void;
  addTrip: (trip: Trip) => void;
  editTrip: (trip: Trip) => void;
  markCompleted: (trip: Trip) => void;
  duplicateTrip: (trip: Trip) => void;
  updateTripFavorite: (trip: Trip, favorite: boolean) => void;
  updateTripRating: (trip: Trip, rating: number | undefined) => void;
  removeTrip: (trip: Trip) => Promise<void>;
}

export const TripsContext = createContext<TripsContextType | undefined>(
  undefined,
);

export function useTrips() {
  const context = useContext(TripsContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripsProvider");
  }
  return context;
}
