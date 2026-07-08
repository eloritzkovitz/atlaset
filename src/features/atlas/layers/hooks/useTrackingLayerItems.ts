import { useMemo } from "react";
import { useMapColors } from "@features/atlas/settings";
import { useMapTheme } from "@features/atlas/shared";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import { type CountryList } from "@features/countries";
import type { LayerItem } from "../types";

const TRACKING_LAYER_ID = "tracking";
const CUSTOM_LIST_LAYER_ID = "custom-list";

interface UseTrackingLayerItemsFilters {
  visitedOnly?: boolean;
  wantToVisitOnly?: boolean;
  selectedListId?: string | null;
  countryLists?: CountryList[];
}

export function useTrackingLayerItems(filters?: UseTrackingLayerItemsFilters) {
  const { homeCountry } = useHomeCountry();
  const { visitedCountryCodes, futureCountryCodes, wantToVisitCountryCodes } =
    useVisitedCountries();
  const colors = useMapColors();
  const theme = useMapTheme();

  return useMemo(() => {
    const selectedId = filters?.selectedListId;

    // Helper function to bulk map an array of codes to LayerItems
    const mapCodesToLayer = (
      codes: string[],
      color: string,
      layerId: string,
    ): LayerItem[] =>
      codes.map((code) => ({ isoCode: code.toUpperCase(), color, layerId }));

    // Handle special cases for visited, want-to-visit, and custom list selections
    if (filters?.visitedOnly || selectedId === "VISITED_COUNTRIES") {
      return colors.colorVisitedCountries
        ? mapCodesToLayer(
            visitedCountryCodes || [],
            theme.VISITED_COUNTRY_COLOR,
            `${TRACKING_LAYER_ID}-visited`,
          )
        : [];
    }

    if (filters?.wantToVisitOnly || selectedId === "WANT_TO_VISIT") {
      return colors.colorWantToVisitCountries
        ? mapCodesToLayer(
            wantToVisitCountryCodes || [],
            theme.SELECTED_COUNTRY_COLOR,
            `${TRACKING_LAYER_ID}-want-to-visit`,
          )
        : [];
    }

    // Handle custom list selection
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

    for (const isoCode of allCountryCodes) {
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
    filters,
    visitedCountryCodes,
    futureCountryCodes,
    wantToVisitCountryCodes,
    homeCountry,
    colors,
    theme,
  ]);
}
