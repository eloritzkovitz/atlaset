import { useState } from "react";
import type { Country } from "@types";

/**
 * Manages country selection and hover states.
 * @param countries List of all countries.
 * @returns Object containing selected and hovered country states and handlers.
 */
export function useCountrySelection(countries: Country[]) {
  const [selectedIsoCode, setSelectedIsoCode] = useState<string | null>(null);
  const [hoveredIsoCode, setHoveredIsoCode] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Handle country click to open modal
  function handleCountryClick(countryIsoCode: string | null) {
    const country = countries.find((c) => c.isoCode === countryIsoCode);
    if (country) setSelectedCountry(country);
  }

  // Handle country hover
  const handleCountryHover = (isoCode: string | null) => {
    setHoveredIsoCode(isoCode);
  };

  return {
    selectedIsoCode,
    setSelectedIsoCode,
    hoveredIsoCode,
    setHoveredIsoCode,
    selectedCountry,
    setSelectedCountry,
    handleCountryClick,
    handleCountryHover,
  };
}
