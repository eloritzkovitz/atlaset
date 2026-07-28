import React, { useState, useEffect } from "react";
import { logUserActivity } from "@features/activity/utils/activity";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { MarkersContext } from "./MarkersContext";
import { useMarkerManager } from "../hooks/useMarkerManager";
import { markersService } from "../services/markersService";
import type { Marker } from "../types";

export function MarkersProvider({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();

  const [initialMarkers, setInitialMarkers] = useState<Marker[]>([]);

  const lastAction = React.useRef<string | null>(null);

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
    duplicateMarker,
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
      lastAction.current = null;
    },
    onLogAction: async (action, marker) => {
      if (!user) return;

      lastAction.current = action;

      const actionCodes = { add: 221, edit: 222, remove: 223, reorder: 224 };
      await logUserActivity(
        actionCodes[action],
        {
          markerId: marker.id,
          itemName: marker.name,
          userName: user.displayName,
        },
        user.uid,
      );
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
        duplicateMarker,
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
