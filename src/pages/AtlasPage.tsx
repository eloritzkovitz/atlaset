import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ErrorMessage, LoadingSpinner } from "@components";
import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useUI } from "@contexts/UIContext";
import { useCountrySelection } from "@features/atlas/countries";
import { WorldMap } from "@features/atlas/map";
import { useMarkerCreation } from "@features/atlas/markers";
import {
  AtlasShortcuts,
  AtlasUiContainer,
  MapUiContainer,
} from "@features/atlas/ui";
import { useCountryData } from "@features/countries";
import { usePageTitle, useScreenSize } from "@hooks";

export default function AtlasPage() {
  const { countries, loading: countriesLoading, error } = useCountryData();
  const { loading: layersLoading } = useLayers();
  const {
    geoError,
    loading: geoLoading,
    mapReady,
    handleMapReady,
    isEmbed,
  } = useMapView();
  const { isMobile } = useScreenSize();
  const { t } = useTranslation("atlas");
  const { setOpenMapToolbarPanel } = useUI();

  const svgRef = useRef<SVGSVGElement>(null);

  usePageTitle(t("pageTitle", "Atlas"));

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
  const { isAddingMarker } = useMarkerCreation();

  // Derived state
  const isLoading =
    countriesLoading || layersLoading || geoLoading || !mapReady;

  // If there is an error loading the map or country data, display an error message
  if (error || geoError) {
    return (
      <ErrorMessage fullScreen error={error || geoError || "Unknown error"} />
    );
  }

  // Ensure the countries panel is open on initial load
  useEffect(() => {
    if (!isMobile) {
      setOpenMapToolbarPanel("countries");
    }
  }, [isMobile]);

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
      {isLoading && <LoadingSpinner fullScreen message={t("map.loading")} />}
    </>
  );
}
