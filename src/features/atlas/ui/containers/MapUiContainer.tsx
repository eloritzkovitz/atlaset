import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { useMapView } from "@contexts/MapViewContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useUI } from "@contexts/UIContext";
import { useSharedMapInfo } from "@features/atlas/export";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useEffectiveLayers } from "@features/atlas/layers/hooks/useEffectiveLayers";
import {
  MapLegendModal,
  useMapLegendItems,
  type LegendItem,
} from "@features/atlas/legend";
import { TimelineBar, TimelineNavigator } from "@features/atlas/timeline";
import { useUiHint } from "@hooks";
import { MapToolbar } from "../components/controls/MapToolbar";
import { MapFooter } from "../components/footer/MapFooter";
import { MapOverlayToggle } from "../components/controls/MapOverlayToggle";

interface MapUiContainerProps {
  isAddingMarker?: boolean;
  isEmbed?: boolean;
}

export function MapUiContainer({
  isAddingMarker,
  isEmbed,
}: MapUiContainerProps) {
  const effectiveLayers = useEffectiveLayers();
  const {
    isReadonly,
    isEdit,
    colorMode,
    zoom,
    setZoom,
    center,
    selectedCoords,
  } = useMapView();
  const { timelineMode } = useTimeline();
  const { uiVisible, openUserPanel, showLegend, closeLegend } = useUI();
  const legendItems: LegendItem[] = useMapLegendItems(
    effectiveLayers,
    timelineMode,
    colorMode,
  );

  const { t } = useTranslation("atlas");

  // UI hint for adding marker
  const addMarkerHint = useMemo(
    () =>
      isAddingMarker && !isEmbed
        ? {
            message: <>{t("markers.hint")}</>,
            icon: <ICONS.markers className="text-lg" />,
          }
        : null,
    [isAddingMarker, isEmbed, t],
  );

  // UI hint for timeline mode
  const timelineHint = useMemo(
    () =>
      timelineMode && uiVisible && !isEmbed
        ? {
            message: <>{t("timeline.hint")}</>,
            icon: <ICONS.timeline className="text-lg" />,
          }
        : null,
    [timelineMode, uiVisible, isEmbed, t],
  );

  // UI hint for shared/saved maps
  const sharedMapInfo = useSharedMapInfo() || {};
  const { activeSavedMap } = useSavedMaps();
  const mapName = activeSavedMap?.name || sharedMapInfo.mapName;
  const sharer = sharedMapInfo.sharer;
  const sharedHint = useMemo(() => {
    if ((!isReadonly && !isEdit) || isEmbed) return null;
    const displayMapName = mapName ? mapName : t("shared.defaultMap");
    const displaySharer = sharer ? sharer : t("shared.defaultSharer");
    const msg = (
      <>
        <>
          {t("shared.viewingPrefix")}{" "}
          <strong className="font-bold">{displayMapName}</strong>
        </>

        {isReadonly && !isEdit && (
          <span>
            {" "}
            {t("shared.byPrefix")}{" "}
            <strong className="font-bold">{displaySharer}</strong>.
          </span>
        )}

        <span>
          {" "}
          {isEdit ? t("shared.inEditMode") : t("shared.editingDisabled")}
        </span>
      </>
    );

    return {
      message: msg,
      icon: isEdit ? (
        <ICONS.map className="text-lg" />
      ) : (
        <ICONS.share className="text-lg" />
      ),
    };
  }, [isReadonly, isEdit, isEmbed, mapName, sharer, t]);

  useUiHint(addMarkerHint, 0, { key: "add-marker", dismissable: false });
  useUiHint(timelineHint, 0, { key: "timeline", dismissable: true });
  useUiHint(sharedHint, 0, { key: "shared-map", dismissable: true });

  // Don't render UI if not visible
  if (!uiVisible) return null;

  return (
    <>
      {timelineMode && !isEmbed && !isEdit && (
        <>
          <TimelineBar />
          <TimelineNavigator />
        </>
      )}
      {!openUserPanel && (
        <>
          <MapToolbar zoom={zoom} setZoom={setZoom} isEmbed={isEmbed} />
          <MapOverlayToggle />
          {!isEmbed && (
            <>            
              <MapFooter
                zoom={zoom}
                coords={selectedCoords}
                latitude={center[1]}
              />
              <MapLegendModal
                open={showLegend}
                onClose={closeLegend}
                items={legendItems}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
