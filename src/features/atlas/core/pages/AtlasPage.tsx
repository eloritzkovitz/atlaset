import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ErrorMessage, LoadingSpinner } from "@components";
import { useUI } from "@contexts/UIContext";
import { AtlasUiContainer, MapUiContainer } from "@features/atlas/ui";
import { useCountryData } from "@features/countries";
import { usePageTitle, useScreenSize } from "@hooks";
import { useAtlasShortcuts } from "../hooks/useAtlasShortcuts";
import { useCountrySelection } from "../../countries/hooks/useCountrySelection";
import { useLayers } from "../../layers/context/LayersContext";
import { useMapView } from "../../map/context/MapViewContext";
import { WorldMap } from "../../map/components/WorldMap";
import { useMarkerCreation } from "../../markers/hooks/useMarkerCreation";

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

  useAtlasShortcuts();

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

  // Ensure the countries panel is open on initial load
  useEffect(() => {
    if (!isMobile) {
      setOpenMapToolbarPanel("countries");
    }
  }, [isMobile, setOpenMapToolbarPanel]);

  // Derived state
  const isLoading =
    countriesLoading || layersLoading || geoLoading || !mapReady;

  // If there is an error loading the map or country data, display an error message
  if (error || geoError) {
    return (
      <ErrorMessage fullScreen error={error || geoError || "Unknown error"} />
    );
  }

  return (
    <>
      <div className="flex h-screen relative">
        {!isLoading && !isEmbed && (
          <AtlasUiContainer
            svgRef={svgRef}
            selectedIsoCode={selectedIsoCode}
            setSelectedIsoCode={setSelectedIsoCode}
            hoveredIsoCode={hoveredIsoCode}
            setHoveredIsoCode={setHoveredIsoCode}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
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
