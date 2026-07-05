import { useMemo } from "react";
import { useCountryColors } from "@features/atlas/shared";
import { useLayerColors } from "@features/atlas/settings";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import type { LayerItem } from "../types";

const TRACKING_LAYER_ID = "tracking";

/**
 * Generates tracking layer items based on the user's visit data.
 * @returns Array of tracking layer items with isoCode, color, and layerId.
 */
export function useTrackingLayerItems() {
  const { homeCountry } = useHomeCountry();
  const { visitedCountryCodes, futureCountryCodes, wantToVisitCountryCodes } =
    useVisitedCountries();
  const {
    colorHomeCountry,
    colorVisitedCountries,
    colorFutureVisits,
    colorWantToVisitCountries,
  } = useLayerColors();
  const {
    HOME_COUNTRY_COLOR,
    VISITED_COUNTRY_COLOR,
    FUTURE_VISIT_COUNTRY_COLOR,
    SELECTED_COUNTRY_COLOR,
  } = useCountryColors();

  const visitedSet = useMemo(
    () =>
      new Set((visitedCountryCodes || []).map((code) => code.toUpperCase())),
    [visitedCountryCodes],
  );
  const futureSet = useMemo(
    () => new Set((futureCountryCodes || []).map((code) => code.toUpperCase())),
    [futureCountryCodes],
  );
  const wantToVisitSet = useMemo(
    () =>
      new Set(
        (wantToVisitCountryCodes || []).map((code) => code.toUpperCase()),
      ),
    [wantToVisitCountryCodes],
  );

  return useMemo(() => {
    const items: LayerItem[] = [];
    const allCountryCodes = new Set<string>([
      ...visitedSet,
      ...futureSet,
      ...wantToVisitSet,
      ...(homeCountry ? [homeCountry.toUpperCase()] : []),
    ]);

    for (const isoCode of allCountryCodes) {
      let color: string | undefined;
      let layerId = TRACKING_LAYER_ID;

      if (
        colorHomeCountry &&
        homeCountry &&
        isoCode === homeCountry.toUpperCase()
      ) {
        color = HOME_COUNTRY_COLOR;
        layerId = `${TRACKING_LAYER_ID}-home`;
      } else if (colorFutureVisits && futureSet.has(isoCode)) {
        color = FUTURE_VISIT_COUNTRY_COLOR;
        layerId = `${TRACKING_LAYER_ID}-future`;
      } else if (colorVisitedCountries && visitedSet.has(isoCode)) {
        color = VISITED_COUNTRY_COLOR;
        layerId = `${TRACKING_LAYER_ID}-visited`;
      } else if (colorWantToVisitCountries && wantToVisitSet.has(isoCode)) {
        color = SELECTED_COUNTRY_COLOR;
        layerId = `${TRACKING_LAYER_ID}-want-to-visit`;
      }

      if (!color) continue;

      items.push({
        isoCode,
        color,
        layerId,
      });
    }

    return items;
  }, [
    HOME_COUNTRY_COLOR,
    FUTURE_VISIT_COUNTRY_COLOR,
    SELECTED_COUNTRY_COLOR,
    VISITED_COUNTRY_COLOR,
    colorFutureVisits,
    colorHomeCountry,
    colorVisitedCountries,
    colorWantToVisitCountries,
    futureSet,
    homeCountry,
    visitedSet,
    wantToVisitSet,
  ]);
}
