import {
  FaGlobe,
  FaMapPin,
  FaLayerGroup,
  FaGear,
  FaTimeline,
  FaListUl,
  FaShareFromSquare,
  FaArrowLeft,
  FaDownload,
  FaBookmark,
} from "react-icons/fa6";
import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useUI } from "@contexts/UIContext";
import { isTimelineLayer, VISITED_LAYER_ID } from "@features/atlas/layers";
import { isAuthenticated } from "@utils/firebase";
import { useSavedMaps } from "@contexts/SavedMapsContext";

export interface ToolbarActionsParams {
  isMobile: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Gets toolbar actions for the map toolbar.
 * @param params Toolbar actions parameters.
 * @returns Toolbar actions array
 */
export function useToolbarActions({
  isMobile,
  setMenuOpen,
}: ToolbarActionsParams) {
  const {
    toggleCountries,
    toggleLayers,
    toggleMarkers,
    toggleLegend,
    toggleExport,
    toggleSettings,
  } = useUI();
  const { setTimelineMode } = useTimeline();
  const { isReadonly, isEdit } = useMapView();
  const { layers } = useLayers();
  const { saveCurrentMap, exitEditMode } = useSavedMaps();
  const visitedLayer = layers.find((o) => o.id === VISITED_LAYER_ID);

  // Centralized menu close helper
  function withMenuClose(action: () => void) {
    return () => {
      if (isMobile) setMenuOpen(false);
      action();
    };
  }

  return [
    {
      key: "countries",
      icon: <FaGlobe className="text-lg" />,
      label: "Countries",
      onClick: withMenuClose(toggleCountries),
      show: true,
    },
    {
      key: "layers",
      icon: <FaLayerGroup className="text-lg" />,
      label: "Layers",
      onClick: withMenuClose(toggleLayers),
      show: true,
    },
    {
      key: "markers",
      icon: <FaMapPin className="text-lg" />,
      label: "Markers",
      onClick: withMenuClose(toggleMarkers),
      show: true,
    },
    {
      key: "legend",
      icon: <FaListUl className="text-lg" />,
      label: "Legend",
      onClick: withMenuClose(toggleLegend),
      show: true,
      separatorAfter: true,
    },
    {
      key: "timeline",
      icon: <FaTimeline className="text-xl" />,
      label: "Timeline",
      onClick: withMenuClose(() => setTimelineMode((prev) => !prev)),
      show:
        !isReadonly &&
        !isEdit &&
        isAuthenticated() &&
        !!(visitedLayer && isTimelineLayer(visitedLayer)),
      separatorAfter: true,
    },
    {
      key: "save",
      icon: <FaBookmark className="text-lg" />,
      label: "Save",
      onClick: withMenuClose(saveCurrentMap),
      show: isReadonly && isAuthenticated(),
    },
    {
      key: "export",
      icon: !isReadonly ? (
        <FaShareFromSquare className="text-lg" />
      ) : (
        <FaDownload className="text-lg" />
      ),
      label: !isReadonly ? "Export" : "Download",
      onClick: withMenuClose(toggleExport),
      show: true,
    },
    {
      key: "settings",
      icon: <FaGear className="text-lg" />,
      label: "Map Settings",
      onClick: withMenuClose(toggleSettings),
      show: !isReadonly && !isEdit,
    },
    {
      key: "exit",
      icon: <FaArrowLeft className="text-lg" />,
      label: `${isEdit ? "Exit Edit Mode" : "Exit Shared View"}`,
      onClick: withMenuClose(() => {
        if (typeof exitEditMode === "function") {
          exitEditMode();
        } else if (window.location.pathname === "/atlas") {
          const url = new URL(window.location.href);
          url.searchParams.delete("map");
          window.location.href = url.pathname + url.search;
        } else {
          window.location.href = "/atlas";
        }
      }),
      show: isReadonly || isEdit,
    },
  ];
}
