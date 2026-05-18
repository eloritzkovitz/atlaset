import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import {
  Breadcrumbs,
  ErrorMessage,
  LoadingSpinner,
  HamburgerButton,
} from "@components";
import { useCountryData } from "@features/countries";
import {
  DASHBOARD_MENU,
  DashboardPanelMenu,
  DashboardRoutes,
  getDashboardMeta,
  translateRegionLabel,
  translateSubregionLabel,
  useDashboardRouteState,
  useDashboardNavigation,
  useDashboardCountriesFilters,
} from "@features/dashboard";
import { useAuth } from "@features/user";
import { usePageTitle, useScreenSize } from "@hooks";
import { isWindowDefined } from "@utils/env";

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

  // Convert languages map to array for components expecting Language[]
  const languages = (() => {
    if (!languagesMap) return [];
    return Object.values(languagesMap).map((l) => ({
      ...l,
      nativeName: l.nativeName ?? l.name ?? l.code,
    }));
  })();
  const { isMobile } = useScreenSize();
  const [panelOpen, setPanelOpen] = useState(false);

  // Full dashboard menu config
  const dashboardMenuConfig = DASHBOARD_MENU;

  // Determine current panel from URL
  const dashboardPath = isWindowDefined()
    ? window.location.pathname.replace(/^\/dashboard\//, "")
    : undefined;
  const currentPanel = dashboardMenuConfig.find(
    (item) => item.key === dashboardPath,
  );

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
    currentPanel: currentPanel ? { title: currentPanel.label } : undefined,
    selectedRegion,
    selectedSubregion,
    selectedLanguage,
    selectedCurrency,
    selectedAchievement,
  });

  // Translate breadcrumbs
  const { t: tDashboard } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const { t: tCountries } = useTranslation("countries");

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

  // Handlers for navigation and syncing URL state to filter state
  const getTranslatedLeft = () => {
    const safePanel = selectedPanel ?? "";
    const isCountryPanel =
      safePanel.startsWith("countries") ||
      ["countries", "countries/all", "exploration"].includes(safePanel);
    const isCurrencyPanel = safePanel.startsWith("currencies");
    const isAchievementPanel = safePanel.startsWith("achievements");

    if (safePanel === "exploration")
      return tDashboard("exploration.worldTitle");

    if (isCountryPanel) {
      // If route explicitly shows "all" or panel is countries/all, show translated "All Countries"
      if (routeSelectedRegion === "all" || safePanel === "countries/all")
        return tDashboard("exploration.allTitle");

      if (selectedCountry && selectedCountry.name) return selectedCountry.name;
      if (routeSelectedSubregion && routeSelectedSubregion !== "all") {
        return translateSubregionLabel(
          routeSelectedSubregion,
          subregionToRegion,
          selectedRegion ?? undefined,
          tCountries,
        );
      }
      if (routeSelectedRegion && routeSelectedRegion !== "all") {
        return translateRegionLabel(
          routeSelectedRegion,
          tCountries,
          tDashboard,
        );
      }
      // fallback to panel label
      return currentPanel
        ? tDashboard(`menu.${currentPanel.key}`)
        : tDashboard("menu.title");
    }

    if (isCurrencyPanel && selectedCurrency && selectedCurrency.name)
      return selectedCurrency.name;

    if (isAchievementPanel && selectedAchievement && selectedAchievement.name)
      return selectedAchievement.name;

    return currentPanel
      ? tDashboard(`menu.${currentPanel.key}`)
      : tDashboard("menu.title");
  };

  const left = getTranslatedLeft();
  const appName = tCommon("appName", "Atlaset");
  usePageTitle(`${left} | ${appName}`);

  // Sync route state to filter state
  useEffect(() => {
    // Only update if different, and always preserve 'all' as a valid value
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
      {/* Mobile: hamburger + drawer */}
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
      <div className="p-4 max-w-6xl mx-auto flex gap-6">
        {/* Desktop: panel */}
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
      </div>
    </div>
  );
}
