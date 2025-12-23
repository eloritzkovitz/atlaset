import { useTrips } from "@contexts/TripsContext";
import {
  getCompletedTrips,
  getUpcomingTrips,
  getLocalTrips,
  getAbroadTrips,
} from "@features/trips/utils/trips";
import { useHomeCountry } from "@features/user";
import { getLongestTrip, getShortestTrip } from "../utils/tripStats";

export function useTripsStats() {
  const { homeCountry } = useHomeCountry();
  const { trips } = useTrips();

  // Trip counts
  const totalTrips = trips.length;
  const localTrips = getLocalTrips(trips, homeCountry);
  const abroadTrips = getAbroadTrips(trips, homeCountry);

  // Only completed trips for country stats
  const completedTrips = getCompletedTrips(trips);
  const completedAbroadTrips = getAbroadTrips(completedTrips, homeCountry);
  const upcomingTrips = getUpcomingTrips(trips);

  // Longest and shortest trips (abroad only)
  const longestTripObj = abroadTrips.length
    ? abroadTrips.reduce((a, b) =>
        getLongestTrip([a]) >= getLongestTrip([b]) ? a : b
      )
    : null;
  const shortestTripObj = abroadTrips.length
    ? abroadTrips.reduce((a, b) =>
        getShortestTrip([a]) <= getShortestTrip([b]) ? a : b
      )
    : null;

  // Longest and shortest trips (abroad only)
  const longestTrip = getLongestTrip(abroadTrips);
  const shortestTrip = getShortestTrip(abroadTrips);

  // Extract trip name and date range if available
  const longestTripName = longestTripObj?.name || null;
  const longestTripRange =
    longestTripObj?.startDate && longestTripObj?.endDate
      ? `${longestTripObj.startDate} – ${longestTripObj.endDate}`
      : null;

  const shortestTripName = shortestTripObj?.name || null;
  const shortestTripRange =
    shortestTripObj?.startDate && shortestTripObj?.endDate
      ? `${shortestTripObj.startDate} – ${shortestTripObj.endDate}`
      : null;

  // Calculate trip durations (in days)
  const tripDurations = trips
    .map((trip) => {
      if (trip.startDate && trip.endDate) {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          // +1 to include both start and end dates
          return Math.max(
            1,
            Math.round(
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1
          );
        }
      }
      return null;
    })
    .filter((d): d is number => d !== null);

  const totalDaysTraveling = tripDurations.reduce((sum, d) => sum + d, 0);
  const averageTripDuration = tripDurations.length
    ? totalDaysTraveling / tripDurations.length
    : 0;

  return {
    totalTrips,
    localTrips,
    abroadTrips,
    completedTrips,
    completedAbroadTrips,
    upcomingTrips,
    longestTrip,
    shortestTrip,
    longestTripName,
    longestTripRange,
    shortestTripName,
    shortestTripRange,
    averageTripDuration,
    totalDaysTraveling,
  };
}
