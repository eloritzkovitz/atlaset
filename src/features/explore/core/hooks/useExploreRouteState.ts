import { useLocation } from "react-router-dom";
import { useGetAchievementsQuery } from "@features/achievements/api/achievementsApi";
import { useCountryData } from "@features/countries";
import { parseExplorePath } from "../utils/exploreNavigation";

/**
 * Manages explore route state.
 * Extracts selected panel, region, subregion, and entities from the current URL.
 */
export function useExploreRouteState() {
  const { data: achievements } = useGetAchievementsQuery();
  const { countries, countryByIsoCode, currencies, languages, timezones } =
    useCountryData();
  const location = useLocation();

  const { panel, entity, parts, selectedPanel, menuSelectedPanel } =
    parseExplorePath(location.pathname);

  const isCountryRoute = panel === "countries";

  const [rawRegion, rawSubregion, selectedIsoCode] = isCountryRoute
    ? parts.slice(1, 4).map((p) => (p ? decodeURIComponent(p) : null))
    : [null, null, null];

  // Derive matched country first
  const selectedCountry = selectedIsoCode
    ? countryByIsoCode[selectedIsoCode]
    : null;

  // Derive matched region and subregion based on the selected country or raw values
  const selectedRegion =
    rawRegion && rawRegion !== "all"
      ? selectedCountry?.region ||
        countries?.find(
          (c) => c.region.toLowerCase() === rawRegion.toLowerCase(),
        )?.region ||
        rawRegion
      : null;

  const selectedSubregion = rawSubregion
    ? selectedCountry?.subregion ||
      countries?.find(
        (c) => c.subregion?.toLowerCase() === rawSubregion.toLowerCase(),
      )?.subregion ||
      rawSubregion
    : null;

   // Determine the entity for the current route based on the selected panel
  const routeEntity =
    panel === selectedPanel || selectedPanel.startsWith(`${panel}/`)
      ? entity
      : null;

  const selectedLanguage =
    panel === "languages" && routeEntity
      ? (languages[routeEntity] ?? null)
      : null;

  const selectedCurrency =
    panel === "currencies" && routeEntity
      ? (currencies.find((currency) => currency.code === routeEntity) ?? null)
      : null;

  const selectedTimezone =
    panel === "timezones" && routeEntity
      ? (timezones.find(
          (timezone) => timezone.code === decodeURIComponent(routeEntity),
        ) ?? null)
      : null;

  const selectedAchievement =
    menuSelectedPanel === "achievements" && routeEntity
      ? (achievements?.find((a) => a.id === routeEntity) ?? null)
      : null;

  return {
    selectedPanel,
    menuSelectedPanel,
    selectedRegion,
    selectedSubregion,
    selectedIsoCode,
    selectedCountry,
    selectedLanguage,
    selectedCurrency,
    selectedTimezone,
    selectedAchievement,
  };
}
