import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { type View } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import { type Trip } from "../../types";
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

interface TripEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Trip;
}

interface TripsCalendarProps {
  trips: Trip[];
  onSelectTrip?: (trip: Trip) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
}

export function TripsCalendar({
  trips,
  onSelectTrip,
  onSelectSlot,
}: TripsCalendarProps) {
  // Map trips to calendar events
  const events: TripEvent[] = trips.map((trip) => ({
    title: trip.name,
    start: trip.startDate ? new Date(trip.startDate) : new Date(),
    end: trip.endDate ? new Date(trip.endDate) : new Date(),
    allDay: true,
    resource: trip,
  }));

  // Controlled state for view and date
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [date, setDate] = useState<Date>(new Date());

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
        view={view}
        onView={setView as (view: View) => void}
        date={date}
        onNavigate={setDate}
      />
    </div>
  );
}
