import { useMemo } from "react";
import type { Trip } from "../types";

interface UseTripDetailsNavigationResult {
  previousTrip?: Trip;
  nextTrip?: Trip;
}

/**
 * Determines the previous and next trips chronologically by start date.
 * Trips without a start date are placed at the end.
 * @param trips The list of trips to navigate through.
 * @param currentTrip The current trip to find the previous and next trips for.
 * @returns An object containing the previous and next trips, if they exist.
 */
export function useTripNavigation(
  trips: Trip[],
  currentTrip?: Trip,
): UseTripDetailsNavigationResult {
  const chronologicalTrips = useMemo(
    () =>
      [...trips].sort((a, b) => {
        const aTime = a.startDate ? new Date(a.startDate).getTime() : Infinity;
        const bTime = b.startDate ? new Date(b.startDate).getTime() : Infinity;

        return aTime - bTime;
      }),
    [trips],
  );

  return useMemo(() => {
    if (!currentTrip) {
      return {
        previousTrip: undefined,
        nextTrip: undefined,
      };
    }

    const currentIndex = chronologicalTrips.findIndex(
      (trip) => trip.id === currentTrip.id,
    );

    if (currentIndex === -1) {
      return {
        previousTrip: undefined,
        nextTrip: undefined,
      };
    }

    return {
      previousTrip:
        currentIndex > 0 ? chronologicalTrips[currentIndex - 1] : undefined,
      nextTrip:
        currentIndex < chronologicalTrips.length - 1
          ? chronologicalTrips[currentIndex + 1]
          : undefined,
    };
  }, [chronologicalTrips, currentTrip]);
}
