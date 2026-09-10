import { useMemo, useState } from "react";
import { useTrips } from "../../core/context/TripsContext";
import type { Trip } from "../../core/types";

export function useTripSelection() {
  const { trips, sharedTripIds } = useTrips();

  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);

  const selectedTrips = useMemo(
    () => trips.filter((trip) => selectedTripIds.includes(trip.id)),
    [trips, selectedTripIds],
  );

  const nonSharedSelectedTrips = useMemo(
    () => selectedTrips.filter((trip) => !sharedTripIds.has(trip.id)),
    [selectedTrips, sharedTripIds],
  );

  function selectTrip(id: string) {
    if (sharedTripIds.has(id)) return;

    setSelectedTripIds((prev) =>
      prev.includes(id)
        ? prev.filter((tripId) => tripId !== id)
        : [...prev, id],
    );
  }

  function selectAllTrips(filteredIds: string[]) {
    const selectableIds = filteredIds.filter((id) => !sharedTripIds.has(id));

    const allSelected =
      selectableIds.length > 0 &&
      selectableIds.every((id) => selectedTripIds.includes(id));

    if (allSelected) {
      setSelectedTripIds((prev) =>
        prev.filter((id) => !selectableIds.includes(id)),
      );
    } else {
      setSelectedTripIds((prev) =>
        Array.from(new Set([...prev, ...selectableIds])),
      );
    }
  }

  function isAllSelected(filteredTrips: Trip[]) {
    const selectableTrips = filteredTrips.filter(
      (trip) => !sharedTripIds.has(trip.id),
    );

    return (
      selectableTrips.length > 0 &&
      selectableTrips.every((trip) => selectedTripIds.includes(trip.id))
    );
  }

  function clearSelection() {
    setSelectedTripIds([]);
  }

  return {
    selectedTripIds,
    selectedTrips,
    nonSharedSelectedTrips,
    selectTrip,
    selectAllTrips,
    isAllSelected,
    clearSelection,
  };
}
