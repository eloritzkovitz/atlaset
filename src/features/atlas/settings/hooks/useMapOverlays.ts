import { useMemo } from "react";
import { useSettings } from "@features/settings";
import type { MapOverlaySettings } from "../types";

/**
 * Manages toggleable visibility layers and overlays on the map.
 */
export function useMapOverlays() {
  const { settings, updateSettings } = useSettings();

  const overlaySettings = useMemo(() => {
    return (
      settings?.map?.overlays ?? {
        showSmallCountryOverlays: false,
        includeIntegralRegions: false,
        showHomeCountry: false,
        showVisitedCountries: false,
        showFutureVisits: false,
        showWantToVisitCountries: false,
      }
    );
  }, [settings?.map?.overlays]);

  /** Updates the map's overlay settings. */
  const updateOverlaySetting = (
    partialNextState: Partial<MapOverlaySettings>,
  ) => {
    if (!settings?.map) return;

    updateSettings({
      map: {
        ...settings.map,
        overlays: {
          ...settings.map.overlays,
          ...partialNextState,
        },
      },
    });
  };

  return {
    showSmallCountryOverlays: overlaySettings.showSmallCountryOverlays,
    setShowSmallCountryOverlays: (value: boolean) =>
      updateOverlaySetting({ showSmallCountryOverlays: value }),
    includeIntegralRegions: overlaySettings.includeIntegralRegions,
    setIncludeIntegralRegions: (value: boolean) =>
      updateOverlaySetting({ includeIntegralRegions: value }),
    showHomeCountry: overlaySettings.showHomeCountry,
    setShowHomeCountry: (value: boolean) =>
      updateOverlaySetting({ showHomeCountry: value }),
    showVisitedCountries: overlaySettings.showVisitedCountries,
    setShowVisitedCountries: (value: boolean) =>
      updateOverlaySetting({ showVisitedCountries: value }),
    showFutureVisits: overlaySettings.showFutureVisits,
    setShowFutureVisits: (value: boolean) =>
      updateOverlaySetting({ showFutureVisits: value }),
    showWantToVisitCountries: overlaySettings.showWantToVisitCountries,
    setShowWantToVisitCountries: (value: boolean) =>
      updateOverlaySetting({ showWantToVisitCountries: value }),
  };
}
