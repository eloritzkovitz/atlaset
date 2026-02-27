import { useCallback, useEffect, useState } from "react";
import { FaCalendar, FaXmark } from "react-icons/fa6";
import { ActionButton, Modal, PanelHeader } from "@components";
import { type Trip } from "@features/trips";
import { useTripFilters } from "@features/trips/hooks/useTripFilters";
import { useKeyHandler } from "@hooks";
import { AppCalendar } from "./AppCalendar";
import { CalendarSidePanel } from "./CalendarSidePanel";
import { type CalendarView, type TripEventTypeKey } from "../types";
import { getNextCalendarDate } from "../utils/navigation";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: Trip[];
  date?: Date;
}

export default function CalendarModal({
  isOpen,
  onClose,
  trips,
  date: controlledDate,
}: CalendarModalProps) {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState<Date>(controlledDate ?? new Date());

  // Trip filtering logic
  const { filters, setFilters, filteredTrips } = useTripFilters(trips);

  // Handler for toggling trip event types
  const handleToggleType = (type: TripEventTypeKey) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Sync internal date with controlled prop
  useEffect(() => {
    if (controlledDate && controlledDate.getTime() !== date.getTime()) {
      setDate(controlledDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledDate]);

  // Handler for arrow keys
  const handleArrow = useCallback(
    (event: KeyboardEvent) => {
      setDate((prev) =>
        getNextCalendarDate(prev, view, event.key === "ArrowRight" ? 1 : -1),
      );
    },
    [view],
  );

  useKeyHandler(handleArrow, ["ArrowLeft", "ArrowRight"], isOpen);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="!min-w-4/5 min-h-[890px] !h-[890px] flex flex-col shadow relative"
      draggable
    >
      <PanelHeader
        title={
          <>
            <FaCalendar />
            Calendar
          </>
        }
        showSeparator={true}
      >
        <ActionButton
          onClick={onClose}
          ariaLabel="Close"
          title="Close"
          icon={<FaXmark className="text-2xl" />}
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
    </Modal>
  );
}
