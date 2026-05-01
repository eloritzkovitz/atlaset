import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { DirectionalIcon } from "@components";
import { useMapView } from "@contexts/MapViewContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useUI } from "@contexts/UIContext";
import { isAuthenticated } from "@utils/firebase";

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
  const { t } = useTranslation("atlas");
  const {
    toggleCountries,
    toggleLayers,
    toggleMarkers,
    toggleLegend,
    toggleSavedMaps,
    toggleExport,
    toggleSettings,
  } = useUI();
  const { timelineMode, setTimelineMode } = useTimeline();
  const { isReadonly, isEdit } = useMapView();
  const { exitEditMode } = useSavedMaps();

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
      icon: <ICONS.countries className="text-lg" />,
      label: t("toolbar.countries"),
      onClick: withMenuClose(toggleCountries),
      show: true,
    },
    {
      key: "layers",
      icon: <ICONS.layers className="text-lg" />,
      label: t("toolbar.layers"),
      onClick: withMenuClose(toggleLayers),
      show: true,
    },
    {
      key: "markers",
      icon: <ICONS.markers className="text-lg" />,
      label: t("toolbar.markers"),
      onClick: withMenuClose(toggleMarkers),
      show: true,
    },
    {
      key: "legend",
      icon: <ICONS.legend className="text-lg" />,
      label: t("toolbar.legend"),
      onClick: withMenuClose(toggleLegend),
      show: true,
      separatorAfter: true,
    },
    {
      key: "savedmaps",
      icon: <ICONS.saved className="text-lg" />,
      label: t("toolbar.myMaps"),
      onClick: withMenuClose(toggleSavedMaps),
      show: isAuthenticated(),
    },
    {
      key: "timeline",
      icon: <ICONS.timeline className="text-xl" />,
      label: t("toolbar.timeline"),
      onClick: withMenuClose(() => setTimelineMode(!timelineMode)),
      show: !isReadonly && !isEdit && isAuthenticated(),
      separatorAfter: true,
    },
    {
      key: "export",
      icon: !isReadonly ? (
        <ICONS.export className="text-lg" />
      ) : (
        <ICONS.download className="text-lg" />
      ),
      label: !isReadonly ? t("toolbar.export") : t("toolbar.download"),
      onClick: withMenuClose(toggleExport),
      show: true,
    },
    {
      key: "settings",
      icon: <ICONS.settings className="text-lg" />,
      label: t("toolbar.mapSettings"),
      onClick: withMenuClose(toggleSettings),
      show: !isReadonly && !isEdit,
    },
    {
      key: "exit",
      icon: <DirectionalIcon variant="arrow" className="text-lg" />,
      label: isEdit ? t("toolbar.exitEditMode") : t("toolbar.exitSharedView"),
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
