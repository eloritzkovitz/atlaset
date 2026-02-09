import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { ErrorMessage, LoadingSpinner } from "@components";
import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useCountrySelection } from "@features/atlas/countries";
import { WorldMap, useGeoData, useMapMode } from "@features/atlas/map";
import { useMarkerCreation } from "@features/atlas/markers";
import { AtlasUiContainer, MapUiContainer } from "@features/atlas/ui";
import { AtlasShortcuts } from "@features/atlas/ui/components/AtlasShortcuts";
import { useCountryData } from "@features/countries";
import { usePageTitle } from "@hooks";

export default function AtlasPage() {
  const location = useLocation();
  const { geoError, loading: geoLoading } = useGeoData();
  const { countries, loading: countriesLoading, error } = useCountryData();
  const { loading: layersLoading } = useLayers();
  const { mapReady, handleMapReady } = useMapView();
  const svgRef = useRef<SVGSVGElement>(null);

  // Set page title
  usePageTitle("Atlaset");

  // Set map mode based on URL params
  useMapMode();

  // Country selection state
  const {
    selectedIsoCode,
    setSelectedIsoCode,
    hoveredIsoCode,
    setHoveredIsoCode,
    selectedCountry,
    setSelectedCountry,
    handleCountryClick,
    handleCountryHover,
  } = useCountrySelection(countries);

  // Marker creation state
  const { isAddingMarker } = useMarkerCreation();

  // Derived state
  const params = new URLSearchParams(location.search);
  const isEmbed = params.has("embed");
  const isLoading =
    countriesLoading || layersLoading || geoLoading || !mapReady;
  if (error || geoError) {
    return (
      <ErrorMessage fullScreen error={error || geoError || "Unknown error"} />
    );
  }

  return (
    <>
      <div className="flex h-screen relative">
        {!isLoading && !isEmbed && (
          <>
            <AtlasShortcuts />
            <AtlasUiContainer
              svgRef={svgRef}
              selectedIsoCode={selectedIsoCode}
              setSelectedIsoCode={setSelectedIsoCode}
              hoveredIsoCode={hoveredIsoCode}
              setHoveredIsoCode={setHoveredIsoCode}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
          </>
        )}
        <div className="flex-2 flex flex-col items-stretch justify-stretch relative h-screen min-h-0">
          {!isLoading && (
            <MapUiContainer isAddingMarker={isAddingMarker} isEmbed={isEmbed} />
          )}
          <WorldMap
            onCountryClick={handleCountryClick}
            onCountryHover={handleCountryHover}
            selectedIsoCode={selectedIsoCode}
            hoveredIsoCode={hoveredIsoCode}
            onReady={handleMapReady}
            svgRef={svgRef}
            isAddingMarker={isAddingMarker}
          />
        </div>
      </div>
      {/* Splash screen */}
      {isLoading && <LoadingSpinner fullScreen message="Loading map..." />}
    </>
  );
}
