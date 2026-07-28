import { useMemo } from "react";
import * as d3 from "d3-geo";
import {
  groupLayerItemsByIsoCode,
  getBlendedLayerColor,
} from "@features/atlas/layers";
import { useMapView } from "@features/atlas/map";
import { useMapSettings } from "@features/atlas/settings";
import { getCountryIsoCode } from "@features/countries";
import type { SavedMap } from "../types";

/** Renders a preview of a saved map.
 * @param map The saved map data to render.
 */
export function MapPreview({ map }: { map: SavedMap }) {
  const { baseColor } = useMapSettings();
  const { geoData } = useMapView();

  const layerItems = useMemo(() => {
    if (!map?.layers) return [];
    return map.layers.flatMap((layer) =>
      layer.countries.map((isoCode) => ({
        isoCode: isoCode.toUpperCase(),
        color: layer.color,
        layerId: layer.id,
      })),
    );
  }, [map?.layers]);

  const layerGroups = useMemo(
    () => groupLayerItemsByIsoCode(layerItems),
    [layerItems],
  );

  const previewWidth = 440;
  const previewHeight = 225;

  // Set up D3 projection and path generator
  const projection = useMemo(() => {
    if (!geoData) return null;
    return d3.geoEqualEarth().fitSize([previewWidth, previewHeight], geoData);
  }, [geoData]);

  const pathGen = useMemo(() => {
    if (!projection) return null;
    return d3.geoPath().projection(projection);
  }, [projection]);

  // If any of the required data is missing, return null to avoid rendering
  if (!geoData || !projection || !pathGen) return null;

  return (
    <svg
      width={previewWidth}
      height={previewHeight}
      viewBox={`0 0 ${previewWidth} ${previewHeight}`}
      style={{
        display: "block",
      }}
    >
      <g filter="url(#preview-shadow)">
        {Array.isArray(geoData.features) &&
          geoData.features.map((feature, i) => {
            const d = pathGen(feature as GeoJSON.Feature);
            if (!d) return null;

            const isoA2 = getCountryIsoCode(feature.properties ?? {});
            const layers = isoA2 ? layerGroups[isoA2.toUpperCase()] : undefined;

            const fill = layers
              ? getBlendedLayerColor(layers, baseColor)
              : baseColor;

            return (
              <path
                key={i}
                d={d}
                fill={fill}
                stroke="#222"
                strokeWidth={0.05}
                opacity={1}
              />
            );
          })}
      </g>
    </svg>
  );
}
