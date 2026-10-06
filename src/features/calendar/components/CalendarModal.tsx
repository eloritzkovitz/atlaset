import { lazy, Suspense, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LoadingSpinner,
  DirectionalIcon,
  HamburgerButton,
  Modal,
  ModalHeader,
  OverlayPortal,
  SidePanelMenu,
  Sheet,
} from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@app/contexts/UIContext";
import { useTrips } from "@features/trips/core/context/TripsContext";
import { useTripFilters } from "@features/trips";
import { useArrowNavigation, useScreenSize, useSwipeNavigation } from "@hooks";
import { AppCalendar } from "./AppCalendar";
import { type CalendarView, type TripEventTypeKey } from "../types";
import { viewOptions } from "../constants/calendarToolbarOptions";
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
  const { isMobile } = useScreenSize();

  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState<Date>(calendarDate ?? new Date());
  const [actionsOpen, setActionsOpen] = useState(false);

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
  const handleToday = useCallback(() => {
    setDate(new Date());
  }, []);

  const isRTL = document.documentElement.dir === "rtl";
  const { handleTouchStart, handleTouchEnd } = useSwipeNavigation(
    handlePrevious,
    handleNext,
    isRTL,
  );

  useArrowNavigation({
    isRTL: false,
    canPrevious: true,
    canNext: true,
    onPrevious: handlePrevious,
    onNext: handleNext,
  });

  const content = (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      {!isMobile && (
        <Suspense fallback={<LoadingSpinner />}>
          <CalendarSidePanel
            date={date}
            setDate={setDate}
            filters={filters}
            onToggleType={handleToggleType}
          />
        </Suspense>
      )}
      <div
        className="flex min-h-0 min-w-0 flex-1 flex-col"
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
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
          className="min-h-0 flex-1"
          height={isMobile ? "calc(100dvh - 5rem)" : 800}
        />
      </div>
    </div>
  );

  const header = (
    <ModalHeader
      onClose={closeCalendar}
      title={
        <>
          <ICONS.calendar />
          Calendar
        </>
      }
    />
  );

  const mobileActionItems = [
    {
      key: "today",
      label: "Today",
      icon: <ICONS.calendar />,
    },
    {
      key: "previous",
      label: "Previous",
      icon: <DirectionalIcon direction="prev" />,
    },
    {
      key: "next",
      label: "Next",
      icon: <DirectionalIcon direction="next" />,
    },
    ...viewOptions.map((option) => ({
      key: option.value,
      label: option.label,
      icon: <ICONS.calendar />,
    })),
  ];

  if (isMobile) {
    return (
      <>
        <Sheet
          isOpen
          onClose={closeCalendar}
          className="h-screen max-h-screen overflow-hidden"
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-start">
              <HamburgerButton
                onClick={() => setActionsOpen(true)}
                className="relative top-0 start-0 z-auto shrink-0 p-1"
              />
              <div className="min-w-0 flex-1">{header}</div>
            </div>
            {content}
          </div>
        </Sheet>
        <SidePanelMenu
          title="Calendar actions"
          menuItems={mobileActionItems}
          selectedPanel={view}
          setSelectedPanel={(key) => {
            if (key === "today") handleToday();
            if (key === "previous") handlePrevious();
            if (key === "next") handleNext();
            if (key === "day" || key === "week" || key === "month") {
              setView(key);
            }
          }}
          open={actionsOpen}
          onClose={() => setActionsOpen(false)}
          width={320}
          showSidebar={false}
          showHeader
        />
      </>
    );
  }

  return (
    <OverlayPortal>
      <Modal
        isOpen
        onClose={closeCalendar}
        className="relative flex !h-[890px] min-h-[890px] !min-w-4/5 flex-col shadow"
        draggable
        containerZIndex={10060}
        backdropZIndex={10059}
      >
        {header}
        {content}
      </Modal>
    </OverlayPortal>
  );
}
