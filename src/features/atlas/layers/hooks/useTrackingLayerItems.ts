import { useMemo } from "react";
import { useMapColors } from "@features/atlas/settings";
import { useMapTheme } from "@features/atlas/shared";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import { type Country, type CountryList } from "@features/countries";
import type { LayerItem } from "../types";

const TRACKING_LAYER_ID = "tracking";
const CUSTOM_LIST_LAYER_ID = "custom-list";

interface UseTrackingLayerItemsFilters {
  visitedOnly?: boolean;
  wantToVisitOnly?: boolean;
  selectedListId?: string | null;
  countryLists?: CountryList[];
  filteredCountries?: Country[];
}

/**
 * Generates tracking layer items based on the user's visit data.
 * @param filters - Optional filters to customize the returned tracking layer items.
 * @returns Array of tracking layer items with isoCode, color, and layerId.
 */
export function useTrackingLayerItems(filters?: UseTrackingLayerItemsFilters) {
  const { homeCountry } = useHomeCountry();
  const { visitedCountryCodes, futureCountryCodes, wantToVisitCountryCodes } =
    useVisitedCountries();
  const colors = useMapColors();
  const theme = useMapTheme();

  return useMemo(() => {
    const selectedId = filters?.selectedListId;

    const filteredSet = new Set(
      (filters?.filteredCountries || []).map((c) => c.isoCode.toUpperCase()),
    );

    // Helper function to bulk map an array of codes to LayerItems
    const mapCodesToLayer = (
      codes: string[],
      color: string,
      layerId: string,
    ): LayerItem[] =>
      codes
        .map((code) => code.toUpperCase())
        .filter((code) => filteredSet.has(code))
        .map((code) => ({ isoCode: code, color, layerId }));

    // Handle Visited Toggle Case
    if (filters?.visitedOnly || selectedId === "VISITED_COUNTRIES") {
      return colors.colorVisitedCountries
        ? mapCodesToLayer(
            visitedCountryCodes || [],
            theme.VISITED_COUNTRY_COLOR,
            `${TRACKING_LAYER_ID}-visited`,
          )
        : [];
    }

    // Handle Want-to-visit Toggle Case
    if (filters?.wantToVisitOnly || selectedId === "WANT_TO_VISIT") {
      return colors.colorWantToVisitCountries
        ? mapCodesToLayer(
            wantToVisitCountryCodes || [],
            theme.SELECTED_COUNTRY_COLOR,
            `${TRACKING_LAYER_ID}-want-to-visit`,
          )
        : [];
    }

    // Handle Custom List Case
    if (selectedId) {
      const activeList = filters?.countryLists?.find(
        (l) => l.id === selectedId,
      );
      return activeList?.countryCodes
        ? mapCodesToLayer(
            activeList.countryCodes,
            theme.SELECTED_COUNTRY_COLOR,
            `${CUSTOM_LIST_LAYER_ID}-${selectedId}`,
          )
        : [];
    }

    // Default case: combine all tracking layers
    const items: LayerItem[] = [];
    const visitedSet = new Set(
      (visitedCountryCodes || []).map((c) => c.toUpperCase()),
    );
    const futureSet = new Set(
      (futureCountryCodes || []).map((c) => c.toUpperCase()),
    );
    const wantToVisitSet = new Set(
      (wantToVisitCountryCodes || []).map((c) => c.toUpperCase()),
    );

    const allCountryCodes = new Set<string>([
      ...visitedSet,
      ...futureSet,
      ...wantToVisitSet,
      ...(homeCountry ? [homeCountry.toUpperCase()] : []),
    ]);

    // Determine if any global filters are applied that would shrink the set of countries
    const isGloballyFiltering = Boolean(
      filters?.filteredCountries &&
      filters.filteredCountries.length > 0 &&
      filters.filteredCountries.length < allCountryCodes.size,
    );

    // Loop through all unique country codes and assign colors based on priority
    for (const isoCode of allCountryCodes) {
      // Only check the filteredSet if the user has actually applied an active filter
      if (isGloballyFiltering && !filteredSet.has(isoCode)) {
        continue;
      }

      if (
        colors.colorHomeCountry &&
        homeCountry &&
        isoCode === homeCountry.toUpperCase()
      ) {
        items.push({
          isoCode,
          color: theme.HOME_COUNTRY_COLOR,
          layerId: `${TRACKING_LAYER_ID}-home`,
        });
      } else if (colors.colorFutureVisits && futureSet.has(isoCode)) {
        items.push({
          isoCode,
          color: theme.FUTURE_VISIT_COUNTRY_COLOR,
          layerId: `${TRACKING_LAYER_ID}-future`,
        });
      } else if (colors.colorVisitedCountries && visitedSet.has(isoCode)) {
        items.push({
          isoCode,
          color: theme.VISITED_COUNTRY_COLOR,
          layerId: `${TRACKING_LAYER_ID}-visited`,
        });
      } else if (
        colors.colorWantToVisitCountries &&
        wantToVisitSet.has(isoCode)
      ) {
        items.push({
          isoCode,
          color: theme.SELECTED_COUNTRY_COLOR,
          layerId: `${TRACKING_LAYER_ID}-want-to-visit`,
        });
      }
    }

    return items;
  }, [
    filters?.visitedOnly,
    filters?.wantToVisitOnly,
    filters?.selectedListId,
    filters?.countryLists,
    filters?.filteredCountries,
    visitedCountryCodes,
    futureCountryCodes,
    wantToVisitCountryCodes,
    homeCountry,
    colors,
    theme,
  ]);
}
