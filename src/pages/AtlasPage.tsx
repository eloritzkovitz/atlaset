import { useRef, useState } from "react";
import { ErrorMessage, SplashScreen } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { useOverlays } from "@contexts/OverlayContext";
import { useCountrySelection } from "@features/atlas/countries";
import {
  WorldMap,
  useGeoData,
  useMapReady,
  useMapView,
} from "@features/atlas/map";
import { useMarkerCreation } from "@features/atlas/markers";
import { AtlasUiContainer, MapUiContainer } from "@features/atlas/ui";

export default function AtlasPage() {
  // Data state
  const { geoData, geoError, loading: geoLoading } = useGeoData();
  const { countries, loading: countriesLoading, error } = useCountryData();
  const { overlays, loading: overlaysLoading } = useOverlays();

  // Map state
  const {
    zoom,
    setZoom,
    center,
    setCenter,
    handleMoveEnd,
    centerOnCountry,
    centerOnMarker,
  } = useMapView(geoData);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  const { mapReady, handleMapReady } = useMapReady();

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
  const isLoading =
    countriesLoading || overlaysLoading || geoLoading || !mapReady;
  if (error || geoError) {
    return <ErrorMessage error={error || geoError || "Unknown error"} />;
  }

  return (
    <>
      <div className="flex h-screen bg-gray-100 relative">
        <AtlasUiContainer
          svgRef={svgRef}
          selectedIsoCode={selectedIsoCode}
          setSelectedIsoCode={setSelectedIsoCode}
          hoveredIsoCode={hoveredIsoCode}
          setHoveredIsoCode={setHoveredIsoCode}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          centerOnCountry={centerOnCountry}
          centerOnMarker={centerOnMarker}
        />
        <div className="flex-2 flex flex-col items-stretch justify-stretch relative h-screen min-h-0">
          <WorldMap
            geoData={geoData}
            zoom={zoom}
            center={center}
            setZoom={setZoom}
            setCenter={setCenter}
            handleMoveEnd={handleMoveEnd}
            onCountryClick={handleCountryClick}
            onCountryHover={handleCountryHover}
            selectedIsoCode={selectedIsoCode}
            hoveredIsoCode={hoveredIsoCode}
            onReady={handleMapReady}
            svgRef={svgRef}
            isAddingMarker={isAddingMarker}
            setSelectedCoords={(coords) => setSelectedCoords(coords)}
          />
          <MapUiContainer
            zoom={zoom}
            setZoom={setZoom}
            selectedCoords={selectedCoords}
            overlays={overlays}
            isAddingMarker={isAddingMarker}
          />
        </div>
      </div>
      {/* Splash screen */}
      {isLoading && <SplashScreen />}
    </>
  );
}
