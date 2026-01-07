import { useState, useEffect } from "react";
import { useMapContext } from "../providers/MapContext";
import type { GeographyFeature } from "../types";
import {
  fetchGeographies,
  getFeatures,
  getMesh,
  prepareFeatures,
  isString,
  prepareMesh,
} from "../utils/geography";

export interface UseGeographiesResult {
  geographies: GeographyFeature[];
  outline?: GeographyFeature;
  borders?: GeographyFeature;
}

export interface UseGeographiesProps {
  geography: unknown;
  parseGeographies?: (geography: unknown) => GeographyFeature[];
}

/**
 * Loads and processes geographical data for use in map components.
 * @param geography - The geographical data source, either as a URL string or raw data.
 * @param parseGeographies - Optional function to parse raw geographical data into features.
 * @returns An object containing processed geographies, outline, and borders.
 */
export function useGeographies({
  geography,
  parseGeographies,
}: UseGeographiesProps): UseGeographiesResult {
  const { path } = useMapContext();
  const [output, setOutput] = useState<{
    geographies?: GeographyFeature[];
    mesh?: { outline?: GeographyFeature; borders?: GeographyFeature };
  }>({});

  // Load and process geographical data when geography or parseGeographies change
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!geography) return;

    const processGeos = (geos: unknown) => {
      const rawFeatures = getFeatures(geos, parseGeographies);
      const geographies = rawFeatures ? prepareFeatures(rawFeatures, path) : [];
      const meshRaw = getMesh(geos);
      let mesh:
        | { outline?: GeographyFeature; borders?: GeographyFeature }
        | undefined = undefined;
      if (meshRaw && meshRaw.outline && meshRaw.borders) {
        mesh = prepareMesh(
          meshRaw.outline as GeographyFeature,
          meshRaw.borders as GeographyFeature,
          path
        );
      }
      setOutput({ geographies, mesh });
    };
    if (isString(geography)) {
      fetchGeographies(geography).then((geos) => {
        if (geos) {
          processGeos(geos);
        }
      });
    } else {
      processGeos(geography);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geography, parseGeographies]);

  const geographies: GeographyFeature[] = output.geographies || [];
  const outline: GeographyFeature | undefined = output.mesh?.outline;
  const borders: GeographyFeature | undefined = output.mesh?.borders;

  return { geographies, outline, borders };
}
