import type { Trip } from "@features/trips/types";

/** Represents a calendar view. */
export type CalendarView = "day" | "week" | "month";

/** Represents a trip event in the calendar. */
export type TripEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Trip;
  color?: string;
};

/** Represents a trip event type key. */
export type TripEventTypeKey = "local" | "abroad" | "upcoming";

/** Represents the filters for trip events in the calendar. */
export type TripEventFilters = {
  local: boolean;
  abroad: boolean;
  upcoming: boolean;
};
