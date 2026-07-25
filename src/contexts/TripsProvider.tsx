import React, { useEffect, useMemo, useState } from "react";
import { sharedTripsService } from "@features/trips/services/sharedTripsService";
import { tripsService } from "@features/trips/services/tripsService";
import { getAutoTripStatus } from "@features/trips/utils/trips";
import type { Trip } from "@features/trips/types";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { TripsContext } from "./TripsContext";

export const TripsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [sharedTripIds, setSharedTripIds] = useState<Set<string>>(new Set());
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch trips on mount
  const { user, ready } = useAuth();

  // Load trips when user changes
  useEffect(() => {
    let mounted = true;

    // Skip if auth not ready
    if (!ready) return;

    // Only load trips if user is authenticated
    if (!user) {
      setTrips([]);
      setSharedTripIds(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);

    Promise.all([
      tripsService.load(),
      sharedTripsService.getSharedTripIds(user.uid),
    ]).then(([allTrips, sharedIds]) => {
      if (mounted) {
        loadTrips(allTrips);
        setSharedTripIds(new Set(sharedIds));
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
      })),
    );
  }

  /** Adds a new trip. */
  async function addTrip(trip: Trip) {
    const tripWithStatus = { ...trip, status: getAutoTripStatus(trip) };
    const savedTrip = await tripsService.add(tripWithStatus);

    setTrips((prev) => [
      ...prev,
      { ...savedTrip, status: getAutoTripStatus(savedTrip) },
    ]);
  }

  /** Edits an existing trip. */
  async function editTrip(trip: Trip, forceStatus = false) {
    const updatedTrip = {
      ...trip,
      status: forceStatus ? trip.status : getAutoTripStatus(trip),
    };

    await tripsService.edit(updatedTrip);
    setTrips((prev) => prev.map((t) => (t.id === trip.id ? updatedTrip : t)));
  }

  /** Marks a trip as completed. */
  function markCompleted(trip: Trip) {
    editTrip({ ...trip, status: "completed" }, true);
  }

  /** Updates a trip's favorite status. */
  async function updateTripFavorite(trip: Trip, favorite: boolean) {
    await tripsService.updateFavorite(trip, favorite);
    setTrips((prev) =>
      prev.map((t) => (t.id === trip.id ? { ...trip, favorite } : t)),
    );
  }

  /** Updates a trip's rating. */
  async function updateTripRating(trip: Trip, rating: number | undefined) {
    await tripsService.updateRating(trip, rating);
    setTrips((prev) =>
      prev.map((t) => (t.id === trip.id ? { ...trip, rating } : t)),
    );
  }

  /** Removes a trip. */
  async function removeTrip(trip: Trip) {
    await tripsService.remove(trip);
    setTrips((prev) => prev.filter((t) => t.id !== trip.id));
  }

  /** Duplicates a trip. */
  async function duplicateTrip(trip: Trip) {
    const newTrip = {
      ...trip,
      id: crypto.randomUUID(),
      name: trip.name + " (Copy)",
      status: getAutoTripStatus(trip),
    };
    const savedTrip = await tripsService.add(newTrip);
    setTrips((prev) => [
      ...prev,
      {
        ...savedTrip,
        status: getAutoTripStatus(savedTrip),
      },
    ]);
  }

  // Check if all non-shared trips are selected
  const isAllSelected = (filteredTrips: Trip[]) => {
    const nonSharedFiltered = filteredTrips.filter(
      (t) => !sharedTripIds.has(t.id),
    );
    return (
      nonSharedFiltered.length > 0 &&
      nonSharedFiltered.every((t) => selectedTripIds.includes(t.id))
    );
  };

  // Derived selection properties
  const selectedTrips = useMemo(
    () => trips.filter((trip) => selectedTripIds.includes(trip.id)),
    [trips, selectedTripIds],
  );
  const nonSharedSelectedTrips = useMemo(
    () => selectedTrips.filter((trip) => !sharedTripIds.has(trip.id)),
    [selectedTrips, sharedTripIds],
  );

  /** Selects or deselects a trip. */
  function selectTrip(id: string) {
    if (sharedTripIds.has(id)) return;
    setSelectedTripIds((prev) =>
      prev.includes(id)
        ? prev.filter((tripId) => tripId !== id)
        : [...prev, id],
    );
  }

  /** Selects or deselects all trips. */
  function selectAllTrips(filteredIds: string[]) {
    const nonSharedFilteredIds = filteredIds.filter(
      (id) => !sharedTripIds.has(id),
    );

    const isAllCurrentlySelected =
      nonSharedFilteredIds.length > 0 &&
      nonSharedFilteredIds.every((id) => selectedTripIds.includes(id));

    if (isAllCurrentlySelected) {
      setSelectedTripIds((prev) =>
        prev.filter((id) => !nonSharedFilteredIds.includes(id)),
      );
    } else {
      setSelectedTripIds((prev) =>
        Array.from(new Set([...prev, ...nonSharedFilteredIds])),
      );
    }
  }

  /** Handles bulk trip duplication. */
  function handleBulkDuplicate() {
    nonSharedSelectedTrips.forEach((trip) => duplicateTrip(trip));
  }

  /** Handles bulk trip deletion. */
  async function handleBulkDelete() {
    for (const trip of nonSharedSelectedTrips) {
      await removeTrip(trip);
    }
    setSelectedTripIds([]);
  }

  return (
    <TripsContext.Provider
      value={{
        trips,
        sharedTripIds,
        selectedTripIds,
        setSelectedTripIds,
        selectTrip,
        selectAllTrips,
        isAllSelected,
        handleBulkDuplicate,
        handleBulkDelete,
        loading,
        addTrip,
        editTrip,
        markCompleted,
        duplicateTrip,
        updateTripFavorite,
        updateTripRating,
        removeTrip,
      }}
    >
      {children}
    </TripsContext.Provider>
  );
};
