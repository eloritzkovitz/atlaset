import { useTranslation } from "react-i18next";
import { FaWikipediaW } from "react-icons/fa6";
import { ICONS } from "@constants/icons";
import { useMapView } from "@features/atlas/map/context/MapViewContext";
import { useMarkerCreation } from "@features/atlas/markers/hooks/useMarkerCreation";
import type { Country } from "@features/countries/types";
import { getCountryRoute } from "@features/dashboard/core";
import { useLanguage } from "@features/settings";
import { useVisitedCountries } from "@features/visits";
import { createCloseMenuAndCall } from "@hooks";
import { getWikipediaUrl } from "@utils";

export interface CountryActionConfig {
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  onClick: () => void;
  url?: string;
  disabled?: boolean;
  isVisited?: boolean;
}

interface UseCountryActionsProps {
  country: Country | null;
  onCountryInfo?: (country: Country) => void;
  onCloseMenu?: () => void;
}

/**
 * Manages and returns a list of action configurations for a given country.
 * @param country - The country for which to generate actions.
 * @param onCountryInfo - A callback function to handle viewing country details.
 * @param onCloseMenu - A function to close the action menu.
 * @returns An array of action configurations, each containing an id, label, ariaLabel, icon, and onClick handler.
 */
export function useCountryActions({
  country,
  onCountryInfo,
  onCloseMenu,
}: UseCountryActionsProps): Record<string, CountryActionConfig> {
  const { current: lang } = useLanguage();
  const { centerOnCountry } = useMapView();
  const { markers, openAddMarker, openEditMarker } = useMarkerCreation();
  const {
    isVisitedCountry,
    isTripBased,
    isWantToVisitCountry,
    addManualCountry,
    removeManualCountry,
    addWantToVisitCountry,
    removeWantToVisitCountry,
  } = useVisitedCountries();

  const { t } = useTranslation("atlas");
  const { t: tCommon } = useTranslation("common");

  // If no country is provided, return an empty array of actions
  if (!country) return {};

  const visited = isVisitedCountry(country.isoCode);
  const tripBased = isTripBased(country.isoCode);
  const wantToVisitListed = isWantToVisitCountry(country.isoCode);

  // Check if the country already has a marker
  const existingMarker = markers?.find((m) => m.isoCode === country.isoCode);
  const hasMarker = !!existingMarker;

  // Wrap actions to ensure the menu closes before executing the action
  const closeMenuAndCall = createCloseMenuAndCall((openState) => {
    if (!openState && onCloseMenu) onCloseMenu();
  });

  // Construct URLs
  const dashboardUrl = getCountryRoute(
    country.region,
    country.subregion,
    country.isoCode,
  );

  return {
    viewDetails: {
      label: t("countries.actions.viewDetails"),
      ariaLabel: t("countries.actions.viewDetails"),
      icon: <ICONS.view />,
      onClick: () => {
        closeMenuAndCall(() => {
          onCountryInfo?.(country);
        });
      },
    },
    centerMap: {
      label: t("countries.actions.centerMap"),
      ariaLabel: t("countries.actions.centerMap"),
      icon: <ICONS.center />,
      onClick: () => {
        closeMenuAndCall(() => {
          centerOnCountry(country.isoCode);
        });
      },
    },
    markerAction: {
      label: hasMarker
        ? t("countries.actions.editMarker", "Edit Marker")
        : t("countries.actions.addMarker", "Add Marker"),
      ariaLabel: hasMarker
        ? t("countries.actions.editMarker", "Edit Marker")
        : t("countries.actions.addMarker", "Add Marker"),
      icon: hasMarker ? <ICONS.edit /> : <ICONS.markers />,
      onClick: () => {
        closeMenuAndCall(() => {
          if (hasMarker && existingMarker) {
            openEditMarker(existingMarker);
          } else {
            openAddMarker(country.isoCode, country.name);
          }
        });
      },
    },
    toggleVisited: {
      label: tripBased
        ? t("countries.actions.visited", "Visited")
        : visited
          ? t("countries.actions.unmarkVisited", "Unmark Visited")
          : t("countries.actions.markVisited", "Mark Visited"),
      ariaLabel: visited ? "Unmark Visited" : "Mark Visited",
      icon: visited ? (
        tripBased ? (
          <ICONS.selected />
        ) : (
          <ICONS.close className="!-mx-1 text-2xl" />
        )
      ) : (
        <ICONS.selected />
      ),
      disabled: tripBased,
      onClick: () => {
        closeMenuAndCall(async () => {
          if (visited) {
            await removeManualCountry(country.isoCode);
          } else {
            await addManualCountry(country.isoCode);
          }
        });
      },
    },
    toggleWantToVisit: {
      label: wantToVisitListed
        ? t("countries.actions.unmarkWantToVisit", "Unmark 'Want to Visit'")
        : t("countries.actions.markWantToVisit", "Mark 'Want to Visit'"),
      ariaLabel: wantToVisitListed
        ? "Unmark as Want to Visit"
        : "Mark as Want to Visit",
      icon: (
        <ICONS.favorite className={!wantToVisitListed ? "text-muted" : ""} />
      ),
      disabled: visited,
      isVisited: visited,
      onClick: () => {
        closeMenuAndCall(async () => {
          if (wantToVisitListed) {
            await removeWantToVisitCountry(country.isoCode);
          } else {
            await addWantToVisitCountry(country.isoCode);
          }
        });
      },
    },
    viewDashboard: {
      label: t("countries.actions.viewDashboard"),
      ariaLabel: t("countries.actions.viewDashboard"),
      icon: <ICONS.dashboard />,
      url: dashboardUrl,
      onClick: () => {
        if (onCloseMenu) onCloseMenu();
      },
    },
    wikipedia: {
      label: tCommon("actions.wikipedia"),
      ariaLabel: tCommon("actions.wikipedia"),
      icon: <FaWikipediaW />,
      url: getWikipediaUrl(country.name, lang),
      onClick: () => {
        if (onCloseMenu) onCloseMenu();
      },
    },
  };
}
