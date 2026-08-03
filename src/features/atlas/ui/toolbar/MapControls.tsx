import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  FaPlus,
  FaMinus,
  FaUpRightAndDownLeftFromCenter,
} from "react-icons/fa6";
import { ActionButton } from "@components";
import { DEFAULT_MAP_SETTINGS, useAccessibility } from "@features/settings";
import { useKeyHandler } from "@hooks";

interface MapControlsProps {
  orientation?: "vertical" | "horizontal";
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  visible?: boolean;
}

export function MapControls({
  orientation = "vertical",
  zoom,
  setZoom,
  visible = true,
}: MapControlsProps) {
  const { singleKeyShortcutsEnabled } = useAccessibility();
  const { t } = useTranslation("atlas");

  const zoomInInterval = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomOutInterval = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start continuous zooming
  const startContinuousZoom = (direction: "in" | "out") => {
    const step = direction === "in" ? 1 : -1;
    const interval = setInterval(() => {
      setZoom((prev) =>
        Math.max(
          DEFAULT_MAP_SETTINGS.minZoom,
          Math.min(prev + step, DEFAULT_MAP_SETTINGS.maxZoom),
        ),
      );
    }, 100);
    if (direction === "in") zoomInInterval.current = interval;
    else zoomOutInterval.current = interval;
  };

  // Stop continuous zooming
  const stopContinuousZoom = (direction: "in" | "out") => {
    if (direction === "in" && zoomInInterval.current) {
      clearInterval(zoomInInterval.current);
      zoomInInterval.current = null;
    }
    if (direction === "out" && zoomOutInterval.current) {
      clearInterval(zoomOutInterval.current);
      zoomOutInterval.current = null;
    }
  };

  // Zoom in
  useKeyHandler(
    () => setZoom(Math.min(zoom + 1, DEFAULT_MAP_SETTINGS.maxZoom)),
    ["+", "="],
    { allowSingleKeyShortcuts: singleKeyShortcutsEnabled },
  );

  // Zoom out
  useKeyHandler(
    () => setZoom(Math.max(zoom - 1, DEFAULT_MAP_SETTINGS.minZoom)),
    ["-"],
    { allowSingleKeyShortcuts: singleKeyShortcutsEnabled },
  );

  // Reset zoom
  useKeyHandler(() => setZoom(DEFAULT_MAP_SETTINGS.minZoom), ["0"], {
    allowSingleKeyShortcuts: singleKeyShortcutsEnabled,
  });

  return (
    <div
      className={`toolbar-zoom-controls ${
        visible
          ? "toolbar-zoom-controls-visible"
          : "toolbar-zoom-controls-hidden"
      }`}
    >
      <div className="flex flex-col items-center space-y-0.5">
        <ActionButton
          onClick={() =>
            setZoom(Math.min(zoom + 1, DEFAULT_MAP_SETTINGS.maxZoom))
          }
          onMouseDown={() => startContinuousZoom("in")}
          onMouseUp={() => stopContinuousZoom("in")}
          onMouseLeave={() => stopContinuousZoom("in")}
          onTouchStart={() => startContinuousZoom("in")}
          onTouchEnd={() => stopContinuousZoom("in")}
          ariaLabel={t("controls.zoomIn")}
          title={t("controls.zoomIn")}
          titlePosition="left"
          icon={<FaPlus />}
          variant="action"
          rounded
          className={orientation === "horizontal" ? "shadow" : ""}
        />
        <ActionButton
          onClick={() =>
            setZoom(Math.max(zoom - 1, DEFAULT_MAP_SETTINGS.minZoom))
          }
          onMouseDown={() => startContinuousZoom("out")}
          onMouseUp={() => stopContinuousZoom("out")}
          onMouseLeave={() => stopContinuousZoom("out")}
          onTouchStart={() => startContinuousZoom("out")}
          onTouchEnd={() => stopContinuousZoom("out")}
          ariaLabel={t("controls.zoomOut")}
          title={t("controls.zoomOut")}
          titlePosition="left"
          icon={<FaMinus />}
          variant="action"
          rounded
          className={orientation === "horizontal" ? "shadow" : ""}
        />
        <ActionButton
          onClick={() => setZoom(DEFAULT_MAP_SETTINGS.minZoom)}
          ariaLabel={t("controls.resetView")}
          title={t("controls.resetView")}
          titlePosition="left"
          icon={<FaUpRightAndDownLeftFromCenter />}
          variant="action"
          rounded
          className={orientation === "horizontal" ? "shadow" : ""}
        />
      </div>
    </div>
  );
}
