import { useRef } from "react";
import {
  FaFileImport,
  FaFileExport,
  FaMapPin,
  FaPlus,
  FaXmark,
} from "react-icons/fa6";
import { ActionButton, EmptyListMessage, Panel } from "@components";
import { DEFAULT_PANEL_WIDTH } from "@constants";
import { useMapView } from "@contexts/MapViewContext";
import { useMarkers } from "@contexts/MarkersContext";
import { useUI } from "@contexts/UIContext";
import { useEffectiveMarkers } from "@features/atlas/markers";
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
  const { setCenter, setZoom, isReadonly } = useMapView();
  const {
    removeMarker,
    toggleMarkerVisibility,
    reorderMarkers,
    updateMarkerName,
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

  return (
    <>
      <Panel
        title={
          <>
            <FaMapPin />
            Markers
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
                  ariaLabel="Add Marker"
                  title="Add Marker"
                  icon={<FaPlus />}
                  rounded
                />
                <ActionButton
                  onClick={() => fileInputRef.current?.click()}
                  ariaLabel="Import Markers"
                  title="Import Markers"
                  icon={<FaFileImport />}
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
                  ariaLabel="Export Markers"
                  title="Export Markers"
                  icon={<FaFileExport />}
                  rounded
                />
              </>
            )}
            <ActionButton
              onClick={closePanel}
              ariaLabel="Close markers panel"
              title="Close"
              icon={<FaXmark className="text-2xl" />}
              rounded
            />
          </>
        }
      >
        {effectiveMarkers.length === 0 ? (
          <EmptyListMessage message="No markers yet." />
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
