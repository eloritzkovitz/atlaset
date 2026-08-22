import { useEffect, useMemo } from "react";
import { useMarkerCreation } from "@features/atlas/markers";
import { useMapSettings } from "@features/atlas/settings";
import { useHighlightYearlyCountries } from "@features/atlas/timeline";
import { DEFAULT_MAP_SETTINGS } from "@features/settings";
import { LayersContainer } from "./LayersContainer";
import { MapSvgContainer } from "./MapSvgContainer";
import { MarkersContainer } from "./MarkersContainer";
import { ZoomableGroup } from "./ZoomableGroup";
import { useGetGeoDataQuery } from "../api/mapApi";
import { useMapView } from "../context/MapViewContext";
import { useMapDimensions } from "../hooks/useMapDimensions";
import { MapProvider } from "../providers/MapProvider";

export interface WorldMapProps {
  onCountryClick: (countryIsoCode: string | null) => void;
  onCountryHover: (isoCode: string | null) => void;
  selectedIsoCode: string | null;
  hoveredIsoCode: string | null;
  onReady?: () => void;
  svgRef?: React.Ref<SVGSVGElement>;
  isAddingMarker: boolean;
}

/** Renders a world map with interactive features. */
export function WorldMap({
  onCountryClick,
  onCountryHover,
  selectedIsoCode,
  hoveredIsoCode,
  onReady,
  svgRef,
  isAddingMarker,
}: WorldMapProps) {
  const { data: geoData } = useGetGeoDataQuery();
  const { containerRef, mapWidth, mapHeight } = useMapDimensions();
  const { projection } = useMapSettings();
  const { colorMode, zoom, center, handleMoveEnd } = useMapView();

  // Handle country clicks, either for adding a marker or for normal interaction
  const { handleCountryClick } = useMarkerCreation({ onCountryClick });

  // Get highlighted countries for the current timeline year
  const [highlightedIsoCodes, highlightDirection] =
    useHighlightYearlyCountries();

  // Call onReady when map data is loaded
  useEffect(() => {
    if (onReady && geoData) {
      onReady();
    }
  }, [onReady, geoData]);

  const projectionConfig = useMemo(
    () => ({
      scale: Math.min(mapWidth, mapHeight) / DEFAULT_MAP_SETTINGS.scaleDivisor,
      center: [0, 0] as [number, number],
    }),
    [mapWidth, mapHeight],
  );

  const activeProjection = projection || DEFAULT_MAP_SETTINGS.projection;

  if (!geoData) return null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${colorMode === "atlas" ? "bg-bg-atlas" : "bg-bg"} overflow-hidden`}
      style={{
        aspectRatio: "16/9",
        maxHeight: "100dvh",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <MapSvgContainer
        ref={svgRef}
        width={mapWidth}
        height={mapHeight}
        className="map-container w-full h-full"
        isAddingMarker={isAddingMarker}
      >
        <MapProvider
          key={`${activeProjection}-${mapWidth}-${mapHeight}`}
          width={mapWidth}
          height={mapHeight}
          projection={activeProjection}
          projectionConfig={projectionConfig}
        >
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            width="100%"
            height="100%"
            className={`rsm-svg w-full h-full block ${isAddingMarker ? "cursor-crosshair" : ""}`}
            ref={svgRef}
          >
            <ZoomableGroup
              zoom={zoom}
              center={center}
              minZoom={DEFAULT_MAP_SETTINGS.minZoom}
              maxZoom={DEFAULT_MAP_SETTINGS.maxZoom}
              onMoveEnd={zoom >= 1 ? handleMoveEnd : undefined}
            >
              <LayersContainer
                geographyData={geoData}
                selectedIsoCode={selectedIsoCode}
                hoveredIsoCode={hoveredIsoCode}
                highlightedIsoCodes={
                  highlightDirection === "asc" ? highlightedIsoCodes : []
                }
                onCountryClick={handleCountryClick}
                onCountryHover={onCountryHover}
                isAddingMarker={isAddingMarker}
              />
              <MarkersContainer zoom={zoom} />
            </ZoomableGroup>
          </svg>
        </MapProvider>
      </MapSvgContainer>
    </div>
  );
}
