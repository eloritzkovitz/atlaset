import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { type View } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import { CalendarToolbar } from "./CalendarToolbar";
import { type CalendarView, type Trip, type TripEvent } from "../../types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./TripsCalendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

interface TripsCalendarProps {
  trips: Trip[];
  onSelectTrip?: (trip: Trip) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  view?: CalendarView;
  date?: Date;
  onViewChange?: (view: CalendarView) => void;
  onDateChange?: (date: Date) => void;
}

export function TripsCalendar({
  trips,
  onSelectTrip,
  onSelectSlot,
  view,
  date,
  onViewChange,
  onDateChange,
}: TripsCalendarProps) {
  // Map trips to calendar events
  const events: TripEvent[] = trips
    .filter((trip) => trip.startDate)
    .map((trip) => ({
      title: trip.name,
      start: new Date(trip.startDate!),
      end: trip.endDate ? new Date(trip.endDate) : new Date(trip.startDate!),
      allDay: true,
      resource: trip,
    }));

  // Controlled state for view and date
  const [internalView, setInternalView] = useState<CalendarView>("month");
  const [internalDate, setInternalDate] = useState<Date>(new Date());

  // Use controlled props if provided, otherwise fallback to internal state
  const calendarView = view ?? internalView;
  const calendarDate = date ?? internalDate;
  const handleViewChange = onViewChange ?? setInternalView;
  const handleDateChange = onDateChange ?? setInternalDate;

  return (
    <div style={{ height: 600 }}>
      <Calendar<TripEvent>
        localizer={localizer}
        events={events}
        startAccessor={(event) => event.start}
        endAccessor={(event) => event.end}
        titleAccessor={(event) => event.title}
        onSelectEvent={(event) => onSelectTrip?.(event.resource)}
        selectable
        onSelectSlot={onSelectSlot}
        views={["month", "week", "day"]}
        popup
        view={calendarView}
        onView={handleViewChange as (view: View) => void}
        date={calendarDate}
        onNavigate={handleDateChange}
        components={{ toolbar: CalendarToolbar }}
      />
    </div>
  );
}
