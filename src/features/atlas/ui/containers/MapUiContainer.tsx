import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { useUI } from "@app/contexts/UIContext";
import { useSharedMapInfo } from "@features/atlas/export";
import { useEffectiveLayers } from "@features/atlas/layers";
import {
  MapLegendModal,
  useMapLegendItems,
  type LegendItem,
} from "@features/atlas/legend";
import { useMapView } from "@features/atlas/map";
import { useSavedMaps } from "@features/atlas/savedMaps";
import { useMapInterfaceSettings } from "@features/atlas/settings";
import {
  TimelineBar,
  TimelineNavigator,
  useTimeline,
} from "@features/atlas/timeline";
import { useScreenSize, useUiHint } from "@hooks";
import { MapFooter } from "../footer/MapFooter";
import { MapToolbar } from "../toolbar/MapToolbar";

interface MapUiContainerProps {
  isAddingMarker?: boolean;
  isEmbed?: boolean;
}

export function MapUiContainer({
  isAddingMarker,
  isEmbed,
}: MapUiContainerProps) {
  const effectiveLayers = useEffectiveLayers();
  const { toolbarOrientation } = useMapInterfaceSettings();
  const { isReadonly, isEdit, colorMode, isAtlasActive, zoom, setZoom } =
    useMapView();
  const { isLaptop } = useScreenSize();
  const { timelineMode } = useTimeline();
  const { uiVisible, openUserPanel, showLegend, closeLegend } = useUI();
  const { t } = useTranslation("atlas");

  const legendItems: LegendItem[] = useMapLegendItems(
    effectiveLayers,
    timelineMode,
    colorMode,
  );

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
        <ICONS.savedMaps className="text-lg" />
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

  const effectiveToolbarOrientation =
    isLaptop && timelineMode ? "vertical" : toolbarOrientation;

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
          <MapToolbar
            orientation={effectiveToolbarOrientation}
            zoom={zoom}
            setZoom={setZoom}
            isEmbed={isEmbed}
          />
          {!isEmbed && (
            <>
              <MapFooter zoom={zoom} />
              {!isAtlasActive && (
                <MapLegendModal
                  open={showLegend}
                  onClose={closeLegend}
                  items={legendItems}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
