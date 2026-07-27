import { useLocation } from "react-router-dom";
import { useCountryData } from "@features/countries";
import { useGetAchievementsQuery } from "../../achievements/api/achievementsApi";

/**
 * Manages dashboard route state.
 * Extracts selected panel, region, subregion, and country from the current URL.
 * @returns Object containing selected panel, region, subregion, country, currency, and achievement.
 */
export function useDashboardRouteState() {
  const { countries, currencies, languages } = useCountryData();
  const { data: achievements } = useGetAchievementsQuery();
  const location = useLocation();

  // Extract panel and parameters from URL
  const pathParts = location.pathname.replace(/^\/dashboard\/?/, "").split("/");
  let selectedPanel = pathParts[0] || "countries";

  // Handle special cases for panels with subroutes
  if (
    selectedPanel === "countries" &&
    ["exploration", "all"].includes(pathParts[1])
  ) {
    selectedPanel = `${selectedPanel}/${pathParts[1]}`;
  } else if (selectedPanel === "currencies" && pathParts[1] === "exchange") {
    selectedPanel = "currencies/exchange";
  }

  // Determine menu selected panel (for highlighting in menu)
  let menuSelectedPanel: string;
  if (selectedPanel.startsWith("countries")) {
    menuSelectedPanel = "countries";
  } else if (selectedPanel.startsWith("currencies")) {
    menuSelectedPanel = "currencies";
  } else {
    menuSelectedPanel = selectedPanel;
  }

  // Inline extraction for region, subregion, isoCode
  const [region, subregion, isoCode] = pathParts
    .slice(1, 4)
    .map((p) =>
      p && !["exploration", "all"].includes(pathParts[1])
        ? decodeURIComponent(p)
        : null,
    );
  const selectedRegion = region
    ? countries?.find((c) => c.region.toLowerCase() === region)?.region ||
      region
    : null;
  const selectedSubregion = subregion
    ? countries?.find(
        (c) => c.subregion && c.subregion.toLowerCase() === subregion,
      )?.subregion || subregion
    : null;
  const selectedIsoCode = isoCode;
  const selectedCountry = countries?.find((c) => c.isoCode === selectedIsoCode);

  // Inline extraction for language
  const languageParam =
    (selectedPanel === "languages" && pathParts[1]) ||
    (selectedPanel.startsWith("languages/") && pathParts[1]) ||
    null;
  let selectedLanguage = null;
  if (languageParam) {
    if (Array.isArray(languages)) {
      selectedLanguage =
        languages.find((l) => l.code === languageParam) || null;
    } else if (languages && typeof languages === "object") {
      selectedLanguage = languages[languageParam] || null;
    }
  }

  // Inline extraction for currency
  const currencyParam =
    (selectedPanel === "currencies" && pathParts[1]) ||
    (selectedPanel.startsWith("currencies/") && pathParts[1]) ||
    null;
  const selectedCurrency = currencies?.find(
    (cur) => cur.code === currencyParam,
  );

  // Inline extraction for achievement
  const achievementIdParam =
    selectedPanel === "achievements" && pathParts[1] ? pathParts[1] : null;
  const selectedAchievement = achievements?.find(
    (a) => a.id === achievementIdParam,
  );

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
