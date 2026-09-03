import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";
import {
  Breadcrumbs,
  Container,
  ErrorMessage,
  HamburgerButton,
  LoadingSpinner,
} from "@components";
import { useCountryData } from "@features/countries";
import { useAuth } from "@features/user/auth";
import { useDisclosure, usePageTitle, useScreenSize } from "@hooks";
import { ExplorePanelMenu } from "../components/ExplorePanelMenu";
import { useExploreNavigation } from "../hooks/useExploreNavigation";
import { useExploreRouteState } from "../hooks/useExploreRouteState";
import { ExploreRoutes } from "../routes/ExploreRoutes";
import { getExploreBreadcrumbs } from "../utils/exploreNavigation";
import {
  translateRegionLabel,
  translateSubregionLabel,
} from "../utils/regionTranslation";
import { useExploreCountriesFilters } from "../../countries/hooks/useExploreCountriesFilters";

export default function ExplorePage() {
  const location = useLocation();
  const { ready } = useAuth();
  const {
    countries,
    currencies,
    languages: languagesMap,
    timezones,
    loading,
    error,
    subregionToRegion,
  } = useCountryData();
  const { isMobile } = useScreenSize();
  const { t: tExplore } = useTranslation("explore");
  const { t: tCountries } = useTranslation("countries");

  const panelMenu = useDisclosure();

  const languages = useMemo(() => {
    if (!languagesMap) return [];
    return Object.values(languagesMap).map((l) => ({
      ...l,
      nativeName: l.nativeName ?? l.name ?? l.code,
    }));
  }, [languagesMap]);

  const {
    selectedPanel,
    menuSelectedPanel,
    selectedRegion: routeSelectedRegion,
    selectedSubregion: routeSelectedSubregion,
    selectedIsoCode,
    selectedCountry,
    selectedLanguage,
    selectedCurrency,
    selectedTimezone,
    selectedAchievement,
  } = useExploreRouteState();

  const countryControls = useExploreCountriesFilters();

  const {
    countryNavigationScope,
    countryNavigationOrigin,
    navigateToSection,
    navigateToRegion,
    navigateToSubregion,
    navigateToCountry,
    navigateToAllCountries,
    handleCrumbClick,
    navigateBack,
  } = useExploreNavigation(
    countries,
    routeSelectedRegion ?? "all",
    routeSelectedSubregion ?? "",
  );

  const breadcrumbs = getExploreBreadcrumbs({
    selectedPanel: selectedPanel ?? "",
    selectedCountry: selectedCountry?.name ?? null,
    selectedRegion: countryControls.selectedRegion,
    selectedSubregion: countryControls.selectedSubregion,
    selectedLanguage: selectedLanguage?.name ?? null,
    selectedCurrency: selectedCurrency
      ? `${selectedCurrency.name} (${selectedCurrency.code})`
      : null,
    selectedTimezone: selectedTimezone?.code ?? null,
    selectedAchievement: selectedAchievement?.name ?? null,
    countryNavigationOrigin,
  });

  const resolveCrumbLabel = (crumb: (typeof breadcrumbs)[number]) => {
    const raw = crumb.label ?? crumb.key ?? "";
    if (crumb.labelKey) return tExplore(crumb.labelKey);
    if (crumb.key === "region")
      return translateRegionLabel(raw, tCountries, tExplore);
    if (crumb.key === "subregion")
      return translateSubregionLabel(
        raw,
        subregionToRegion,
        countryControls.selectedRegion ?? undefined,
        tCountries,
      );
    return raw;
  };

  const translatedBreadcrumbs = breadcrumbs.map((crumb) => ({
    ...crumb,
    label: resolveCrumbLabel(crumb),
  }));

  // Determine panel type for conditional rendering
  const safePanel = selectedPanel ?? "";
  const isCountryPanel =
    safePanel.startsWith("countries") ||
    ["countries", "countries/all"].includes(safePanel);
  const isCurrencyPanel = safePanel.startsWith("currencies");

  // Determine page titles
  const getCountryPanelTitle = (): string => {
    if (routeSelectedRegion === "all" || safePanel === "countries/all") {
      return tExplore("progress.allTitle");
    }

    if (selectedCountry?.name) {
      return selectedCountry.name;
    }

    if (routeSelectedSubregion && routeSelectedSubregion !== "all") {
      return translateSubregionLabel(
        routeSelectedSubregion,
        subregionToRegion,
        countryControls.selectedRegion ?? undefined,
        tCountries,
      );
    }

    if (routeSelectedRegion && routeSelectedRegion !== "all") {
      return translateRegionLabel(routeSelectedRegion, tCountries, tExplore);
    }

    return safePanel ? tExplore(`menu.${safePanel}`) : tExplore("menu.title");
  };

  const getPageTitleLabel = (): string => {
    if (isCountryPanel) return getCountryPanelTitle();
    if (isCurrencyPanel && selectedCurrency?.name) return selectedCurrency.name;

    return safePanel ? tExplore(`menu.${safePanel}`) : tExplore("menu.title");
  };

  usePageTitle(getPageTitleLabel());

  // Sync route state to filter state
  useEffect(() => {
    if (routeSelectedRegion !== countryControls.selectedRegion) {
      countryControls.setSelectedRegion(routeSelectedRegion ?? "");
    }
    if (routeSelectedSubregion !== countryControls.selectedSubregion) {
      countryControls.setSelectedSubregion(routeSelectedSubregion ?? "");
    }
  }, [
    routeSelectedRegion,
    routeSelectedSubregion,
    countryControls,
    countryControls.selectedRegion,
    countryControls.selectedSubregion,
    countryControls.setSelectedRegion,
    countryControls.setSelectedSubregion,
  ]);

  // Loading and error states
  if (loading || !ready) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage fullScreen error={error} />;

  // Redirect early if at base path /explore
  if (location.pathname === "/explore") {
    return <Navigate to="/explore/progress" replace />;
  }

  return (
    <div className="min-h-screen relative">
      {isMobile && (
        <>
          <HamburgerButton onClick={() => panelMenu.open()} />
          <ExplorePanelMenu
            open={panelMenu.isOpen}
            onClose={() => panelMenu.close()}
            selectedPanel={menuSelectedPanel}
            setSelectedPanel={navigateToSection}
          />
        </>
      )}
      <Container>
        {!isMobile && (
          <ExplorePanelMenu
            selectedPanel={menuSelectedPanel}
            setSelectedPanel={navigateToSection}
          />
        )}
        <div className="flex-1 mt-12 min-w-0">
          <Breadcrumbs
            crumbs={translatedBreadcrumbs}
            onCrumbClick={handleCrumbClick}
          />
          <ExploreRoutes
            countries={countries}
            currencies={currencies}
            languages={languages}
            timezones={timezones}
            {...countryControls}
            setSelectedRegion={navigateToRegion}
            selectedIsoCode={selectedIsoCode || ""}
            setSelectedIsoCode={navigateToCountry}
            onShowAllCountries={navigateToAllCountries}
            onSubregionChange={navigateToSubregion}
            onBack={navigateBack}
            countryNavigationScope={countryNavigationScope}
          />
        </div>
      </Container>
    </div>
  );
}
