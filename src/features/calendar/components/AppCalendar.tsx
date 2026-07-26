import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { type View } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import {
  TRIP_TYPE_COLORS,
  isLocalTrip,
  isUpcomingTrip,
  type Trip,
} from "@features/trips";
import { useHomeCountry } from "@features/user/profile";
import { darkenHexColor } from "@utils/color";
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

  // Map trips to calendar events
  const events: TripEvent[] = trips
    .filter((trip) => trip.startDate)
    .map((trip) => ({
      title: trip.name,
      start: new Date(trip.startDate!),
      end: trip.endDate ? new Date(trip.endDate) : new Date(trip.startDate!),
      allDay: true,
      resource: trip,
      color: isLocalTrip(trip, homeCountry)
        ? TRIP_TYPE_COLORS[0]
        : TRIP_TYPE_COLORS[1],
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
        onView={handleViewChange as (view: View) => void}
        date={calendarDate}
        onNavigate={(actionOrDate, newDate) => {
          const isDate = (d: unknown): d is Date =>
            Object.prototype.toString.call(d) === "[object Date]";
          if (isDate(actionOrDate)) {
            handleDateChange(actionOrDate);
          } else if (typeof actionOrDate === "string") {
            if (actionOrDate === "DATE" && isDate(newDate)) {
              handleDateChange(newDate);
            } else if (actionOrDate === "TODAY") {
              handleDateChange(new Date());
            } else if (actionOrDate === "PREV" || actionOrDate === "NEXT") {
              const direction = actionOrDate === "NEXT" ? 1 : -1;
              const d = getNextCalendarDate(
                calendarDate,
                calendarView,
                direction,
              );
              handleDateChange(d);
            }
          }
        }}
        components={{
          toolbar: (props) => (
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
        }}
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
