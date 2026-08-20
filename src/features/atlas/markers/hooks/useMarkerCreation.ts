import { useCallback } from "react";
import { useMapView } from "@features/atlas/map/context/MapViewContext";
import { useSavedMaps } from "@features/atlas/savedMaps/context/SavedMapsContext";
import { getCountryName } from "@features/countries/core/utils/countryData";
import { useCountryData } from "@features/countries/core/hooks/useCountryData";
import { useEventListener } from "@hooks";
import { useMarkers } from "../context/MarkersContext";

interface UseMarkerCreationProps {
  onCountryClick?: (isoCode: string | null) => void;
}

/**
 * Manages marker creation state and interactions with the map.
 * @param onCountryClick - Optional callback for handling country clicks when not adding a marker.
 * @returns An object containing marker creation state and handlers.
 */
export function useMarkerCreation({
  onCountryClick,
}: UseMarkerCreationProps = {}) {
  const { countries } = useCountryData();
  const { isEdit } = useMapView();

  const main = useMarkers();
  const saved = useSavedMaps();
  const ctx = isEdit ? saved.markers : main;

  const { isAddingMarker, cancelMarkerCreation, handleCountryClickForMarker } =
    ctx;

  // Handle Escape key to cancel marker creation
  useEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      if (isAddingMarker && e.key === "Escape") {
        cancelMarkerCreation();
      }
    },
    window,
  );

  // Handle country clicks depending on active mode
  const handleCountryClick = useCallback(
    (isoCode: string | null, e?: React.MouseEvent) => {
      if (isAddingMarker) {
        e?.stopPropagation();
        if (isoCode) {
          handleCountryClickForMarker?.(
            isoCode,
            getCountryName(isoCode, countries),
          );
        }
      } else if (isoCode && onCountryClick) {
        onCountryClick(isoCode);
      }
    },
    [isAddingMarker, handleCountryClickForMarker, countries, onCountryClick],
  );

  return {
    markers: ctx.markers,
    isAddingMarker,
    startAddingMarker: ctx.startAddingMarker,
    openAddMarker: ctx.openAddMarker,
    openEditMarker: ctx.openEditMarker,
    cancelMarkerCreation,
    handleCountryClick,
  };
}
