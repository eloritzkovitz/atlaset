import { useState } from "react";
import type { Coordinates } from "@features/atlas/map/types";
import { useEntityCollection } from "@hooks";
import type { Marker } from "../types";

export interface UseMarkerManagerOptions {
  initialMarkers: Marker[];
  persistMarkers: (markers: Marker[]) => Promise<void>;
  onLogAction?: (
    action: "add" | "edit" | "remove" | "reorder",
    marker: Marker,
  ) => Promise<void>;
}

/**
 * Manages marker state and operations.
 * @param initialMarkers - Initial markers to manage.
 * @param persistMarkers - Function to persist marker changes.
 * @returns Marker management utilities and state.
 */
export function useMarkerManager({
  initialMarkers,
  persistMarkers,
  onLogAction,
}: UseMarkerManagerOptions) {
  const collection = useEntityCollection<Marker>({
    initialItems: initialMarkers,
    persistItems: persistMarkers,
    onLogAction,
  });

  const [editingMarker, setEditingMarker] = useState<Marker | null>(null);
  const [isMarkerModalOpen, setMarkerModalOpen] = useState(false);
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  /** Determines if a marker is currently being edited. */
  const isEditingMarker =
    !!editingMarker && collection.items.some((m) => m.id === editingMarker.id);

  /** Initiates the process of adding a new marker. */
  function startAddingMarker() {
    setIsAddingMarker(true);
  }

  /** Cancels the creation of a new marker. */
  function cancelMarkerCreation() {
    setIsAddingMarker(false);
  }

  /** Handles map click events for adding a new marker. */
  function handleMapClickForMarker(coords: Coordinates) {
    if (!isAddingMarker) return;
    openAddMarker(coords);
    setIsAddingMarker(false);
  }

  /** Opens the modal for adding a new marker. */
  function openAddMarker(coords?: Coordinates) {
    setEditingMarker({
      id: crypto.randomUUID(),
      name: "",
      color: "#e53e3e",
      description: "",
      coordinates: coords || [0, 0],
      visible: true,
    });
    setMarkerModalOpen(true);
  }

  /** Opens the modal for editing an existing marker. */
  function openEditMarker(marker: Marker) {
    setEditingMarker({ ...marker });
    setMarkerModalOpen(true);
  }

  /** Closes the marker modal. */
  function closeMarkerModal() {
    setMarkerModalOpen(false);
    setEditingMarker(null);
  }

  /** Saves the current marker from the modal. */
  async function saveMarker() {
    if (!editingMarker) return;
    const exists = collection.items.some((m) => m.id === editingMarker.id);
    if (exists) {
      await collection.updateItem(editingMarker);
    } else {
      await collection.addItem(editingMarker);
    }
    closeMarkerModal();
  }

  return {
    markers: collection.items,
    setMarkers: collection.setItems,
    addMarker: collection.addItem,
    editMarker: collection.updateItem,
    removeMarker: collection.removeItem,
    reorderMarkers: collection.reorderItems,
    updateMarkerName: collection.updateItemName,
    toggleMarkerVisibility: collection.toggleItemVisibility,
    editingMarker,
    setEditingMarker,
    isEditingMarker,
    isMarkerModalOpen,
    openAddMarker,
    openEditMarker,
    closeMarkerModal,
    saveMarker,
    isAddingMarker,
    startAddingMarker,
    handleMapClickForMarker,
    cancelMarkerCreation,
  };
}
