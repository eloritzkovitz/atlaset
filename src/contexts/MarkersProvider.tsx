import React, { useState, useEffect } from "react";
import type { Coordinates } from "@features/atlas/map";
import { markersService } from "@features/atlas/markers";
import type { Marker } from "@features/atlas/markers/types";
import { useAuth } from "@features/user";
import { MarkersContext } from "./MarkersContext";
import { useMarkerManager } from "@features/atlas/markers/hooks/useMarkerManager";

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
    removeMarker,
    toggleMarkerVisibility,
    reorderMarkers,
    openAddMarker,
    openEditMarker,
    saveMarker,
    closeMarkerModal,
  } = useMarkerManager({
    initialMarkers,
    persistMarkers: async (updatedMarkers) => {
      await markersService.save(updatedMarkers);
    },
  });

  // Adding state
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  // Selection state
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsModalPosition, setDetailsModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Start adding a new marker
  function startAddingMarker() {
    setIsAddingMarker(true);
  }

  // Handle map click for adding marker
  const handleMapClickForMarker = (coords: Coordinates) => {
    if (!isAddingMarker) return;
    openAddMarker(coords);
    setIsAddingMarker(false);
  };

  // Cancel marker creation
  function cancelMarkerCreation() {
    setIsAddingMarker(false);
  }

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
}
