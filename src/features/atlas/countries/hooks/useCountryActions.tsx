import { useTranslation } from "react-i18next";
import { FaWikipediaW } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
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
  disabled?: boolean;
}

interface UseCountryActionsProps {
  country: Country | null;
  onCountryInfo?: (country: Country) => void;
  onCloseMenu?: () => void;
  onClosePanel?: () => void;
}

/**
 * Manages and returns a list of action configurations for a given country.
 * @param country - The country for which to generate actions.
 * @param onCloseMenu - A function to close the action menu.
 * @param onClosePanel - Optional callback to close the parent panel when an action is triggered.
 * @returns An array of action configurations, each containing an id, label, ariaLabel, icon, and onClick handler.
 */
export function useCountryActions({
  country,
  onCountryInfo,
  onCloseMenu,
  onClosePanel,
}: UseCountryActionsProps): Record<string, CountryActionConfig> {
  const { centerOnCountry } = useMapView();
  const navigate = useNavigate();
  const { t } = useTranslation("atlas");
  const { current: lang } = useLanguage();
  const {
    isCountryVisited,
    isTripBased,
    addManualCountry,
    removeManualCountry,
  } = useVisitedCountries();

  // If no country is provided, return an empty array of actions
  if (!country) return {};

  const visited = isCountryVisited(country.isoCode);
  const tripBased = isTripBased(country.isoCode);

  // Wrap actions to ensure the menu closes before executing the action
  const closeMenuAndCall = createCloseMenuAndCall((openState) => {
    if (!openState && onCloseMenu) onCloseMenu();
  });

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
    viewDashboard: {
      label: t("countries.actions.viewDashboard"),
      ariaLabel: t("countries.actions.viewDashboard"),
      icon: <ICONS.exploration />,
      onClick: () => {
        closeMenuAndCall(() => {
          onClosePanel?.();
          navigate(
            `/dashboard/countries/${country.region}/${country.subregion}/${country.isoCode}`,
          );
        });
      },
    },
    wikipedia: {
      label: t("countries.actions.wikipedia"),
      ariaLabel: t("countries.actions.wikipedia"),
      icon: <FaWikipediaW />,
      onClick: () => {
        closeMenuAndCall(() => {
          const langSubtag = (lang || "en").split("-")[0];
          const page = country.name.replace(/ /g, "_");
          const url = `https://${langSubtag}.wikipedia.org/wiki/${encodeURIComponent(page)}`;
          window.open(url, "_blank", "noopener,noreferrer");
        });
      },
    },
  };
}
