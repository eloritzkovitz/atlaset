import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, EmptyListMessage, Panel } from "@components";
import { ICONS } from "@constants/icons";
import { DEFAULT_PANEL_WIDTH } from "@constants/ui";
import { useUI } from "@app/contexts/UIContext";
import { useGetGeoDataQuery } from "@features/atlas/map/api/mapApi";
import { useMapView } from "@features/atlas/map/context/MapViewContext";
import { getCountryCenterAndZoom } from "@features/atlas/map/utils/projection";
import { useAccessibility } from "@features/settings";
import { useDragReorder } from "@hooks";
import { MarkersPanelItem } from "./MarkersPanelItem";
import { useEffectiveMarkers } from "../../hooks/useEffectiveMarkers";
import { useMarkers } from "../../context/MarkersContext";
import type { Marker } from "../../types";
import {
  exportMarkersToFile,
  importMarkersFromFile,
} from "../../utils/markerIO";

interface MarkersPanelProps {
  onAddMarker: () => void;
  onEditMarker: (marker: Marker) => void;
  onMarkerDetails?: (marker: Marker) => void;
  activeSavedMapMarkers?: Marker[];
  handleSavedMapChange?: {
    updateMarkerName: (id: string, newName: string) => void;
    toggleMarkerVisibility: (id: string) => void;
    reorderMarkers: (markers: Marker[]) => void;
    removeMarker: (id: string) => void;
  };
}

export function MarkersPanel({
  onAddMarker,
  onEditMarker,
  onMarkerDetails,
  activeSavedMapMarkers,
  handleSavedMapChange,
}: MarkersPanelProps) {
  const { animationsEnabled } = useAccessibility();
  const { data: geoData } = useGetGeoDataQuery();
  const { setCenter, setZoom, isReadonly } = useMapView();
  const globalMarkerActions = useMarkers();
  const { showMarkers, closePanel } = useUI();
  const effectiveMarkersFromContext = useEffectiveMarkers();
  const effectiveMarkers = activeSavedMapMarkers ?? effectiveMarkersFromContext;
  const isEditingSavedMap = !!activeSavedMapMarkers && !!handleSavedMapChange;

  // Resolve actions object (Saved Map vs Global Context)
  const actions = isEditingSavedMap
    ? handleSavedMapChange!
    : globalMarkerActions;

  // Drag state
  const dragMarkers = isEditingSavedMap
    ? activeSavedMapMarkers!
    : effectiveMarkers;
  const dragReorder = isEditingSavedMap
    ? handleSavedMapChange?.reorderMarkers
    : globalMarkerActions.reorderMarkers;
  const { draggedIndex, handleDragStart, handleDragOver, handleDragEnd } =
    useDragReorder(dragMarkers, dragReorder);

  // Center map on a marker
  const handleCenterOnMarker = (marker: Marker, zoomLevel: number = 2) => {
    if (geoData && marker.isoCode) {
      const countryData = getCountryCenterAndZoom(geoData, marker.isoCode);
      if (countryData?.center) {
        setCenter(countryData.center);
        setZoom(zoomLevel);
      }
    }

    if (onMarkerDetails) {
      onMarkerDetails(marker);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation("atlas");

  return (
    <>
      <Panel
        title={
          <>
            <ICONS.markers />
            {t("markers.title")}
          </>
        }
        show={showMarkers}
        width={DEFAULT_PANEL_WIDTH}
        onHide={closePanel}
        headerActions={
          <>
            {!isReadonly && (
              <>
                <ActionButton
                  onClick={onAddMarker}
                  ariaLabel={t("markers.add")}
                  title={t("markers.add")}
                  icon={<ICONS.add />}
                  rounded
                />
                <ActionButton
                  onClick={() => fileInputRef.current?.click()}
                  ariaLabel={t("markers.import")}
                  title={t("markers.import")}
                  icon={<ICONS.importFile />}
                  rounded
                />
                <input
                  id="import-markers-file"
                  name="import-markers-file"
                  type="file"
                  accept="application/json"
                  ref={fileInputRef}
                  onChange={(e) =>
                    importMarkersFromFile(
                      e,
                      effectiveMarkers,
                      actions.reorderMarkers,
                    )
                  }
                  style={{ display: "none" }}
                />
                <ActionButton
                  onClick={() => exportMarkersToFile(effectiveMarkers)}
                  ariaLabel={t("markers.export")}
                  title={t("markers.export")}
                  icon={<ICONS.exportFile />}
                  rounded
                />
              </>
            )}
          </>
        }
        animationsEnabled={animationsEnabled}
      >
        {effectiveMarkers.length === 0 ? (
          <EmptyListMessage message={t("markers.empty")} />
        ) : (
          <div className="mt-4">
            <ul className="space-y-2">
              {effectiveMarkers.map((marker, idx) => (
                <MarkersPanelItem
                  key={marker.id}
                  marker={marker}
                  idx={idx}
                  onCenter={() => handleCenterOnMarker(marker)}
                  onToggleVisibility={
                    !isReadonly
                      ? () => actions.toggleMarkerVisibility(marker.id)
                      : undefined
                  }
                  onDownload={
                    !isReadonly ? () => exportMarkersToFile(marker) : undefined
                  }
                  onEdit={!isReadonly ? () => onEditMarker(marker) : undefined}
                  onNameChange={
                    !isReadonly
                      ? (newName: string) =>
                          actions.updateMarkerName(marker.id, newName)
                      : undefined
                  }
                  onRemove={
                    !isReadonly
                      ? () => actions.removeMarker(marker.id)
                      : undefined
                  }
                  draggedIndex={!isReadonly ? draggedIndex : undefined}
                  handleDragStart={
                    !isReadonly ? () => handleDragStart(idx) : undefined
                  }
                  handleDragOver={
                    !isReadonly ? (e) => handleDragOver(e, idx) : undefined
                  }
                  handleDragEnd={!isReadonly ? handleDragEnd : undefined}
                />
              ))}
            </ul>
          </div>
        )}
      </Panel>
    </>
  );
}
