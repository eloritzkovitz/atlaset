import {
  FaChevronLeft,
  FaChevronRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";
import { ActionButton, ToolbarSelectButton } from "@components";
import type { OverlayMode } from "@types";
import { useTimelineNavigation } from "./hooks/useTimelineNavigation";

interface TimelineNavigatorProps {
  years: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  overlayMode: OverlayMode;
  setOverlayMode: (mode: OverlayMode) => void;
}

export function TimelineNavigator({
  years,
  selectedYear,
  setSelectedYear,
  overlayMode,
  setOverlayMode,
}: TimelineNavigatorProps) {
  const {
    currentIndex,
    canGoBack,
    canGoForward,
    handleBack,
    handleForward,
    handleFirst,
    handleLast,
  } = useTimelineNavigation(years, selectedYear, setSelectedYear);  

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 flex items-center gap-2">
      <ActionButton
        onClick={handleFirst}
        ariaLabel="First year"
        title="First year"
        icon={
          <FaAnglesLeft className={currentIndex === 0 ? "opacity-50" : ""} />
        }
        disabled={currentIndex === 0}
        className="toolbar-btn rounded-full transition"
      />
      <ActionButton
        onClick={handleBack}
        ariaLabel="Previous year"
        title="Previous year"
        icon={<FaChevronLeft className={!canGoBack ? "opacity-50" : ""} />}
        disabled={!canGoBack}
        className="toolbar-btn rounded-full transition"
      />
      <ToolbarSelectButton
        value={selectedYear}
        onChange={(year) => setSelectedYear(Number(year))}
        options={years.map((y) => ({ value: y, label: y }))}
        ariaLabel="Select year"
        width="90px"
      />
      <ActionButton
        onClick={handleForward}
        ariaLabel="Next year"
        title="Next year"
        icon={<FaChevronRight className={!canGoForward ? "opacity-50" : ""} />}
        disabled={!canGoForward}
        className="toolbar-btn rounded-full transition"
      />
      <ActionButton
        onClick={handleLast}
        ariaLabel="Last year"
        title="Last year"
        icon={
          <FaAnglesRight
            className={currentIndex === years.length - 1 ? "opacity-50" : ""}
          />
        }
        disabled={currentIndex === years.length - 1}
        className="toolbar-btn rounded-full transition"
      />
      <span className="ml-2" />
      <ToolbarSelectButton
        value={overlayMode}
        onChange={(mode) => setOverlayMode(mode as OverlayMode)}
        options={[
          { value: "cumulative", label: "Cumulative visits" },
          { value: "yearly", label: "Yearly visits" },
        ]}
        ariaLabel="Color mode"
        width="180px"
      />
    </div>
  );
}
