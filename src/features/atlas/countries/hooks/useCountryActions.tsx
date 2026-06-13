import { useTranslation } from "react-i18next";
import { FaWikipediaW } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ICONS } from "@constants/icons";
import { useMapView } from "@contexts/MapViewContext";
import type { Country } from "@features/countries";
import { useLanguage } from "@features/settings";
import { createCloseMenuAndCall } from "@hooks";

export interface CountryActionConfig {
  id: string;
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface UseCountryActionsProps {
  country: Country;
  onCloseMenu: () => void;
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
  onCloseMenu,
  onClosePanel,
}: UseCountryActionsProps): CountryActionConfig[] {
  const { centerOnCountry } = useMapView();
  const navigate = useNavigate();
  const { t } = useTranslation("atlas");
  const { current: lang } = useLanguage();

  // Wrap actions to ensure the menu closes before executing the action
  const closeMenuAndCall = createCloseMenuAndCall((openState) => {
    if (!openState) onCloseMenu();
  });

  return [
    {
      id: "center-map",
      label: t("countries.actions.centerMap"),
      ariaLabel: t("countries.actions.centerMap"),
      icon: <ICONS.center />,
      onClick: () => {
        closeMenuAndCall(() => {
          if (centerOnCountry) centerOnCountry(country.isoCode);
        });
      },
    },
    {
      id: "view-dashboard",
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
    {
      id: "wikipedia",
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
  ];
}
