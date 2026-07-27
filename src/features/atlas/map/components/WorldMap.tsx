import { useEffect, useMemo, useRef } from "react";
import { useMapView } from "@contexts/MapViewContext";
import { useMapSettings } from "@features/atlas/settings";
import { useHighlightYearlyCountries } from "@features/atlas/timeline";
import { DEFAULT_MAP_SETTINGS } from "@features/settings";
import { useContainerDimensions } from "@hooks";
import { LayersContainer } from "./LayersContainer";
import { MapSvgContainer } from "./MapSvgContainer";
import { MarkersContainer } from "./MarkersContainer";
import { ZoomableGroup } from "./ZoomableGroup";
import { useMapEventHandler } from "../hooks/useMapEventHandler";
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

export function WorldMap({
  onCountryClick,
  onCountryHover,
  selectedIsoCode,
  hoveredIsoCode,
  onReady,
  svgRef,
  isAddingMarker,
}: WorldMapProps) {
  const { projection } = useMapSettings();
  const {
    colorMode,
    geoData,
    dimensions,
    setDimensions,
    zoom,
    center,
    handleMoveEnd,
  } = useMapView();

  const containerRef = useRef<HTMLDivElement>(null);
  const measuredDimensions = useContainerDimensions(containerRef);

  // Update map dimensions when measured dimensions are available
  useEffect(() => {
    if (measuredDimensions.width > 0 && measuredDimensions.height > 0) {
      setDimensions(measuredDimensions);
    }
  }, [measuredDimensions, setDimensions]);

  // Safe dimensions for SVG attributes & projections
  const mapWidth =
    dimensions.width > 0 ? dimensions.width : measuredDimensions.width || 800;
  const mapHeight =
    dimensions.height > 0
      ? dimensions.height
      : measuredDimensions.height || 600;

  // Get highlighted countries for the current timeline year
  const [highlightedIsoCodes, highlightDirection] =
    useHighlightYearlyCountries();

  // Handle map event for mouse move or click
  const handleMapEvent = useMapEventHandler();

  // Call onReady when map data is loaded
  useEffect(() => {
    if (onReady && geoData) {
      onReady();
    }
  }, [onReady, geoData]);

  // Memoize projection configuration using safe non-zero dimensions
  const projectionConfig = useMemo(
    () => ({
      scale: Math.min(mapWidth, mapHeight) / DEFAULT_MAP_SETTINGS.scaleDivisor,
      center: [0, 0] as [number, number],
    }),
    [mapWidth, mapHeight],
  );

  const activeProjection = projection || DEFAULT_MAP_SETTINGS.projection;

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
            className="rsm-svg w-full h-full block"
            onMouseMove={handleMapEvent}
            onClick={handleMapEvent}
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
                onCountryClick={onCountryClick}
                onCountryHover={onCountryHover}
                isAddingMarker={isAddingMarker}
              />
              <MarkersContainer
                projectionType={activeProjection}
                width={mapWidth}
                height={mapHeight}
                scaleDivisor={DEFAULT_MAP_SETTINGS.scaleDivisor}
                zoom={zoom}
              />
            </ZoomableGroup>
          </svg>
        </MapProvider>
      </MapSvgContainer>
    </div>
  );
}
