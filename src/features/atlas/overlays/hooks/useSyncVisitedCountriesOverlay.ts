import { useEffect } from "react";
import { VISITED_OVERLAY_ID } from "@constants/overlays";
import { useCountryColors } from "@features/settings/hooks/useCountryColors";
import type { Trip } from "@features/trips";
import { computeVisitedCountriesFromTrips } from "@features/visits";
import { overlaysService } from "../services/overlaysService";
import type { AnyOverlay } from "../types";

/**
 * Synchronizes the Visited Countries overlay with the user's trip data.
 * @param trips - Array of trip objects.
 * @param overlays - Current array of overlays.
 * @param setOverlays - Function to update the overlays state.
 * @param loading - Loading state to prevent premature updates.
 */
export function useSyncVisitedCountriesOverlay(
  trips: Trip[],
  overlays: AnyOverlay[],
  setOverlays: React.Dispatch<React.SetStateAction<AnyOverlay[]>>,
  loading: boolean
) {
  const { VISITED_COUNTRY_COLOR } = useCountryColors();

  useEffect(() => {
    if (loading || overlays.length === 0) return;

    const visitedOverlay = overlays.find((o) => o.id === VISITED_OVERLAY_ID);
    if (!visitedOverlay) return;

    const visitedCountries = computeVisitedCountriesFromTrips(trips);
    const prevCountries = visitedOverlay.countries || [];
    const hasChanged =
      prevCountries.length !== visitedCountries.length ||
      prevCountries.some((c, i) => visitedCountries[i] !== c);

    // Also check if the color has changed
    const colorChanged = visitedOverlay.color !== VISITED_COUNTRY_COLOR;

    // Only update if something changed
    if ((hasChanged || colorChanged) && overlays.length > 0) {
      const updated = overlays.map((overlay) =>
        overlay.id === VISITED_OVERLAY_ID
          ? {
              ...overlay,
              countries: visitedCountries,
              color: VISITED_COUNTRY_COLOR,
            }
          : overlay
      );
      setOverlays(updated);
      overlaysService.save(updated);
    }
  }, [trips, loading, overlays, setOverlays, VISITED_COUNTRY_COLOR]);
}
