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

  // Explore route state
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
  } = useExploreRouteState();

  // Countries filter state
  const {
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    search,
    setSearch,
    selectedSovereignOnly,
    setSelectedSovereignOnly,
    resetFilters,
  } = useExploreCountriesFilters();

  const breadcrumbs = getExploreBreadcrumbs({
    selectedPanel: selectedPanel ?? "",
    selectedCountry: selectedCountry?.name ?? null,
    selectedRegion,
    selectedSubregion,
    selectedLanguage: selectedLanguage?.name ?? null,
    selectedCurrency: selectedCurrency?.name ?? null,
    selectedTimezone: selectedTimezone?.code ?? null,
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
        selectedRegion ?? undefined,
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
      return tExplore("countries.allTitle");
    }

    if (selectedCountry?.name) {
      return selectedCountry.name;
    }

    if (routeSelectedSubregion && routeSelectedSubregion !== "all") {
      return translateSubregionLabel(
        routeSelectedSubregion,
        subregionToRegion,
        selectedRegion ?? undefined,
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
    if (routeSelectedRegion !== selectedRegion) {
      setSelectedRegion(routeSelectedRegion ?? "");
    }
    if (routeSelectedSubregion !== selectedSubregion) {
      setSelectedSubregion(routeSelectedSubregion ?? "");
    }
  }, [
    routeSelectedRegion,
    routeSelectedSubregion,
    selectedRegion,
    selectedSubregion,
    setSelectedRegion,
    setSelectedSubregion,
  ]);

  // Navigation handlers
  const {
    navigateToPanel,
    navigateToRegion,
    navigateToSubregion,
    navigateToCountry,
    navigateToAllCountries,
    handleCrumbClick,
    navigateBack,
  } = useExploreNavigation(
    countries,
    selectedRegion ?? "all",
    selectedSubregion ?? "",
  );

  // Loading and error states
  if (loading || !ready) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage fullScreen error={error} />;

  // Redirect early if at base path /explore
  if (location.pathname === "/explore") {
    return <Navigate to="/explore/overview" replace />;
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
            setSelectedPanel={navigateToPanel}
          />
        </>
      )}
      <Container>
        {!isMobile && (
          <ExplorePanelMenu
            selectedPanel={menuSelectedPanel}
            setSelectedPanel={navigateToPanel}
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
            selectedRegion={selectedRegion || ""}
            setSelectedRegion={navigateToRegion}
            selectedSubregion={selectedSubregion || ""}
            setSelectedSubregion={setSelectedSubregion}
            search={search}
            setSearch={setSearch}
            selectedSovereignOnly={selectedSovereignOnly}
            setSelectedSovereignOnly={setSelectedSovereignOnly}
            selectedIsoCode={selectedIsoCode || ""}
            setSelectedIsoCode={navigateToCountry}
            onShowAllCountries={navigateToAllCountries}
            onSubregionChange={navigateToSubregion}
            onResetFilters={resetFilters}
            onBack={navigateBack}
          />
        </div>
      </Container>
    </div>
  );
}
