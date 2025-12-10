import React, { createContext, useContext, useEffect, useState } from "react";
import type { Trip } from "@types";
import { getAutoTripStatus, tripsService } from "@features/trips";
import { useAuth } from "./AuthContext";

interface TripsContextType {
  trips: Trip[];
  loading: boolean;
  addTrip: (trip: Trip) => void;
  editTrip: (trip: Trip) => void;
  updateTripFavorite: (tripId: string, favorite: boolean) => void;
  updateTripRating: (tripId: string, rating: number | undefined) => void;
  removeTrip: (id: string) => Promise<void>;
  duplicateTrip: (trip: Trip) => void;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export const TripsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch trips on mount
  const { user, ready } = useAuth();

  useEffect(() => {
    let mounted = true;
    if (!ready) return;
    setLoading(true);
    tripsService.load().then((allTrips) => {
      if (mounted) {
        loadTrips(allTrips);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [user, ready]);

  // Load trips from IndexedDB on mount
  function loadTrips(rawTrips: Trip[]) {
    setTrips(
      rawTrips.map((trip) => ({
        ...trip,
        status: getAutoTripStatus(trip),
      }))
    );
  }

  // Add a trip
  async function addTrip(trip: Trip) {
    const updatedTrip = { ...trip, status: getAutoTripStatus(trip) };
    await tripsService.add(updatedTrip);
    setTrips((prev) => [...prev, updatedTrip]);
  }

  // Update a trip
  async function editTrip(trip: Trip) {
    const updatedTrip = { ...trip, status: getAutoTripStatus(trip) };
    await tripsService.edit(updatedTrip);
    setTrips((prev) => prev.map((t) => (t.id === trip.id ? updatedTrip : t)));
  }

  // Update trip favorite
  async function updateTripFavorite(tripId: string, favorite: boolean) {
    await tripsService.updateFavorite(tripId, favorite);
    setTrips((prev) =>
      prev.map((trip) => (trip.id === tripId ? { ...trip, favorite } : trip))
    );
  }

  // Update trip rating
  async function updateTripRating(tripId: string, rating: number | undefined) {
    await tripsService.updateRating(tripId, rating);
    setTrips((prev) =>
      prev.map((trip) => (trip.id === tripId ? { ...trip, rating } : trip))
    );
  }

  // Remove a trip
  async function removeTrip(id: string) {
    await tripsService.remove(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }

  // Duplicate a trip
  async function duplicateTrip(trip: Trip) {
    const newTrip = {
      ...trip,
      id: crypto.randomUUID(),
      name: trip.name + " (Copy)",
      status: getAutoTripStatus(trip),
    };
    await tripsService.add(newTrip);
    setTrips((prev) => [...prev, newTrip]);
  }

  return (
    <TripsContext.Provider
      value={{
        trips,
        loading,
        addTrip,
        editTrip,
        updateTripFavorite,
        updateTripRating,
        removeTrip,
        duplicateTrip,
      }}
    >
      {children}
    </TripsContext.Provider>
  );
};

// Custom hook to use the TripsContext
export const useTrips = () => {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used within a TripsProvider");
  return ctx;
};
