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
  FaChevronUp,
  FaRectangleList,
} from "react-icons/fa6";
import { ActionButton, ActionsToolbar } from "@components";
import { useOverlays } from "@contexts/OverlaysContext";
import { useUI } from "@contexts/UIContext";
import {
  isTimelineOverlay,
  VISITED_OVERLAY_ID,
} from "@features/atlas/overlays";
import { useIsMobile } from "@hooks";
import { MapToolbarActions } from "./MapToolbarActions";
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

  // Define actions
  const actions = [
    {
      key: "countries",
      icon: <FaGlobe />,
      label: "Countries",
      onClick: () => {
        if (isMobile) setMenuOpen(false);
        toggleCountries();
      },
      show: true,
    },
    {
      key: "markers",
      icon: <FaMapPin />,
      label: "Markers",
      onClick: () => {
        if (isMobile) setMenuOpen(false);
        toggleMarkers();
      },
      show: true,
    },
    {
      key: "overlays",
      icon: <FaLayerGroup />,
      label: "Overlays",
      onClick: () => {
        if (isMobile) setMenuOpen(false);
        toggleOverlays();
      },
      show: true,
      separatorAfter: true,
    },
    {
      key: "legend",
      icon: <FaRectangleList />,
      label: "Legend",
      onClick: () => {
        if (isMobile) setMenuOpen(false);
        toggleLegend();
      },
      show: true,
    },
    {
      key: "timeline",
      icon: <FaTimeline />,
      label: "Timeline",
      onClick: () => {
        if (isMobile) setMenuOpen(false);
        setTimelineMode((prev) => !prev);
      },
      show: !!(visitedOverlay && isTimelineOverlay(visitedOverlay)),
      separatorAfter: true,
    },
    {
      key: "export",
      icon: <FaDownload />,
      label: "Export",
      onClick: () => {
        if (isMobile) setMenuOpen(false);
        toggleExport();
      },
      show: true,
    },
    {
      key: "settings",
      icon: <FaGear />,
      label: "Settings",
      onClick: () => {
        if (isMobile) setMenuOpen(false);
        toggleSettings();
      },
      show: true,
    },
  ];

  // Mobile toolbar
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
              <MapToolbarActions actions={actions} isDesktop={false} />
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop toolbar
  return (
    <div
      className={`toolbar-container ${
        uiVisible ? "toolbar-container-visible" : "toolbar-container-hidden"
      }`}
    >
      {/* Zoom controls: vertical slide */}
      <ZoomControls zoom={zoom} setZoom={setZoom} visible={visible} />
      <div
        className="relative flex items-center w-full justify-end"
        style={{ height: "40px" }}
      >
        {/* Toggle button */}
        <ActionButton
          onClick={() => setVisible((v) => !v)}
          ariaLabel={visible ? "Hide toolbar" : "Show toolbar"}
          title={visible ? "Hide toolbar" : "Show toolbar"}
          titlePosition="left"
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
          <MapToolbarActions actions={actions} isDesktop={true}>
            {children}
          </MapToolbarActions>
        </ActionsToolbar>
      </div>
    </div>
  );
}
