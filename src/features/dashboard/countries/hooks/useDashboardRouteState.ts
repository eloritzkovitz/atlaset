import { useLocation } from "react-router-dom";
import { useCountryData } from "@contexts/CountryDataContext";

/**
 * Manages dashboard route state.
 * Extracts selected panel, region, subregion, and country from the current URL.
 * @returns Object containing selected panel, region, subregion, and country.
 */
export function useDashboardRouteState() {
  const { countries } = useCountryData();
  const location = useLocation();

  const pathParts = location.pathname.replace(/^\/dashboard\/?/, "").split("/");
  const selectedPanel = pathParts[0] || "countries";
  const regionParam =
    pathParts[1] && pathParts[1] !== "undefined"
      ? decodeURIComponent(pathParts[1])
      : null;
  const subregionParam =
    pathParts[2] && pathParts[2] !== "undefined"
      ? decodeURIComponent(pathParts[2])
      : null;
  const isoCodeParam =
    pathParts[3] && pathParts[3] !== "undefined"
      ? decodeURIComponent(pathParts[3])
      : null;

  const selectedRegion = regionParam
    ? countries?.find((c) => c.region.toLowerCase() === regionParam)?.region ||
      regionParam
    : null;
  const selectedSubregion = subregionParam
    ? countries?.find((c) => c.subregion.toLowerCase() === subregionParam)
        ?.subregion || subregionParam
    : null;
  const selectedIsoCode = isoCodeParam;
  const selectedCountry = countries?.find((c) => c.isoCode === selectedIsoCode);

  return {
    selectedPanel,
    selectedRegion,
    selectedSubregion,
    selectedIsoCode,
    selectedCountry,
  };
}
