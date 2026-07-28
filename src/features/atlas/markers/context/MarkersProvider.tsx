import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { logUserActivity } from "@features/activity/utils/activity";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { useDataLoader } from "@hooks";
import { MarkersContext } from "./MarkersContext";
import { useMarkerManager } from "../hooks/useMarkerManager";
import { markersService } from "../services/markersService";
import type { Marker } from "../types";

export function MarkersProvider({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const lastAction = useRef<string | null>(null);
  const loadedUserIdRef = useRef<string | null>(null);

  // Data loader for fetching markers
  const fetchMarkers = useCallback(() => markersService.load(), []);
  const { data: loadedMarkers, reload: reloadMarkers } = useDataLoader<
    Marker[]
  >({
    fetchFn: fetchMarkers,
  });

  const initialMarkers = useMemo(() => loadedMarkers ?? [], [loadedMarkers]);

  // Auth-aware initial fetch guard
  useEffect(() => {
    if (!ready) return;

    if (user?.uid) {
      if (loadedUserIdRef.current !== user.uid) {
        loadedUserIdRef.current = user.uid;
        reloadMarkers();
      }
    } else {
      loadedUserIdRef.current = null;
    }
  }, [user?.uid, ready, reloadMarkers]);

  // Marker manager for markers state and operations
  const markerManager = useMarkerManager({
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

  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsModalPosition, setDetailsModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  /** Shows details for a specific marker. */
  function showMarkerDetails(
    marker: Marker,
    position?: { top: number; left: number },
  ) {
    setSelectedMarker(marker);
    setDetailsModalOpen(true);
    setDetailsModalPosition(position ?? null);
  }

  /** Closes the marker details modal. */
  function closeMarkerDetails() {
    setDetailsModalOpen(false);
    setSelectedMarker(null);
    setDetailsModalPosition(null);
  }

  return (
    <MarkersContext.Provider
      value={{
        ...markerManager,
        reloadMarkers,
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
