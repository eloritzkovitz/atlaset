import { useLocation } from "react-router-dom";
import { useCountryData } from "@features/countries";
import { parseDashboardPath } from "../utils/dashboardNavigation";
import { useGetAchievementsQuery } from "../../achievements/api/achievementsApi";

/**
 * Manages dashboard route state.
 * Extracts selected panel, region, subregion, and entities from the current URL.
 */
export function useDashboardRouteState() {
  const { countries, currencies, languages } = useCountryData();
  const { data: achievements } = useGetAchievementsQuery();
  const location = useLocation();

  const { root, sub, parts, selectedPanel, menuSelectedPanel } =
    parseDashboardPath(location.pathname);

  // Determine if the current route is a country route
  const isCountryRoute =
    root === "countries" && !["exploration", "all"].includes(sub);
  const [rawRegion, rawSubregion, selectedIsoCode] = isCountryRoute
    ? parts.slice(1, 4).map((p) => (p ? decodeURIComponent(p) : null))
    : [null, null, null];

  // Derive matched country first
  const selectedCountry = selectedIsoCode
    ? countries?.find((c) => c.isoCode === selectedIsoCode)
    : null;

  // Derive region & subregion names (prefer exact match from found country, else search list)
  const selectedRegion = rawRegion
    ? selectedCountry?.region ||
      countries?.find((c) => c.region.toLowerCase() === rawRegion.toLowerCase())
        ?.region ||
      rawRegion
    : null;

  const selectedSubregion = rawSubregion
    ? selectedCountry?.subregion ||
      countries?.find(
        (c) => c.subregion?.toLowerCase() === rawSubregion.toLowerCase(),
      )?.subregion ||
      rawSubregion
    : null;

  // Determine the entity parameter based on the selected panel and root
  const entityParam =
    root === selectedPanel || selectedPanel.startsWith(`${root}/`) ? sub : null;

  // Language
  let selectedLanguage = null;
  if (root === "languages" && entityParam) {
    if (Array.isArray(languages)) {
      selectedLanguage = languages.find((l) => l.code === entityParam) || null;
    } else if (languages && typeof languages === "object") {
      selectedLanguage = languages[entityParam] || null;
    }
  }

  // Currency
  const selectedCurrency =
    root === "currencies" && entityParam
      ? currencies?.find((cur) => cur.code === entityParam)
      : null;

  // Achievement
  const achievementIdParam = root === "achievements" ? entityParam : null;
  const selectedAchievement = achievementIdParam
    ? achievements?.find((a) => a.id === achievementIdParam)
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
    achievementIdParam,
    selectedAchievement,
  };
}
