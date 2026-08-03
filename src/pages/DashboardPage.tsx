import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import {
  Breadcrumbs,
  Container,
  ErrorMessage,
  HamburgerButton,
  LoadingSpinner,
} from "@components";
import { useCountryData } from "@features/countries";
import {
  DashboardPanelMenu,
  DashboardRoutes,
  getDashboardMeta,
  translateRegionLabel,
  translateSubregionLabel,
  useDashboardRouteState,
  useDashboardNavigation,
  useDashboardCountriesFilters,
} from "@features/dashboard";
import { useAuth } from "@features/user/auth";
import { usePageTitle, useScreenSize } from "@hooks";

export default function DashboardPage() {
  const { ready } = useAuth();
  const {
    countries,
    currencies,
    languages: languagesMap,
    loading,
    error,
    subregionToRegion,
  } = useCountryData();
  const { isMobile } = useScreenSize();
  const { t: tDashboard } = useTranslation("dashboard");
  const { t: tCountries } = useTranslation("countries");

  const [panelOpen, setPanelOpen] = useState(false);

  const languages = useMemo(() => {
    if (!languagesMap) return [];
    return Object.values(languagesMap).map((l) => ({
      ...l,
      nativeName: l.nativeName ?? l.name ?? l.code,
    }));
  }, [languagesMap]);

  // Dashboard route state
  const {
    selectedPanel,
    menuSelectedPanel,
    selectedRegion: routeSelectedRegion,
    selectedSubregion: routeSelectedSubregion,
    selectedIsoCode,
    selectedCountry,
    selectedLanguage,
    selectedCurrency,
    selectedAchievement,
  } = useDashboardRouteState();

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
  } = useDashboardCountriesFilters();

  // Build dashboard meta (title and breadcrumbs)
  const { breadcrumbs } = getDashboardMeta({
    selectedPanel,
    selectedCountry,
    selectedRegion,
    selectedSubregion,
    selectedLanguage,
    selectedCurrency,
    selectedAchievement,
  });

  const resolveCrumbLabel = (crumb: (typeof breadcrumbs)[number]) => {
    const raw = crumb.label ?? crumb.key ?? "";
    if (crumb.labelKey) return tDashboard(crumb.labelKey);
    if (crumb.key === "region")
      return translateRegionLabel(raw, tCountries, tDashboard);
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
    ["countries", "countries/all", "exploration"].includes(safePanel);
  const isCurrencyPanel = safePanel.startsWith("currencies");
  const isAchievementPanel = safePanel.startsWith("achievements");

  // Determine the left part of the page title based on the current panel and filters
  const getCountryPanelTitle = (): string => {
    if (safePanel === "exploration") {
      return tDashboard("exploration.worldTitle");
    }

    if (routeSelectedRegion === "all" || safePanel === "countries/all") {
      return tDashboard("exploration.allTitle");
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
      return translateRegionLabel(routeSelectedRegion, tCountries, tDashboard);
    }

    return safePanel
      ? tDashboard(`menu.${safePanel}`)
      : tDashboard("menu.title");
  };

  // Determine the page title based on the current panel and filters
  const getPageTitleLabel = (): string => {
    if (isCountryPanel) return getCountryPanelTitle();
    if (isCurrencyPanel && selectedCurrency?.name) return selectedCurrency.name;
    if (isAchievementPanel && selectedAchievement?.name)
      return selectedAchievement.name;

    return safePanel
      ? tDashboard(`menu.${safePanel}`)
      : tDashboard("menu.title");
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
    handlePanelChange,
    handleRegionSelect,
    handleSubregionSelect,
    handleCountrySelect,
    handleShowAllCountries,
    handleCrumbClick,
    handleBack,
  } = useDashboardNavigation(
    countries,
    selectedRegion ?? "all",
    selectedSubregion ?? "",
  );

  // Loading and error states
  if (loading || !ready)
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  if (error) return <ErrorMessage fullScreen error={error} />;

  // Redirect early if at /dashboard
  if (location.pathname === "/dashboard") {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return (
    <div className="min-h-screen relative">
      {isMobile && (
        <>
          <HamburgerButton onClick={() => setPanelOpen(true)} />
          <DashboardPanelMenu
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            selectedPanel={menuSelectedPanel}
            setSelectedPanel={handlePanelChange}
          />
        </>
      )}
      <Container>
        {!isMobile && (
          <DashboardPanelMenu
            selectedPanel={menuSelectedPanel}
            setSelectedPanel={handlePanelChange}
          />
        )}
        <div className="flex-1 mt-12 min-w-0">
          <Breadcrumbs
            crumbs={translatedBreadcrumbs}
            onCrumbClick={handleCrumbClick}
          />
          <DashboardRoutes
            countries={countries}
            currencies={currencies}
            languages={languages}
            selectedRegion={selectedRegion || ""}
            setSelectedRegion={handleRegionSelect}
            selectedSubregion={selectedSubregion || ""}
            setSelectedSubregion={setSelectedSubregion}
            search={search}
            setSearch={setSearch}
            selectedSovereignOnly={selectedSovereignOnly}
            setSelectedSovereignOnly={setSelectedSovereignOnly}
            selectedIsoCode={selectedIsoCode || ""}
            setSelectedIsoCode={handleCountrySelect}
            onShowAllCountries={handleShowAllCountries}
            onSubregionChange={handleSubregionSelect}
            onResetFilters={resetFilters}
            onBack={handleBack}
          />
        </div>
      </Container>
    </div>
  );
}
