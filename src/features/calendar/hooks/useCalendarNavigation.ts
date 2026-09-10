import { useUI } from "@app/contexts/UIContext";
import { useTrips } from "@features/trips";

/**
 * Handles navigation to the calendar view for a specific trip.
 */
export function useCalendarNavigation() {
  const { trips } = useTrips();
  const { handleViewInCalendar } = useUI();

  /**
   * Opens the calendar view for a specific trip by its ID.
   * @param tripId - The ID of the trip to view in the calendar.
   */
  const openTripInCalendar = (tripId: string) => {
    const trip = trips.find((trip) => trip.id === tripId);

    if (!trip) return;

    handleViewInCalendar(trip);
  };

  return {
    openTripInCalendar,
  };
}
