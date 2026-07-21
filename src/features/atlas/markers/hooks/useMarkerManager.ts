import { useEffect, useState } from "react";
import type { Coordinates } from "@features/atlas/map";
import type { Marker } from "@features/atlas/markers/types";

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
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers);
  const [editingMarker, setEditingMarker] = useState<Marker | null>(null);
  const [isMarkerModalOpen, setMarkerModalOpen] = useState(false);
  const isEditingMarker =
    !!editingMarker && markers.some((m) => m.id === editingMarker.id);

  // Marker creation state/handlers
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  // Start adding marker
  function startAddingMarker() {
    setIsAddingMarker(true);
  }

  // Cancel marker creation
  function cancelMarkerCreation() {
    setIsAddingMarker(false);
  }

  // Handle map click for marker creation
  function handleMapClickForMarker(coords: Coordinates) {
    if (!isAddingMarker) return;
    openAddMarker(coords);
    setIsAddingMarker(false);
  }

  // Sync markers state with initialMarkers prop only on first load
  useEffect(() => {
    if (markers.length === 0 && initialMarkers.length > 0) {
      setMarkers(initialMarkers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMarkers]);

  /** Adds a new marker. */
  async function addMarker(marker: Marker) {
    if (onLogAction) await onLogAction("add", marker);
    const updated = [...markers, marker];
    setMarkers(updated);
    await persistMarkers(updated);
  }

  /** Edits an existing marker. */
  async function editMarker(marker: Marker) {
    if (onLogAction) await onLogAction("edit", marker);
    const updated = markers.map((m) => (m.id === marker.id ? marker : m));
    setMarkers(updated);
    await persistMarkers(updated);
  }

  /** Updates the name of an existing marker. */
  async function updateMarkerName(id: string, newName: string) {
    const updated = markers.map((m) =>
      m.id === id ? { ...m, name: newName } : m,
    );
    setMarkers(updated);
    await persistMarkers(updated);
  }

  /** Toggles the visibility of a marker. */
  async function toggleMarkerVisibility(id: string) {
    const updated = markers.map((m) =>
      m.id === id ? { ...m, visible: !m.visible } : m,
    );
    setMarkers(updated);
    await persistMarkers(updated);
  }

  /** Reorders markers. */
  async function reorderMarkers(newOrder: Marker[]) {
    if (onLogAction && newOrder.length > 0)
      await onLogAction("reorder", newOrder[0]);
    setMarkers(newOrder);
    await persistMarkers(newOrder);
  }

  /** Duplicates a marker. */
  async function duplicateMarker(id: string) {
    const marker = markers.find((m) => m.id === id);
    if (!marker) return;
    const newMarker = {
      ...marker,
      id: crypto.randomUUID(),
      name: marker.name + " (Copy)",
    };
    await addMarker(newMarker);
  }

  /** Removes a marker. */
  async function removeMarker(id: string) {
    const marker = markers.find((m) => m.id === id);
    if (marker && onLogAction) await onLogAction("remove", marker);
    const updated = markers.filter((m) => m.id !== id);
    setMarkers(updated);
    await persistMarkers(updated);
  }

  /** Opens the marker modal in add mode. **/
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

  /** Opens the marker modal in edit mode. */
  function openEditMarker(marker: Marker) {
    setEditingMarker({ ...marker });
    setMarkerModalOpen(true);
  }

  /** Saves the current marker (add or edit). */
  async function saveMarker() {
    if (!editingMarker) return;
    const exists = markers.some((m) => m.id === editingMarker.id);
    if (exists) {
      await editMarker(editingMarker);
    } else {
      await addMarker(editingMarker);
    }
    closeMarkerModal();
  }

  /** Closes the marker modal. */
  function closeMarkerModal() {
    setMarkerModalOpen(false);
    setEditingMarker(null);
  }

  return {
    markers,
    setMarkers,
    editingMarker,
    setEditingMarker,
    isEditingMarker,
    isMarkerModalOpen,
    addMarker,
    editMarker,
    updateMarkerName,
    toggleMarkerVisibility,
    reorderMarkers,
    duplicateMarker,
    removeMarker,
    openAddMarker,
    openEditMarker,
    saveMarker,
    closeMarkerModal,
    isAddingMarker,
    startAddingMarker,
    handleMapClickForMarker,
    cancelMarkerCreation,
  };
}
