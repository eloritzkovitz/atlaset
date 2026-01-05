import React, { useState, useEffect } from "react";
import { markersService } from "@features/atlas/markers";
import type { Marker } from "@features/atlas/markers/types";
import { useAuth } from "@features/user";
import { MarkersContext } from "./MarkersContext";

export const MarkersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [markers, setMarkers] = useState<Marker[]>([]);

  // Adding state
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  // Editing state
  const [editingMarker, setEditingMarker] = useState<Marker | null>(null);
  const [isMarkerModalOpen, setMarkerModalOpen] = useState(false);
  const isEditingMarker =
    !!editingMarker && markers.some((m) => m.id === editingMarker.id);

  // Selection state
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsModalPosition, setDetailsModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Fetch markers on mount
  const { user, ready } = useAuth();

  useEffect(() => {
    let mounted = true;
    if (!ready) return;
    if (user) {
      markersService.load().then((dbMarkers) => {
        if (mounted) setMarkers(dbMarkers);
      });
    }
    return () => {
      mounted = false;
    };
  }, [user, ready]);

  // Start adding a new marker
  function startAddingMarker() {
    setIsAddingMarker(true);
  }

  // Handle map click for adding marker
  const handleMapClickForMarker = (coords: [number, number]) => {
    if (!isAddingMarker) return;
    openAddMarker(coords);
    setIsAddingMarker(false);
  };

  // Cancel marker creation
  function cancelMarkerCreation() {
    setIsAddingMarker(false);
  }

  // Add a new marker
  const addMarker = async (marker: Marker) => {
    setMarkers((prev) => [...prev, marker]);
    await markersService.add(marker);
  };

  // Edit marker by id
  const editMarker = async (updated: Marker) => {
    setMarkers((prev) =>
      prev.map((marker) =>
        marker.id === updated.id ? { ...marker, ...updated } : marker
      )
    );
    await markersService.edit(updated);
  };

  // Remove marker by id
  const removeMarker = async (id: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
    await markersService.remove(id);
  };

  // Toggle marker visibility by id
  const toggleMarkerVisibility = async (id: string) => {
    setMarkers((prev) =>
      prev.map((marker) =>
        marker.id === id ? { ...marker, visible: !marker.visible } : marker
      )
    );
    const updated = markers.find((m) => m.id === id);
    if (updated) {
      await markersService.edit({ ...updated, visible: !updated.visible });
    }
  };

  // Reorder markers (only update markers whose order changed)
  const reorderMarkers = async (newOrder: Marker[]) => {
    const changed: Marker[] = [];
    newOrder.forEach((marker, idx) => {
      if (marker.order !== idx) {
        changed.push({ ...marker, order: idx });
      }
    });
    if (changed.length > 0) {
      await markersService.reorder(changed);
    }
    const dbMarkers = await markersService.load();
    setMarkers(dbMarkers);
  };

  // Open add marker modal
  function openAddMarker(coords?: [number, number]) {
    setEditingMarker({
      id: crypto.randomUUID(),
      name: "",
      color: "#e53e3e",
      description: "",
      longitude: coords?.[0] ?? 0,
      latitude: coords?.[1] ?? 0,
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
  function saveMarker() {
    if (!editingMarker) return;
    const exists = markers.some((m) => m.id === editingMarker.id);
    if (exists) {
      editMarker(editingMarker);
    } else {
      addMarker(editingMarker);
    }
    closeMarkerModal();
  }

  // Close edit marker modal
  function closeMarkerModal() {
    setMarkerModalOpen(false);
    setEditingMarker(null);
  }

  // Show marker details modal
  function showMarkerDetails(
    marker: Marker,
    position?: { top: number; left: number }
  ) {
    setSelectedMarker(marker);
    setDetailsModalOpen(true);
    setDetailsModalPosition(position ?? null);
  }

  // Close marker details modal
  function closeMarkerDetails() {
    setDetailsModalOpen(false);
    setSelectedMarker(null);
    setDetailsModalPosition(null);
  }

  return (
    <MarkersContext.Provider
      value={{
        markers,
        isAddingMarker,
        startAddingMarker,
        handleMapClickForMarker,
        cancelMarkerCreation,
        addMarker,
        editMarker,
        removeMarker,
        toggleMarkerVisibility,
        reorderMarkers,
        editingMarker,
        setEditingMarker,
        isEditingMarker,
        isMarkerModalOpen,
        openAddMarker,
        openEditMarker,
        saveMarker,
        closeMarkerModal,
        selectedMarker,
        detailsModalOpen,
        detailsModalPosition,
        showMarkerDetails,
        closeMarkerDetails,
      }}
    >
      {children}
    </MarkersContext.Provider>
  );
};
