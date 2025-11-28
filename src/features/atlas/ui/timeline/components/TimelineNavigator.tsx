import {
  FaChevronLeft,
  FaChevronRight,
  FaAnglesLeft,
  FaAnglesRight,
  FaPause,
  FaPlay,
} from "react-icons/fa6";
import { ActionButton, ToolbarSelectButton } from "@components";
import { useTimeline } from "@contexts/TimelineContext";
import type { OverlayMode } from "@types";
import { useTimelineNavigation } from "../hooks/useTimelineNavigation";

export function TimelineNavigator({}) {
  const { years, selectedYear, setSelectedYear, overlayMode, setOverlayMode } =
    useTimeline();

  // Timeline navigation handlers
  const {
    currentIndex,
    canGoBack,
    canGoForward,
    handleBack,
    handleForward,
    handleFirst,
    handleLast,
    playing,
    setPlaying,
    speed,
    handleSpeedChange,
  } = useTimelineNavigation(years, selectedYear, setSelectedYear);

  return (
    <div className="absolute bottom-7 left-0 w-full z-50 flex items-center justify-center">
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <ActionButton
          onClick={() => setPlaying((p) => !p)}
          ariaLabel={playing ? "Pause" : "Play"}
          title={playing ? "Pause" : "Play"}
          icon={
            playing ? (
              <FaPause />
            ) : (
              <FaPlay className={!canGoForward ? "opacity-50" : ""} />
            )
          }
          disabled={!canGoForward}
          className="toolbar-btn rounded-full transition"
        />
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
          icon={
            <FaChevronRight className={!canGoForward ? "opacity-50" : ""} />
          }
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
        <ActionButton
          onClick={handleSpeedChange}
          ariaLabel={`Speed: ${speed}x`}
          title={`Speed: ${speed}x`}
          className="toolbar-btn rounded-full transition"
        >
          <span>{speed}x</span>
        </ActionButton>
      </div>
      <div className="relative left-80 flex items-center">
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
    </div>
  );
}
