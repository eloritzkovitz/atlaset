import { FaMapPin, FaPlus, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel } from "@components";
import { DEFAULT_PANEL_WIDTH } from "@constants";
import { useMarkers } from "@contexts/MarkersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useEffectiveMarkers } from "@features/atlas/markers/hooks/useEffectiveMarkers";
import { useUI } from "@contexts/UIContext";
import { useDragReorder } from "@hooks";
import { MarkersPanelItem } from "./MarkersPanelItem";
import type { Marker } from "../../types";

interface MarkersPanelProps {
  onAddMarker: () => void;
  onEditMarker: (marker: Marker) => void;
  onMarkerDetails?: (marker: Marker) => void;
  activeSavedMapMarkers?: Marker[];
  handleSavedMapChange?: {
    removeMarker: (id: string) => void;
    toggleMarkerVisibility: (id: string) => void;
    reorderMarkers: (markers: Marker[]) => void;
  };
}

export function MarkersPanel({
  onAddMarker,
  onEditMarker,
  onMarkerDetails,
  activeSavedMapMarkers,
  handleSavedMapChange,
}: MarkersPanelProps) {
  const { setCenter, setZoom } = useMapView();
  const { removeMarker, toggleMarkerVisibility, reorderMarkers } = useMarkers();
  const { showMarkers, closePanel } = useUI();
  const effectiveMarkersFromContext = useEffectiveMarkers();
  const effectiveMarkers =
    activeSavedMapMarkers ?? effectiveMarkersFromContext;
  const isEditingSavedMap = !!activeSavedMapMarkers && !!handleSavedMapChange;

  const { isReadonly } = useMapView();

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
              <ActionButton
                onClick={onAddMarker}
                ariaLabel="Add Marker"
                title="Add Marker"
                icon={<FaPlus />}
                rounded
              />
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
          <div className="text-muted text-sm">No markers yet.</div>
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
                  onEdit={!isReadonly ? () => onEditMarker(marker) : undefined}
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
