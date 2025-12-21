import { createContext, useContext } from "react";
import type { Trip } from "@types";

export interface TripsContextType {
  trips: Trip[];
  loading: boolean;
  addTrip: (trip: Trip) => void;
  editTrip: (trip: Trip) => void;
  updateTripFavorite: (tripId: string, favorite: boolean) => void;
  updateTripRating: (tripId: string, rating: number | undefined) => void;
  removeTrip: (id: string) => Promise<void>;
  duplicateTrip: (trip: Trip) => void;
}

export const TripsContext = createContext<TripsContextType | undefined>(undefined);

export function useTrips() {
  const context = useContext(TripsContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripsProvider");
  }
  return context;
}
