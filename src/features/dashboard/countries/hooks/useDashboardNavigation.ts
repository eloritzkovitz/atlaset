import { useState } from "react";
import { useCountryData } from "@contexts/CountryDataContext";

/**
 * Manages dashboard navigation state and handlers.
 * @param countries - List of all countries
 * @returns Navigation state and handlers
 */
export function useDashboardNavigation() {
  const { countries } = useCountryData();
 
  // State for selected panel, region, subregion, and country
  const [selectedPanel, setSelectedPanel] = useState("countries");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSubregion, setSelectedSubregion] = useState<string | null>(
    null
  );
  const [selectedIsoCode, setSelectedIsoCode] = useState<string | null>(null);

  const selectedCountry = countries?.find((c) => c.isoCode === selectedIsoCode);

  // Reset region/subregion/country when switching panels
  const handlePanelChange = (key: string) => {
    setSelectedPanel(key);
    setSelectedRegion(null);
    setSelectedSubregion(null);
    setSelectedIsoCode(null);
  };

  // Handle selecting a country
  const handleCountrySelect = (isoCode: string | null) => {
    setSelectedIsoCode(isoCode);
    if (isoCode) {
      const country = countries?.find((c) => c.isoCode === isoCode);
      if (country) {
        setSelectedRegion(country.region);
        setSelectedSubregion(country.subregion);
      }
    }
  };

  // Handle selecting a region
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setSelectedSubregion(null);
    setSelectedIsoCode(null);
  };
  
  // Handle selecting a subregion
  const handleSubregionSelect = (region: string, subregion: string) => {
    setSelectedRegion(region);
    setSelectedSubregion(subregion);
    setSelectedIsoCode(null);
  };

  // Show all countries (reset region, subregion, country)
  const handleShowAllCountries = () => {
    setSelectedRegion("All Countries");
    setSelectedSubregion(null);
    setSelectedIsoCode(null);
  };

  // Handle breadcrumb click navigation
  const handleCrumbClick = (key: string) => {
    if (key === "dashboard") {
      setSelectedPanel("countries");
      setSelectedRegion(null);
      setSelectedSubregion(null);
      setSelectedIsoCode(null);
    } else if (key === "countries") {
      setSelectedRegion("All Countries");
      setSelectedSubregion(null);
      setSelectedIsoCode(null);
    } else if (key === "region") {
      setSelectedSubregion(null);
      setSelectedIsoCode(null);
    } else if (key === "subregion") {
      setSelectedIsoCode(null);
    } else if (key === "country") {
      // No-op
    } else {
      handlePanelChange(key);
    }
  };

  return {
    selectedPanel,
    setSelectedPanel: handlePanelChange,
    selectedRegion,
    setSelectedRegion: handleRegionSelect,
    selectedSubregion,
    setSelectedSubregion: handleSubregionSelect,
    selectedIsoCode,
    setSelectedIsoCode: handleCountrySelect,
    selectedCountry,
    handleShowAllCountries,
    handleCrumbClick,
  };
}
