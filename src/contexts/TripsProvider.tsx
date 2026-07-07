import React, { useEffect, useMemo, useState } from "react";
import { getAutoTripStatus, tripsService, type Trip } from "@features/trips";
import { getSharedTripIds } from "@features/trips/services/sharedTripsService";
import { useAuth } from "@features/user";
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
    tripsService.load().then((allTrips) => {
      if (mounted) {
        loadTrips(allTrips);
        setLoading(false);
      }
    });

    // Fetch shared trip IDs for the user
    getSharedTripIds(user?.uid).then((ids) => {
      if (mounted) setSharedTripIds(new Set(ids));
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

  // Add a trip
  async function addTrip(trip: Trip) {
    const tripWithStatus = { ...trip, status: getAutoTripStatus(trip) };
    const savedTrip = await tripsService.add(tripWithStatus);
    
    setTrips((prev) => [
      ...prev,
      { ...savedTrip, status: getAutoTripStatus(savedTrip) },
    ]);
  }

  // Update a trip
  async function editTrip(trip: Trip, forceStatus = false) {
    const updatedTrip = {
      ...trip,
      status: forceStatus ? trip.status : getAutoTripStatus(trip),
    };

    await tripsService.edit(updatedTrip);
    setTrips((prev) => prev.map((t) => (t.id === trip.id ? updatedTrip : t)));
  }

  // Mark trip as completed
  function markCompleted(trip: Trip) {
    editTrip({ ...trip, status: "completed" }, true);
  }

  // Update trip favorite
  async function updateTripFavorite(tripId: string, favorite: boolean) {
    await tripsService.updateFavorite(tripId, favorite);
    setTrips((prev) =>
      prev.map((trip) => (trip.id === tripId ? { ...trip, favorite } : trip)),
    );
  }

  // Update trip rating
  async function updateTripRating(tripId: string, rating: number | undefined) {
    await tripsService.updateRating(tripId, rating);
    setTrips((prev) =>
      prev.map((trip) => (trip.id === tripId ? { ...trip, rating } : trip)),
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

  // Select trip handler
  function selectTrip(id: string) {
    if (sharedTripIds.has(id)) return;
    setSelectedTripIds((prev) =>
      prev.includes(id)
        ? prev.filter((tripId) => tripId !== id)
        : [...prev, id],
    );
  }

  // Select all handler
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

  // Bulk duplicate handler
  function handleBulkDuplicate() {
    nonSharedSelectedTrips.forEach((trip) => duplicateTrip(trip));
  }

  // Bulk delete handler
  async function handleBulkDelete() {
    for (const trip of nonSharedSelectedTrips) {
      await removeTrip(trip.id);
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
