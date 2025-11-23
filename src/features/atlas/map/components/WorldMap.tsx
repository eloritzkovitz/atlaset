import { useEffect, useRef } from "react";
import { ComposableMap, ZoomableGroup } from "react-simple-maps";
import { DEFAULT_MAP_SETTINGS } from "@constants";
import { useMapUI } from "@contexts/MapUIContext";
import { useOverlays } from "@contexts/OverlayContext";
import { useContainerDimensions } from "@hooks/useContainerDimensions";
import type { OverlayMode } from "@types";
import { MapSvgContainer } from "./MapSvgContainer";
import { CountriesLayer } from "./layers/CountriesLayer";
import { MapMarkersLayer } from "./layers/MapMarkersLayer";
import { useMapEventHandler } from "../hooks/useMapEventHandler";
import { useMapOverlayItems } from "../hooks/useMapOverlayItems";

interface WorldMapProps {
  geoData: string;
  zoom: number;
  center: [number, number];
  setZoom: (zoom: number) => void;
  setCenter: (center: [number, number]) => void;
  handleMoveEnd: (params: {
    zoom: number;
    coordinates: [number, number];
  }) => void;
  onCountryClick: (countryIsoCode: string | null) => void;
  onCountryHover: (isoCode: string | null) => void;
  selectedIsoCode: string | null;
  hoveredIsoCode: string | null;
  onReady?: () => void;
  svgRef?: React.Ref<SVGSVGElement>;
  isAddingMarker: boolean;
  setSelectedCoords?: (coords: [number, number] | null) => void;
  selectedYear: number;
  overlayMode: OverlayMode;
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
  selectedYear,
  overlayMode,
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useContainerDimensions(containerRef);

  // Map projection and data
  const { projection } = useMapUI();  

  // Load overlays data
  const { overlays } = useOverlays();

  // Get overlay items based on mode
  const overlayItems = useMapOverlayItems(overlays, selectedYear, overlayMode);

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
    if (onReady) {
      onReady();
    }
  }, [onReady]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-[100dvh] ${DEFAULT_MAP_SETTINGS.bgColor} overflow-hidden`}
      style={{ cursor: isAddingMarker ? "crosshair" : "default" }}
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
            {/* Countries layers */}
            <CountriesLayer
              geographyData={geoData}
              overlayItems={overlayItems}
              selectedIsoCode={selectedIsoCode}
              hoveredIsoCode={hoveredIsoCode}
              onCountryClick={onCountryClick}
              onCountryHover={onCountryHover}
              isAddingMarker={isAddingMarker}
            />
            {/* Markers layer */}
            <MapMarkersLayer
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
