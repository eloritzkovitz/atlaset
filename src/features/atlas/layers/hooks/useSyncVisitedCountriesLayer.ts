import { useEffect } from "react";
import { useCountryColors } from "@features/settings/hooks/useCountryColors";
import type { Trip } from "@features/trips";
import { computeVisitedCountriesFromTrips } from "@features/visits";
import { VISITED_LAYER_ID } from "../constants/layers";
import { layersService } from "../services/layersService";
import type { AnyLayer } from "../types";

/**
 * Synchronizes the Visited Countries layer with the user's trip data.
 * @param trips - Array of trip objects.
 * @param layers - Current array of layers.
 * @param setLayers - Function to update the layers state.
 * @param loading - Loading state to prevent premature updates.
 */
export function useSyncVisitedCountriesLayer(
  trips: Trip[],
  layers: AnyLayer[],
  setLayers: React.Dispatch<React.SetStateAction<AnyLayer[]>>,
  loading: boolean
) {
  const { VISITED_COUNTRY_COLOR } = useCountryColors();

  useEffect(() => {
    if (loading || layers.length === 0) return;

    const visitedLayer = layers.find((o) => o.id === VISITED_LAYER_ID);
    if (!visitedLayer) return;

    const visitedCountries = computeVisitedCountriesFromTrips(trips);
    const prevCountries = visitedLayer.countries || [];
    const hasChanged =
      prevCountries.length !== visitedCountries.length ||
      prevCountries.some((c, i) => visitedCountries[i] !== c);

    // Also check if the color has changed
    const colorChanged = visitedLayer.color !== VISITED_COUNTRY_COLOR;

    // Only update if something changed
    if ((hasChanged || colorChanged) && layers.length > 0) {
      const updated = layers.map((layer) =>
        layer.id === VISITED_LAYER_ID
          ? {
              ...layer,
              countries: visitedCountries,
              color: VISITED_COUNTRY_COLOR,
            }
          : layer
      );
      setLayers(updated);
      layersService.save(updated);
    }
  }, [trips, loading, layers, setLayers, VISITED_COUNTRY_COLOR]);
}
