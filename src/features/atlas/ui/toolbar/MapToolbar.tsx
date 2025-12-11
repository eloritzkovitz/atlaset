import { useState } from "react";
import {
  FaGlobe,
  FaMapPin,
  FaLayerGroup,
  FaDownload,
  FaGear,
  FaTimeline,
  FaChevronLeft,
  FaChevronRight,
  FaMap,
} from "react-icons/fa6";
import { ActionButton, ActionsToolbar, ToolbarSeparator } from "@components";
import { VISITED_OVERLAY_ID } from "@constants/overlays";
import { useOverlays } from "@contexts/OverlaysContext";
import { useUI } from "@contexts/UIContext";
import { isTimelineOverlay } from "@features/atlas/overlays";
import { ZoomControls } from "../controls/ZoomControls";
import "./MapToolbar.css";

interface MapToolbarProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setTimelineMode: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

export function MapToolbar({
  zoom,
  setZoom,
  setTimelineMode,
  children,
}: MapToolbarProps) {
  // UI state
  const {
    uiVisible,
    toggleCountries,
    toggleMarkers,
    toggleOverlays,
    toggleLegend,
    toggleExport,
    toggleSettings,
  } = useUI();
  const [visible, setVisible] = useState(true);

  // Overlay context
  const { overlays } = useOverlays();
  const visitedOverlay = overlays.find((o) => o.id === VISITED_OVERLAY_ID);

  return (
    <div
      className={`toolbar-container ${
        uiVisible ? "toolbar-container-visible" : "toolbar-container-hidden"
      }`}
    >
      {/* Zoom controls: vertical slide */}
      <div
        className={`toolbar-zoom-controls ${
          visible
            ? "toolbar-zoom-controls-visible"
            : "toolbar-zoom-controls-hidden"
        }`}
      >
        <ZoomControls zoom={zoom} setZoom={setZoom} />
      </div>
      <div className="relative flex items-center" style={{ height: "40px" }}>
        {/* Actions: horizontal slide */}
        <ActionsToolbar
          className={`right-14 bg-action rounded-full px-2 transition-all duration-300 ${
            visible
              ? "opacity-100 pointer-events-auto translate-x-0"
              : "opacity-0 pointer-events-none translate-x-10"
          }`}
        >
          <ActionButton
            onClick={toggleCountries}
            ariaLabel="Countries"
            title="Countries"
            icon={<FaGlobe />}
            variant="action"
            rounded
          />
          <ActionButton
            onClick={toggleMarkers}
            ariaLabel="Markers"
            title="Markers"
            icon={<FaMapPin />}
            variant="action"
            rounded
          />
          <ActionButton
            onClick={toggleOverlays}
            ariaLabel="Overlays"
            title="Overlays"
            icon={<FaLayerGroup />}
            variant="action"
            rounded
          />
          <ActionButton
            onClick={toggleLegend}
            ariaLabel="Legend"
            title="Legend"
            icon={<FaMap />}
            variant="action"
            rounded
          />
          {visitedOverlay && isTimelineOverlay(visitedOverlay) && (
            <ActionButton
              onClick={() => setTimelineMode((prev) => !prev)}
              ariaLabel="Timeline"
              title="Timeline"
              icon={<FaTimeline />}
              variant="action"
              rounded
            />
          )}
          <ActionButton
            onClick={toggleExport}
            ariaLabel="Export"
            title="Export"
            icon={<FaDownload />}
            variant="action"
            rounded
          />
          <ToolbarSeparator />
          <ActionButton
            onClick={toggleSettings}
            ariaLabel="Settings"
            title="Settings"
            icon={<FaGear />}
            variant="action"
            rounded
          />
          {children}
        </ActionsToolbar>
        {/* Toggle button */}
        <ActionButton
          onClick={() => setVisible((v) => !v)}
          ariaLabel={visible ? "Hide toolbar" : "Show toolbar"}
          title={visible ? "Hide toolbar" : "Show toolbar"}
          variant="action"
          className={`${!visible ? "opacity-70" : ""}`}
          icon={visible ? <FaChevronRight /> : <FaChevronLeft />}
          rounded
        />
      </div>
    </div>
  );
}
