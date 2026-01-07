import { useState, useEffect } from "react";
import { useMapContext } from "../providers/MapContext";
import type { GeographyFeature } from "../types";
import {
  getFeatures,
  getMesh,
  prepareFeatures,
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
  const [result, setResult] = useState<UseGeographiesResult>({
    geographies: [],
  });

  useEffect(() => {
    if (!geography) {
      setResult({ geographies: [] });
      return;
    }
    const rawFeatures = getFeatures(geography, parseGeographies);
    const geographies = rawFeatures ? prepareFeatures(rawFeatures, path) : [];
    const meshRaw = getMesh(geography);
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
    setResult({
      geographies,
      outline: mesh?.outline,
      borders: mesh?.borders,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geography, parseGeographies]);

  return result;
}
