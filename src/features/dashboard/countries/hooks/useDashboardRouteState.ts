import { useLocation } from "react-router-dom";
import { useCountryData } from "@features/countries";

/**
 * Manages dashboard route state.
 * Extracts selected panel, region, subregion, and country from the current URL.
 * @returns Object containing selected panel, region, subregion, and country.
 */
export function useDashboardRouteState() {
  const { countries } = useCountryData();
  const location = useLocation();

  const pathParts = location.pathname.replace(/^\/dashboard\/?/, "").split("/");

  let selectedPanel = pathParts[0] || "countries";
  if (
    (selectedPanel === "countries" || selectedPanel === "trips") &&
    pathParts[1] &&
    ["overview", "history", "month", "year", "all"].includes(pathParts[1])
  ) {
    selectedPanel = `${selectedPanel}/${pathParts[1]}`;
  }

  const isCountriesPanel = selectedPanel.startsWith("countries");

  // Normalized for menu selection only
  let menuSelectedPanel = selectedPanel;
  if (isCountriesPanel && selectedPanel !== "countries/overview") {
    menuSelectedPanel = "countries/overview";
  }

  const regionParam =
    isCountriesPanel &&
    pathParts[1] &&
    !["overview", "all"].includes(pathParts[1])
      ? decodeURIComponent(pathParts[1])
      : null;
  const subregionParam =
    isCountriesPanel &&
    pathParts[2] &&
    !["overview", "all"].includes(pathParts[1])
      ? decodeURIComponent(pathParts[2])
      : null;
  const isoCodeParam =
    isCountriesPanel &&
    pathParts[3] &&
    !["overview", "all"].includes(pathParts[1])
      ? decodeURIComponent(pathParts[3])
      : null;

  const selectedRegion = regionParam
    ? countries?.find((c) => c.region.toLowerCase() === regionParam)?.region ||
      regionParam
    : null;
  const selectedSubregion = subregionParam
    ? countries?.find(
        (c) => c.subregion && c.subregion.toLowerCase() === subregionParam
      )?.subregion || subregionParam
    : null;
  const selectedIsoCode = isoCodeParam;
  const selectedCountry = countries?.find((c) => c.isoCode === selectedIsoCode);

  return {
    selectedPanel,
    menuSelectedPanel,
    selectedRegion,
    selectedSubregion,
    selectedIsoCode,
    selectedCountry,
  };
}
