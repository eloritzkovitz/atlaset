import { FaPause, FaPlay } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  ToolbarSelectButton,
  DirectionalIcon,
} from "@components";
import type { ColorMode } from "@features/atlas/core/types";
import { useMapView } from "@features/atlas/map";
import { useLanguage } from "@features/settings";
import { useTimeline } from "../../context/TimelineContext";
import { useTimelineNavigation } from "../../hooks/useTimelineNavigation";

export function TimelineNavigator() {
  const { colorMode, setColorMode } = useMapView();
  const { years, selectedYear, setSelectedYear } = useTimeline();
  const { isRtl } = useLanguage();
  const { t } = useTranslation("atlas");

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
  } = useTimelineNavigation();

  return (
    <div className="absolute bottom-7 start-0 w-full z-50 flex items-center justify-center">
      <div
        className={`absolute ${isRtl ? "end-1/2" : "start-1/2"} transform -translate-x-1/2 flex items-center gap-2`}
      >
        <ActionButton
          onClick={() => setPlaying((p) => !p)}
          ariaLabel={playing ? t("timeline.pause") : t("timeline.play")}
          title={playing ? t("timeline.pause") : t("timeline.play")}
          icon={
            playing ? (
              <FaPause />
            ) : (
              <FaPlay className={!canGoForward ? "opacity-50" : ""} />
            )
          }
          disabled={!canGoForward}
          variant="action"
          rounded
        />
        <ActionButton
          onClick={handleFirst}
          ariaLabel={t("timeline.firstYear")}
          title={t("timeline.firstYear")}
          icon={
            <DirectionalIcon
              variant="angle"
              direction="prev"
              className={currentIndex === 0 ? "opacity-50" : ""}
            />
          }
          disabled={currentIndex === 0}
          variant="action"
          rounded
        />
        <ActionButton
          onClick={handleBack}
          ariaLabel={t("timeline.previousYear")}
          title={t("timeline.previousYear")}
          icon={
            <DirectionalIcon
              direction="prev"
              className={!canGoBack ? "opacity-50" : ""}
            />
          }
          disabled={!canGoBack}
          variant="action"
          rounded
        />
        <ToolbarSelectButton
          value={selectedYear}
          onChange={(year) => setSelectedYear(Number(year))}
          options={years.map((y) => ({ value: y, label: String(y) }))}
          ariaLabel="Select year"
          width="90px"
        />
        <ActionButton
          onClick={handleForward}
          ariaLabel={t("timeline.nextYear")}
          title={t("timeline.nextYear")}
          icon={
            <DirectionalIcon
              direction="next"
              className={!canGoForward ? "opacity-50" : ""}
            />
          }
          disabled={!canGoForward}
          variant="action"
          rounded
        />
        <ActionButton
          onClick={handleLast}
          ariaLabel={t("timeline.lastYear")}
          title={t("timeline.lastYear")}
          icon={
            <DirectionalIcon
              variant="angle"
              direction="next"
              className={currentIndex === years.length - 1 ? "opacity-50" : ""}
            />
          }
          disabled={currentIndex === years.length - 1}
          variant="action"
          rounded
        />
        <ActionButton
          onClick={handleSpeedChange}
          ariaLabel={t("timeline.speed", { speed })}
          title={t("timeline.speed", { speed })}
          variant="action"
          rounded
        >
          <span>{speed}x</span>
        </ActionButton>
      </div>
      <div className="relative start-80 flex items-center">
        <ToolbarSelectButton
          value={colorMode}
          onChange={(mode) => setColorMode(mode as ColorMode)}
          options={[
            { value: "cumulative", label: t("timeline.cumulativeVisits") },
            { value: "yearly", label: t("timeline.yearlyVisits") },
          ]}
          ariaLabel={t("timeline.colorMode")}
          width="180px"
        />
      </div>
    </div>
  );
}
