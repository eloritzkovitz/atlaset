import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, EmptyListMessage, Panel } from "@components";
import { ICONS } from "@constants/icons";
import { DEFAULT_PANEL_WIDTH } from "@constants/ui";
import { useMapView } from "@contexts/MapViewContext";
import { useMarkers } from "@contexts/MarkersContext";
import { useUI } from "@contexts/UIContext";
import { useEffectiveMarkers } from "@features/atlas/markers";
import { useAccessibility } from "@features/settings";
import { useDragReorder } from "@hooks";
import { MarkersPanelItem } from "./MarkersPanelItem";
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
    duplicateMarker: (id: string) => void;
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
  const { setCenter, setZoom, isReadonly } = useMapView();
  const {
    updateMarkerName,
    toggleMarkerVisibility,
    duplicateMarker,
    reorderMarkers,
    removeMarker,
  } = useMarkers();
  const { showMarkers, closePanel } = useUI();
  const effectiveMarkersFromContext = useEffectiveMarkers();
  const effectiveMarkers = activeSavedMapMarkers ?? effectiveMarkersFromContext;
  const isEditingSavedMap = !!activeSavedMapMarkers && !!handleSavedMapChange;

  // Drag state
  const dragMarkers = isEditingSavedMap
    ? activeSavedMapMarkers!
    : effectiveMarkers;
  const dragReorder = isEditingSavedMap
    ? handleSavedMapChange?.reorderMarkers
    : reorderMarkers;
  const { draggedIndex, handleDragStart, handleDragOver, handleDragEnd } =
    useDragReorder(dragMarkers, dragReorder);

  // Center map on a marker
  const centerOnMarker = (marker: Marker, zoomLevel: number = 20) => {
    setCenter([marker.coordinates[0], marker.coordinates[1]]);
    setZoom(zoomLevel);
    // If a marker is provided, show its details
    if (onMarkerDetails && "id" in marker) {
      onMarkerDetails(marker);
    }
  };

  // Center map on a marker by its ID
  const centerOnMarkerById = (markerId: string, zoomLevel: number = 20) => {
    const marker = effectiveMarkers.find((m) => m.id === markerId);
    if (marker) {
      centerOnMarker(marker, zoomLevel);
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
                  type="file"
                  accept="application/json"
                  ref={fileInputRef}
                  onChange={(e) =>
                    importMarkersFromFile(
                      e,
                      isEditingSavedMap && handleSavedMapChange
                        ? handleSavedMapChange.reorderMarkers
                        : reorderMarkers,
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
                  onCenter={() => centerOnMarkerById(marker.id)}
                  onToggleVisibility={
                    !isReadonly
                      ? isEditingSavedMap
                        ? () =>
                            handleSavedMapChange?.toggleMarkerVisibility(
                              marker.id,
                            )
                        : () => toggleMarkerVisibility(marker.id)
                      : undefined
                  }
                  onDownload={
                    !isReadonly
                      ? () => {
                          exportMarkersToFile(marker);
                        }
                      : undefined
                  }
                  onEdit={!isReadonly ? () => onEditMarker(marker) : undefined}
                  onNameChange={
                    !isReadonly
                      ? isEditingSavedMap
                        ? (newName: string) =>
                            handleSavedMapChange?.updateMarkerName(
                              marker.id,
                              newName,
                            )
                        : (newName: string) =>
                            updateMarkerName(marker.id, newName)
                      : undefined
                  }
                  onDuplicate={
                    !isReadonly
                      ? isEditingSavedMap
                        ? () => handleSavedMapChange?.duplicateMarker(marker.id)
                        : () => duplicateMarker(marker.id)
                      : undefined
                  }
                  onRemove={
                    !isReadonly
                      ? isEditingSavedMap
                        ? () => handleSavedMapChange?.removeMarker(marker.id)
                        : () => removeMarker(marker.id)
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
