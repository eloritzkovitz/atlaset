import { useTrips } from "@contexts/TripsContext";
import {
  getCompletedTrips,
  getUpcomingTrips,
  getPlannedTrips,
  getLocalTrips,
  getAbroadTrips,
  getTripDays,
} from "@features/trips/utils/trips";
import { useHomeCountry } from "@features/user/profile";
import { findLongestTrip, findShortestTrip } from "../utils/tripStats";

export function useTripsStats() {
  const { homeCountry } = useHomeCountry();
  const { trips } = useTrips();

  // Trip counts
  const totalTrips = trips.length;
  const localTrips = getLocalTrips(trips, homeCountry);
  const abroadTrips = getAbroadTrips(trips, homeCountry);
  const completedTrips = getCompletedTrips(trips);
  const completedAbroadTrips = getAbroadTrips(completedTrips, homeCountry);
  const upcomingTrips = getUpcomingTrips(trips);
  const plannedTrips = getPlannedTrips(trips);

  // Only consider valid, completed abroad trips with valid dates and positive duration
  const now = Date.now();
  const validAbroadTrips = abroadTrips.filter((trip) => {
    return (
      trip.status === "completed" &&
      typeof trip.startDate === "string" &&
      typeof trip.endDate === "string" &&
      !!trip.startDate &&
      !!trip.endDate &&
      new Date(trip.endDate).getTime() > new Date(trip.startDate).getTime() &&
      new Date(trip.endDate).getTime() < now
    );
  });

  // Get longest and shortest trip objects based on valid abroad trips
  const longestTrip = findLongestTrip(validAbroadTrips);
  const shortestTrip = findShortestTrip(validAbroadTrips);

  // Calculate trip durations (in days)
  const tripDurations = trips.map(getTripDays).filter((d) => d > 0);

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
    plannedTrips,
    longestTrip,
    shortestTrip,
    averageTripDuration,
    totalDaysTraveling,
  };
}
