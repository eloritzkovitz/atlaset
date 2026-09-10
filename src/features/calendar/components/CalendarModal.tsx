import { lazy, Suspense, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner, Modal, ModalHeader, OverlayPortal } from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@app/contexts/UIContext";
import { useTrips } from "@features/trips/core/context/TripsContext";
import { useTripFilters } from "@features/trips";
import { useArrowNavigation } from "@hooks";
import { AppCalendar } from "./AppCalendar";
import { type CalendarView, type TripEventTypeKey } from "../types";
import { getNextCalendarDate } from "../utils/navigation";

const CalendarSidePanel = lazy(() =>
  import("./CalendarSidePanel").then((m) => ({ default: m.CalendarSidePanel })),
);

/** Renders the calendar modal. */
export default function CalendarModal() {
  const navigate = useNavigate();

  const { trips } = useTrips();
  const { filters, setFilters, filteredTrips } = useTripFilters(trips);
  const { calendarDate, closeCalendar } = useUI();

  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState<Date>(calendarDate ?? new Date());

  // Handler for toggling trip event types
  const handleToggleType = (type: TripEventTypeKey) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePrevious = useCallback(() => {
    setDate((previousDate) => getNextCalendarDate(previousDate, view, -1));
  }, [view]);

  const handleNext = useCallback(() => {
    setDate((previousDate) => getNextCalendarDate(previousDate, view, 1));
  }, [view]);

  useArrowNavigation({
    isRTL: false,
    canPrevious: true,
    canNext: true,
    onPrevious: handlePrevious,
    onNext: handleNext,
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
              onSelectTrip={(trip) => {
                closeCalendar();
                navigate(`/trips/${trip.id}`);
              }}
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
