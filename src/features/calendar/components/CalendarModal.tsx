import { lazy, Suspense, useCallback, useState } from "react";
import { LoadingSpinner, Modal, ModalHeader, OverlayPortal } from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@app/contexts/UIContext";
import { useTrips } from "@features/trips/context/TripsContext";
import { useTripFilters } from "@features/trips/hooks/useTripFilters";
import { useKeyHandler } from "@hooks";
import { AppCalendar } from "./AppCalendar";
import { type CalendarView, type TripEventTypeKey } from "../types";
import { getNextCalendarDate } from "../utils/navigation";

const CalendarSidePanel = lazy(() =>
  import("./CalendarSidePanel").then((m) => ({ default: m.CalendarSidePanel })),
);

/** Renders the calendar modal. */
export default function CalendarModal() {
  const { trips } = useTrips();
  const { filters, setFilters, filteredTrips } = useTripFilters(trips);
  const { calendarDate, closeCalendar } = useUI();

  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState<Date>(calendarDate ?? new Date());

  // Handler for toggling trip event types
  const handleToggleType = (type: TripEventTypeKey) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Handler for arrow keys
  const handleArrow = useCallback(
    (event: KeyboardEvent) => {
      setDate((prev) =>
        getNextCalendarDate(prev, view, event.key === "ArrowRight" ? 1 : -1),
      );
    },
    [view],
  );

  useKeyHandler(handleArrow, ["ArrowLeft", "ArrowRight"], {
    enabled: true,
  });

  return (
    <OverlayPortal>
      <Modal
        isOpen={true}
        onClose={closeCalendar}
        className="!min-w-4/5 min-h-[890px] !h-[890px] flex flex-col shadow relative"
        draggable
        containerZIndex={10060}
        backdropZIndex={10059}
      >
        <ModalHeader
          title={
            <>
              <ICONS.calendar />
              Calendar
            </>
          }
        />
        <div className="flex flex-row w-full h-full">
          <Suspense fallback={<LoadingSpinner />}>
            <CalendarSidePanel
              date={date}
              setDate={setDate}
              filters={filters}
              onToggleType={handleToggleType}
            />
          </Suspense>
          <div className="flex flex-col flex-1 min-w-0">
            <AppCalendar
              trips={filteredTrips}
              view={view}
              date={date}
              onViewChange={setView}
              onDateChange={setDate}
            />
          </div>
        </div>
      </Modal>
    </OverlayPortal>
  );
}
