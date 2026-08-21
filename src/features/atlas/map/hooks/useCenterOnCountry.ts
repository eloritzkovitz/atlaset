import { useCallback } from "react";
import { useGetGeoDataQuery } from "../api/mapApi";
import { useMapView } from "../context/MapViewContext";
import { getCountryCenterAndZoom } from "../utils/projection";

/**
 * Center the map on a specific country by its ISO code.
 */
export function useCenterOnCountry() {
  const { data: geoData } = useGetGeoDataQuery();
  const { setCenter, setZoom } = useMapView();

  return useCallback(
    (isoCode: string) => {
      if (!geoData) return;

      const result = getCountryCenterAndZoom(geoData, isoCode);

      if (!result) return;

      setCenter(result.center);
      setZoom(result.zoom);
    },
    [geoData, setCenter, setZoom],
  );
}
