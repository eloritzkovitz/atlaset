import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { useMapView } from "@contexts/MapViewContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useUI } from "@contexts/UIContext";
import { useScreenSize } from "@hooks";

export function MapOverlayToggle() {
  const { t } = useTranslation("atlas");
  const { uiVisible } = useUI();
  const { isMobile } = useScreenSize();
  const { timelineMode } = useTimeline();
  const { mapMode, colorMode, setColorMode } = useMapView();

  // Only show toggle when in view mode
  if (mapMode !== "view" || timelineMode) return null;

  const isAtlasActive = colorMode === "atlas";

  return (
    <div
      className={`fixed bottom-8 z-[10010] transition-all duration-300 flex items-center gap-2
        ${isMobile ? "start-140" : "start-114 md:start-116"} 
        ${uiVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      <button
        onClick={() =>
          setColorMode((prev) => (prev === "atlas" ? "standard" : "atlas"))
        }
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-action font-medium text-sm shadow-lg transition-all duration-200 active:scale-95"
        aria-label={
          isAtlasActive
            ? t("overlays.colorMode.standard")
            : t("overlays.colorMode.atlas")
        }
      >
        {isAtlasActive ? <ICONS.overlays.atlas /> : <ICONS.overlays.standard />}

        {!isMobile && (
          <span>
            {isAtlasActive
              ? t("overlays.colorMode.atlas")
              : t("overlays.colorMode.standard")}
          </span>
        )}
      </button>
    </div>
  );
}
