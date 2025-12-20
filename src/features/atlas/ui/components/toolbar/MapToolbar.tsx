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
  FaChevronUp,
} from "react-icons/fa6";
import {
  ActionButton,
  ActionsToolbar,
  MenuButton,
  ToolbarSeparator,
} from "@components";
import { VISITED_OVERLAY_ID } from "@constants/overlays";
import { useOverlays } from "@contexts/OverlaysContext";
import { useUI } from "@contexts/UIContext";
import { isTimelineOverlay } from "@features/atlas/overlays";
import { useIsMobile } from "@hooks/useIsMobile";
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

  // Detect mobile
  const isMobile = useIsMobile();

  // Auto-hide toolbar on mobile after a delay
  const [menuOpen, setMenuOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        {/* Floating FAB */}
        <button
          className="fixed bottom-20 right-4 z-50 bg-action rounded-full p-4 shadow"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close map actions" : "Open map actions"}
        >
          <FaChevronUp
            className={`text-2xl transition-transform ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {/* Popover/modal menu */}
        {menuOpen && (
          <div
            className="fixed right-4 z-[10020] mb-2"
            style={{ bottom: "135px" }}
          >
            <div
              className="bg-action rounded-2xl p-4 w-52 shadow-xl flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <MenuButton
                onClick={() => {
                  setMenuOpen(false);
                  toggleCountries();
                }}
                icon={<FaGlobe />}
                ariaLabel="Countries"
                title="Countries"
              >
                Countries
              </MenuButton>
              <MenuButton
                onClick={() => {
                  setMenuOpen(false);
                  toggleMarkers();
                }}
                icon={<FaMapPin />}
                ariaLabel="Markers"
                title="Markers"
              >
                Markers
              </MenuButton>
              <MenuButton
                onClick={() => {
                  setMenuOpen(false);
                  toggleOverlays();
                }}
                icon={<FaLayerGroup />}
                ariaLabel="Overlays"
                title="Overlays"
              >
                Overlays
              </MenuButton>
              <MenuButton
                onClick={() => {
                  setMenuOpen(false);
                  toggleLegend();
                }}
                icon={<FaMap />}
                ariaLabel="Legend"
                title="Legend"
              >
                Legend
              </MenuButton>
              {visitedOverlay && isTimelineOverlay(visitedOverlay) && (
                <MenuButton
                  onClick={() => {
                    setMenuOpen(false);
                    setTimelineMode((prev) => !prev);
                  }}
                  icon={<FaTimeline />}
                  ariaLabel="Timeline"
                  title="Timeline"
                >
                  Timeline
                </MenuButton>
              )}
              <MenuButton
                onClick={() => {
                  setMenuOpen(false);
                  toggleExport();
                }}
                icon={<FaDownload />}
                ariaLabel="Export"
                title="Export"
              >
                Export
              </MenuButton>
              <MenuButton
                onClick={() => {
                  setMenuOpen(false);
                  toggleSettings();
                }}
                icon={<FaGear />}
                ariaLabel="Settings"
                title="Settings"
              >
                Settings
              </MenuButton>
            </div>
          </div>
        )}
      </>
    );
  }

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
      <div
        className="relative flex items-center w-full justify-end"
        style={{ height: "40px" }}
      >
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
        {/* Actions: horizontal slide */}
        <ActionsToolbar
          className={`right-10 md:right-14 bg-action rounded-full px-2 transition-all duration-300 ${
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
      </div>
    </div>
  );
}
