import React, { Suspense, useCallback, useEffect, useState } from "react";
import { FaCalendar, FaXmark } from "react-icons/fa6";
import { ActionButton, LoadingSpinner, Modal, PanelHeader } from "@components";
import { useTripFilters } from "@features/trips/hooks/useTripFilters";
import { useKeyHandler } from "@hooks";
import { CalendarDateControls } from "./CalendarDateControls";
import { CalendarLegend } from "./CalendarLegend";
import {
  type CalendarView,
  type Trip,
  type TripEventTypeKey,
} from "../../types";

const TripsCalendar = React.lazy(() => import("./TripsCalendar"));

interface TripsCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: Trip[];
  date?: Date;
}

export const TripsCalendarModal: React.FC<TripsCalendarModalProps> = ({
  isOpen,
  onClose,
  trips,
  date: controlledDate,
}) => {
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
  const handleArrow = useCallback((event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      // Go to previous month
      setDate((prev) => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() - 1);
        return d;
      });
    } else if (event.key === "ArrowRight") {
      // Go to next month
      setDate((prev) => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() + 1);
        return d;
      });
    }
  }, []);

  useKeyHandler(handleArrow, ["ArrowLeft", "ArrowRight"], isOpen);

  // Month and year controls
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  // Handler for month change
  const handleMonthChange = (val: string | number) => {
    const month = typeof val === "string" ? parseInt(val, 10) : val;
    setDate((prev) => {
      const d = new Date(prev);
      d.setMonth(month);
      return d;
    });
  };

  // Handler for year change
  const handleYearChange = (val: string | number) => {
    const year = typeof val === "string" ? parseInt(val, 10) : val;
    setDate((prev) => {
      const d = new Date(prev);
      d.setFullYear(year);
      return d;
    });
  };

  // Handler for 'Today' button
  const handleToday = () => setDate(new Date());

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="!min-w-[1200px] flex flex-col shadow relative"
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
        <div className="mt-35">
          <CalendarLegend
            shown={{
              local: filters.local,
              abroad: filters.abroad,
              upcoming: filters.upcoming,
            }}
            onToggle={handleToggleType}
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <CalendarDateControls
            month={currentMonth}
            year={currentYear}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
            onToday={handleToday}
            view={view}
            onViewChange={setView}
          />
          <Suspense
            fallback={
              <div className="h-[600px] w-full flex items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <TripsCalendar
              trips={filteredTrips}
              view={view}
              date={date}
              onViewChange={setView}
              onDateChange={setDate}
            />
          </Suspense>
        </div>
      </div>
    </Modal>
  );
};
