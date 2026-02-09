import React, { useState, useEffect } from "react";
import { markersService, useMarkerManager } from "@features/atlas/markers";
import type { Marker } from "@features/atlas/markers/types";
import { useAuth } from "@features/user";
import { MarkersContext } from "./MarkersContext";

export function MarkersProvider({ children }: { children: React.ReactNode }) {
  // Fetch markers on mount
  const { user, ready } = useAuth();
  const [initialMarkers, setInitialMarkers] = useState<Marker[]>([]);

  // Load markers when auth state changes
  useEffect(() => {
    let mounted = true;
    if (!ready) return;
    if (user) {
      markersService.load().then((dbMarkers) => {
        if (mounted) setInitialMarkers(dbMarkers);
      });
    }
    return () => {
      mounted = false;
    };
  }, [user, ready]);

  // Marker manager for markers state and operations
  const {
    markers,
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
    isAddingMarker,
    startAddingMarker,
    handleMapClickForMarker,
    cancelMarkerCreation,
  } = useMarkerManager({
    initialMarkers,
    persistMarkers: async (updatedMarkers) => {
      await markersService.save(updatedMarkers);
    },
  });

  // Selection state
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsModalPosition, setDetailsModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Show marker details modal
  function showMarkerDetails(
    marker: Marker,
    position?: { top: number; left: number },
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
        isAddingMarker,
        startAddingMarker,
        handleMapClickForMarker,
        cancelMarkerCreation,
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
}
