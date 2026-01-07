import { useEffect, useRef } from "react";
import { DEFAULT_MAP_SETTINGS } from "@constants";
import { useMapUI } from "@contexts/MapUIContext";
import { useHighlightYearlyCountries } from "@features/atlas/timeline";
import { useContainerDimensions } from "@hooks";
import { ComposableMap } from "./ComposableMap";
import { MapSvgContainer } from "./MapSvgContainer";
import { LayersContainer } from "./LayersContainer";
import { MarkersContainer } from "./MarkersContainer";
import { ZoomableGroup } from "./ZoomableGroup";
import { useMapEventHandler } from "../hooks/useMapEventHandler";
import { useMapLayerItems } from "../hooks/useMapLayerItems";
import type { GeoData, Coordinates } from "../types";

export interface WorldMapProps {
  geoData: GeoData;
  zoom: number;
  center: Coordinates;
  setZoom: (zoom: number) => void;
  setCenter: (center: Coordinates) => void;
  handleMoveEnd: (params: {
    zoom: number;
    coordinates: Coordinates;
  }) => void;
  onCountryClick: (countryIsoCode: string | null) => void;
  onCountryHover: (isoCode: string | null) => void;
  selectedIsoCode: string | null;
  hoveredIsoCode: string | null;
  onReady?: () => void;
  svgRef?: React.Ref<SVGSVGElement>;
  isAddingMarker: boolean;
  setSelectedCoords?: (coords: Coordinates | null) => void;
}

export function WorldMap({
  geoData,
  zoom,
  center,
  handleMoveEnd,
  onCountryClick,
  onCountryHover,
  selectedIsoCode,
  hoveredIsoCode,
  onReady,
  svgRef,
  isAddingMarker,
  setSelectedCoords,
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useContainerDimensions(containerRef);

  // Map projection and data
  const { projection } = useMapUI();

  // Get layer items based on mode
  const layerItems = useMapLayerItems();

  // Get highlighted countries for the current timeline year
  const [highlightedIsoCodes, highlightDirection] =
    useHighlightYearlyCountries();

  // Handle map event for mouse move or click
  const handleMapEvent = useMapEventHandler({
    projection,
    dimensions,
    zoom,
    center,
    setSelectedCoords: setSelectedCoords
      ? (coords) => setSelectedCoords(coords)
      : () => {},
  });

  // Call onReady when map is ready
  useEffect(() => {
    if (
      onReady &&
      geoData &&
      svgRef &&
      typeof svgRef !== "function" &&
      svgRef.current
    ) {
      onReady();
    }
  }, [onReady, geoData, svgRef]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-bg overflow-hidden"
      style={{
        aspectRatio: "16/9",
        maxHeight: "100dvh",
        cursor: isAddingMarker ? "crosshair" : "default",
      }}
    >
      {/* SVG map container */}
      <MapSvgContainer
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="map-container"
      >
        <ComposableMap
          projection={projection || DEFAULT_MAP_SETTINGS.projection}
          projectionConfig={{
            scale:
              Math.min(dimensions.width, dimensions.height) /
              DEFAULT_MAP_SETTINGS.scaleDivisor,
            center: [0, 0],
          }}
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMapEvent}
          onClick={handleMapEvent}
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
              layerItems={layerItems}
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
              projectionType={projection || DEFAULT_MAP_SETTINGS.projection}
              width={dimensions.width}
              height={dimensions.height}
              scaleDivisor={DEFAULT_MAP_SETTINGS.scaleDivisor}
              zoom={zoom}
            />
          </ZoomableGroup>
        </ComposableMap>
      </MapSvgContainer>
    </div>
  );
}
