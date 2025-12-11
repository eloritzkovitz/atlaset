import { FaMapPin, FaPlus, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel } from "@components";
import { DEFAULT_PANEL_WIDTH } from "@constants";
import { useMarkers } from "@contexts/MarkersContext";
import { useUI } from "@contexts/UIContext";
import { useDragReorder } from "@hooks/useDragReorder";
import type { Marker } from "@types";
import { MarkersPanelItem } from "./MarkersPanelItem";

interface MarkersPanelProps {
  onAddMarker: () => void;
  onEditMarker: (marker: Marker) => void;
  onCenterMap: (marker: Marker) => void;
}

export function MarkersPanel({
  onAddMarker,
  onEditMarker,
  onCenterMap,
}: MarkersPanelProps) {
  const { markers, removeMarker, toggleMarkerVisibility, reorderMarkers } =
    useMarkers();
  const { showMarkers, closePanel } = useUI();
  const { draggedIndex, handleDragStart, handleDragOver, handleDragEnd } =
    useDragReorder(markers, reorderMarkers);

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
            <ActionButton
              onClick={onAddMarker}
              ariaLabel="Add Marker"
              title="Add Marker"
              icon={<FaPlus />}
              rounded
            />
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
        <div className="p-4">
          {markers.length === 0 ? (
            <div className="text-sm text-gray-500">No markers yet.</div>
          ) : (
            <ul className="space-y-2">
              {markers.map((marker, idx) => (
                <MarkersPanelItem
                  key={marker.id}
                  marker={marker}
                  idx={idx}
                  onToggleVisibility={() => toggleMarkerVisibility(marker.id)}
                  onEdit={() => onEditMarker(marker)}
                  onCenter={() => onCenterMap(marker)}
                  onRemove={() => removeMarker(marker.id)}
                  draggedIndex={draggedIndex}
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  handleDragEnd={handleDragEnd}
                />
              ))}
            </ul>
          )}
        </div>
      </Panel>
    </>
  );
}
