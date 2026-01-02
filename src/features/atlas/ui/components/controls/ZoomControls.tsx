import { useRef } from "react";
import { FaPlus, FaMinus, FaCrosshairs } from "react-icons/fa6";
import { ActionButton } from "@components";
import { DEFAULT_MAP_SETTINGS } from "@constants";
import { useKeyHandler } from "@hooks";

interface ZoomControlsProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

export function ZoomControls({ zoom, setZoom }: ZoomControlsProps) {
  const zoomInInterval = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomOutInterval = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start continuous zooming
  const startContinuousZoom = (direction: "in" | "out") => {
    const step = direction === "in" ? 1 : -1;
    const interval = setInterval(() => {
      setZoom((prev) =>
        Math.max(
          DEFAULT_MAP_SETTINGS.minZoom,
          Math.min(prev + step, DEFAULT_MAP_SETTINGS.maxZoom)
        )
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
    true
  );

  // Zoom out
  useKeyHandler(
    () => setZoom(Math.max(zoom - 1, DEFAULT_MAP_SETTINGS.minZoom)),
    ["-"],
    true
  );

  // Reset zoom
  useKeyHandler(() => setZoom(DEFAULT_MAP_SETTINGS.minZoom), ["0"], true);

  return (
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
        ariaLabel="Zoom in"
        title="Zoom in"
        titlePosition="left"
        icon={<FaPlus />}
        variant="action"
        rounded
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
        ariaLabel="Zoom out"
        title="Zoom out"
        titlePosition="left"
        icon={<FaMinus />}
        variant="action"
        rounded
      />
      <ActionButton
        onClick={() => setZoom(DEFAULT_MAP_SETTINGS.minZoom)}
        ariaLabel="Reset zoom"
        title="Reset zoom"
        titlePosition="left"
        icon={<FaCrosshairs />}
        variant="action"
        rounded
      />
    </div>
  );
}
