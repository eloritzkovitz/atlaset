import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ACTIONS } from "@constants/actions";
import { logUserActivity } from "@features/activity";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { useDataLoader, useDisclosure } from "@hooks";
import { MarkersContext } from "./MarkersContext";
import { useMarkerManager } from "../hooks/useMarkerManager";
import { markersService } from "../services/markersService";
import type { Marker } from "../types";

interface MarkerDetailsPayload {
  marker: Marker;
  position?: { top: number; left: number };
}

export function MarkersProvider({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const lastAction = useRef<string | null>(null);
  const loadedUserIdRef = useRef<string | null>(null);

  // Data loader for fetching markers
  const fetchMarkers = useCallback(() => markersService.load(), []);
  const {
    data: loadedMarkers,
    setData: setMarkers,
    reload: reloadMarkers,
  } = useDataLoader<Marker[]>({
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
      setMarkers([]);
    }
  }, [user?.uid, ready, reloadMarkers, setMarkers]);

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
      const actionCodes = {
        add: ACTIONS.MARKER_ADDED,
        edit: ACTIONS.MARKER_EDITED,
        remove: ACTIONS.MARKER_REMOVED,
        reorder: ACTIONS.MARKERS_REORDERED,
      };
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

  const detailsModal = useDisclosure<MarkerDetailsPayload>();

  /** Shows details for a specific marker. */
  function showMarkerDetails(
    marker: Marker,
    position?: { top: number; left: number },
  ) {
    detailsModal.open({ marker, position });
  }

  /** Closes the marker details modal. */
  function closeMarkerDetails() {
    detailsModal.close();
  }

  return (
    <MarkersContext.Provider
      value={{
        ...markerManager,
        reloadMarkers,
        selectedMarker: detailsModal.data?.marker ?? null,
        detailsModalOpen: detailsModal.isOpen,
        detailsModalPosition: detailsModal.data?.position ?? null,
        showMarkerDetails,
        closeMarkerDetails,
      }}
    >
      {children}
    </MarkersContext.Provider>
  );
}
