import React, { useCallback, useState } from "react";
import { FaCalendar, FaXmark } from "react-icons/fa6";
import { ActionButton, Modal, PanelHeader } from "@components";
import { useKeyHandler } from "@hooks";
import { CalendarDateControls } from "./CalendarDateControls";
import { TripsCalendar } from "./TripsCalendar";
import { type CalendarView, type Trip } from "../../types";

interface TripsCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: Trip[];
}

export const TripsCalendarModal: React.FC<TripsCalendarModalProps> = ({
  isOpen,
  onClose,
  trips,
}) => {
  // State for calendar view and date
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState<Date>(new Date());

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
      className="w-[950px] max-h-[92vh] flex flex-col shadow"
      draggable
    >
      <PanelHeader
        title={
          <>
            <FaCalendar />
            Trips Calendar
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
      <div className="flex flex-col w-full h-full">
        <CalendarDateControls
          month={currentMonth}
          year={currentYear}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          onToday={handleToday}
          view={view}
          onViewChange={setView}
        />
        <TripsCalendar
          trips={trips}
          view={view}
          date={date}
          onViewChange={setView}
          onDateChange={setDate}
        />
      </div>
    </Modal>
  );
};
