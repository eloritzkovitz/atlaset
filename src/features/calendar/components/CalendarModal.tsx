import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ActionButton, Modal, PanelHeader } from "@components";
import { ICONS } from "@constants/icons";
import { useTrips } from "@contexts/TripsContext";
import { useUI } from "@contexts/UIContext";
import { useTripFilters } from "@features/trips/hooks/useTripFilters";
import { useKeyHandler } from "@hooks";
import { AppCalendar } from "./AppCalendar";
import { CalendarSidePanel } from "./CalendarSidePanel";
import { type CalendarView, type TripEventTypeKey } from "../types";
import { getNextCalendarDate } from "../utils/navigation";

/** Renders the calendar modal. */
export default function CalendarModal() {
  const { trips } = useTrips();
  const { filters, setFilters, filteredTrips } = useTripFilters(trips);
  const { showCalendar, calendarDate, closeCalendar } = useUI();

  // Date navigation state
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState<Date>(calendarDate ?? new Date());

  // Handler for toggling trip event types
  const handleToggleType = (type: TripEventTypeKey) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Sync internal date with controlled prop
  useEffect(() => {
    if (calendarDate && calendarDate.getTime() !== date.getTime()) {
      setDate(calendarDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarDate]);

  // Handler for arrow keys
  const handleArrow = useCallback(
    (event: KeyboardEvent) => {
      setDate((prev) =>
        getNextCalendarDate(prev, view, event.key === "ArrowRight" ? 1 : -1),
      );
    },
    [view],
  );

  useKeyHandler(handleArrow, ["ArrowLeft", "ArrowRight"], showCalendar);

  // Don't render the modal if it's not open
  if (!showCalendar) return null;

  return ReactDOM.createPortal(
    <Modal
      isOpen={showCalendar}
      onClose={closeCalendar}
      className="!min-w-4/5 min-h-[890px] !h-[890px] flex flex-col shadow relative"
      draggable
      containerZIndex={10060}
      backdropZIndex={10059}
    >
      <PanelHeader
        title={
          <>
            <ICONS.calendar />
            Calendar
          </>
        }
        showSeparator={true}
      >
        <ActionButton
          onClick={closeCalendar}
          ariaLabel="Close"
          title="Close"
          icon={<ICONS.close className="text-2xl" />}
          rounded
        />
      </PanelHeader>
      <div className="flex flex-row w-full h-full">
        <CalendarSidePanel
          date={date}
          setDate={setDate}
          filters={filters}
          onToggleType={handleToggleType}
        />
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
    </Modal>,
    document.body,
  );
}
