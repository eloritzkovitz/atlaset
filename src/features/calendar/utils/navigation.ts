import { type CalendarView } from "../types";

/**
 * Returns a new date moved by the correct unit (day, week, month) based on the calendar view.
 * @param date The current date
 * @param view The calendar view ("day" | "week" | "month")
 * @param direction +1 for next, -1 for previous
 */
export function getNextCalendarDate(
  date: Date,
  view: CalendarView,
  direction: 1 | -1,
): Date {
  const d = new Date(date);
  if (view === "month") {
    d.setMonth(d.getMonth() + direction);
  } else if (view === "week") {
    d.setDate(d.getDate() + 7 * direction);
  } else if (view === "day") {
    d.setDate(d.getDate() + direction);
  }
  return d;
}
