import { useTranslation } from "react-i18next";
import { FaWikipediaW } from "react-icons/fa6";
import { ICONS } from "@constants/icons";
import { useMapView } from "@contexts/MapViewContext";
import type { Country } from "@features/countries";
import { useLanguage } from "@features/settings";
import { useVisitedCountries } from "@features/visits";
import { createCloseMenuAndCall } from "@hooks";

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
  const { centerOnCountry } = useMapView();
  const { t } = useTranslation("atlas");
  const { current: lang } = useLanguage();
  const {
    isVisitedCountry,
    isTripBased,
    isWantToVisitCountry,
    addManualCountry,
    removeManualCountry,
    addWantToVisitCountry,
    removeWantToVisitCountry,
  } = useVisitedCountries();

  // If no country is provided, return an empty array of actions
  if (!country) return {};

  const visited = isVisitedCountry(country.isoCode);
  const tripBased = isTripBased(country.isoCode);
  const wantToVisitListed = isWantToVisitCountry(country.isoCode);

  // Wrap actions to ensure the menu closes before executing the action
  const closeMenuAndCall = createCloseMenuAndCall((openState) => {
    if (!openState && onCloseMenu) onCloseMenu();
  });

  // Construct URLs
  const dashboardUrl = `/dashboard/countries/${country.region}/${country.subregion}/${country.isoCode}`;
  const langSubtag = (lang || "en").split("-")[0];
  const page = country.name.replace(/ /g, "_");
  const wikipediaUrl = `https://${langSubtag}.wikipedia.org/wiki/${encodeURIComponent(page)}`;

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
      icon: wantToVisitListed ? <ICONS.remove /> : <ICONS.favorite />,
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
      icon: <ICONS.exploration />,
      url: dashboardUrl,
      onClick: () => {
        if (onCloseMenu) onCloseMenu();
      },
    },
    wikipedia: {
      label: t("countries.actions.wikipedia"),
      ariaLabel: t("countries.actions.wikipedia"),
      icon: <FaWikipediaW />,
      url: wikipediaUrl,
      onClick: () => {
        if (onCloseMenu) onCloseMenu();
      },
    },
  };
}
