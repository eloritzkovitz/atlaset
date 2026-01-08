import { useEffect, useRef } from "react";
import { DEFAULT_MAP_SETTINGS } from "@constants";
import { useMapView } from "@contexts/MapViewContext";
import { useHighlightYearlyCountries } from "@features/atlas/timeline";
import { useContainerDimensions } from "@hooks";
import { MapProvider } from "../providers/MapProvider";
import { MapSvgContainer } from "./MapSvgContainer";
import { LayersContainer } from "./LayersContainer";
import { MarkersContainer } from "./MarkersContainer";
import { ZoomableGroup } from "./ZoomableGroup";
import { useMapEventHandler } from "../hooks/useMapEventHandler";
import { useMapLayerItems } from "../hooks/useMapLayerItems";

export interface WorldMapProps {
  mode?: "normal" | "readonly";
  onCountryClick: (countryIsoCode: string | null) => void;
  onCountryHover: (isoCode: string | null) => void;
  selectedIsoCode: string | null;
  hoveredIsoCode: string | null;
  onReady?: () => void;
  svgRef?: React.Ref<SVGSVGElement>;
  isAddingMarker: boolean;
}

export function WorldMap({
  mode = "normal",
  onCountryClick,
  onCountryHover,
  selectedIsoCode,
  hoveredIsoCode,
  onReady,
  svgRef,
  isAddingMarker,
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measuredDimensions = useContainerDimensions(containerRef);

  // Map projection and data
  const {
    geoData,
    projection,
    dimensions,
    setDimensions,
    zoom,
    center,
    handleMoveEnd,
  } = useMapView();

  // Push measured dimensions into context
  useEffect(() => {
    if (measuredDimensions.width > 0 && measuredDimensions.height > 0) {
      setDimensions(measuredDimensions);
    }
  }, [measuredDimensions, setDimensions]);

  // Get layer items based on mode
  const layerItems = useMapLayerItems(mode);

  // Get highlighted countries for the current timeline year
  const [highlightedIsoCodes, highlightDirection] =
    useHighlightYearlyCountries();

  // Handle map event for mouse move or click
  const handleMapEvent = useMapEventHandler();

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
        <MapProvider
          width={dimensions.width}
          height={dimensions.height}
          projection={projection || DEFAULT_MAP_SETTINGS.projection}
          projectionConfig={{
            scale:
              Math.min(dimensions.width, dimensions.height) /
              DEFAULT_MAP_SETTINGS.scaleDivisor,
            center: [0, 0],
          }}
        >
          <svg
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            width={dimensions.width}
            height={dimensions.height}
            className="rsm-svg"
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
          </svg>
        </MapProvider>
      </MapSvgContainer>
    </div>
  );
}
