import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import {
  TRIP_TYPE_COLORS,
  isLocalTrip,
  isUpcomingTrip,
  type Trip,
} from "@features/trips";
import { useHomeCountry } from "@features/user/profile";
import { darkenHexColor } from "@utils";
import { CalendarToolbar } from "./CalendarToolbar";
import { type CalendarView, type TripEvent } from "../types";
import { getNextCalendarDate } from "../utils/navigation";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

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

interface AppCalendarProps {
  trips: Trip[];
  onSelectTrip?: (trip: Trip) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  view?: CalendarView;
  date?: Date;
  onViewChange?: (view: CalendarView) => void;
  onDateChange?: (date: Date) => void;
}

export function AppCalendar({
  trips,
  onSelectTrip,
  onSelectSlot,
  view,
  date,
  onViewChange,
  onDateChange,
}: AppCalendarProps) {
  const { homeCountry } = useHomeCountry();

  const [internalView, setInternalView] = useState<CalendarView>("month");
  const [internalDate, setInternalDate] = useState<Date>(new Date());

  const calendarView = view ?? internalView;
  const calendarDate = date ?? internalDate;
  const handleViewChange = onViewChange ?? setInternalView;
  const handleDateChange = onDateChange ?? setInternalDate;

  // Map trips to calendar events
  const events: TripEvent[] = useMemo(
    () =>
      trips
        .filter((trip) => trip.startDate)
        .map((trip) => ({
          title: trip.name,
          start: new Date(trip.startDate!),
          end: trip.endDate
            ? new Date(trip.endDate)
            : new Date(trip.startDate!),
          allDay: true,
          resource: trip,
          color: isLocalTrip(trip, homeCountry)
            ? TRIP_TYPE_COLORS[0]
            : TRIP_TYPE_COLORS[1],
        })),
    [trips, homeCountry],
  );

  const components = useMemo(
    () => ({
      toolbar: (props: { label: string }) => (
        <CalendarToolbar
          label={props.label}
          view={calendarView}
          onViewChange={handleViewChange}
          onToday={() => handleDateChange(new Date())}
          onNavigate={(action) => {
            if (action === "TODAY") {
              handleDateChange(new Date());
            } else if (action === "PREV" || action === "NEXT") {
              const direction = action === "NEXT" ? 1 : -1;
              const d = getNextCalendarDate(
                calendarDate,
                calendarView,
                direction,
              );
              handleDateChange(d);
            }
          }}
        />
      ),
    }),
    [calendarView, calendarDate, handleViewChange, handleDateChange],
  );

  return (
    <div style={{ height: 800 }}>
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
        onView={handleViewChange as (v: View) => void}
        date={calendarDate}
        components={components}
        eventPropGetter={(event) => {
          const bg = event.color || "bg-primary-active";
          const isUpcoming = isUpcomingTrip(event.resource);
          return {
            style: {
              backgroundColor: bg,
              color: darkenHexColor(bg, 0.75),
              borderRadius: 6,
              boxSizing: "border-box",
              paddingLeft: 8,
              paddingRight: 8,
            },
            className: isUpcoming ? "upcoming-trip-event" : undefined,
          };
        }}
      />
    </div>
  );
}
