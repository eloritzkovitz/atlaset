import { useEffect, useState } from "react";
import type { Coordinates } from "@features/atlas/map";
import type { Marker } from "@features/atlas/markers/types";

export interface UseMarkerManagerOptions {
  initialMarkers: Marker[];
  persistMarkers: (markers: Marker[]) => Promise<void>;
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

  // Add marker
  async function addMarker(marker: Marker) {
    const updated = [...markers, marker];
    setMarkers(updated);
    await persistMarkers(updated);
  }

  // Edit marker
  async function editMarker(marker: Marker) {
    const updated = markers.map((m) => (m.id === marker.id ? marker : m));
    setMarkers(updated);
    await persistMarkers(updated);
  }

  // Rename marker
  async function updateMarkerName(id: string, newName: string) {
    const updated = markers.map((m) =>
      m.id === id ? { ...m, name: newName } : m,
    );
    setMarkers(updated);
    await persistMarkers(updated);
  }  

  // Toggle marker visibility
  async function toggleMarkerVisibility(id: string) {
    const updated = markers.map((m) =>
      m.id === id ? { ...m, visible: !m.visible } : m,
    );
    setMarkers(updated);
    await persistMarkers(updated);
  }

  // Reorder markers
  async function reorderMarkers(newOrder: Marker[]) {
    setMarkers(newOrder);
    await persistMarkers(newOrder);
  }

  // Remove marker
  async function removeMarker(id: string) {
    const updated = markers.filter((m) => m.id !== id);
    setMarkers(updated);
    await persistMarkers(updated);
  }

  // Open add marker modal
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

  // Open edit marker modal
  function openEditMarker(marker: Marker) {
    setEditingMarker({ ...marker });
    setMarkerModalOpen(true);
  }

  // Save marker (add or edit)
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

  // Close marker modal
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
    removeMarker,
    openAddMarker,
    openEditMarker,
    saveMarker,
    closeMarkerModal,
    // Marker creation state/handlers
    isAddingMarker,
    startAddingMarker,
    handleMapClickForMarker,
    cancelMarkerCreation,
  };
}
