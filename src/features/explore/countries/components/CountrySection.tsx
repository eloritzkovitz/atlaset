import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFlag } from "react-icons/fa6";
import { PiGlobeStandFill } from "react-icons/pi";
import {
  ActionButton,
  SearchInput,
  SelectInput,
  ToolbarToggleGroup,
  ViewModeSegmentedControl,
} from "@components";
import { ICONS } from "@constants/icons";
import {
  CountryDisplayPanel,
  CountrySortSelect,
  filterCountries,
  sortCountries,
  useCountryData,
  type Country,
} from "@features/countries";
import { buildVisitContext } from "@features/visits/utils/visits";
import { useSort } from "@hooks";
import type { ViewMode } from "@types";
import { canonicalKey } from "@utils";
import type { ExploreCountryViewControls } from "@features/explore/core/types";

interface CountrySectionProps extends ExploreCountryViewControls {
  countries: Country[];
  visitedCountryCodes: string[];
  selectedIsoCode: string | null;
  setSelectedIsoCode: (isoCode: string | null) => void;
  onSubregionChange?: (region: string, subregion: string) => void;
  initialView?: ViewMode;
  className?: string;
}

export function CountrySection({
  countries,
  visitedCountryCodes,
  selectedIsoCode,
  setSelectedIsoCode,
  search,
  setSearch,
  selectedRegion,
  setSelectedRegion,
  selectedSubregion,
  setSelectedSubregion,
  selectedSovereignOnly,
  setSelectedSovereignOnly,
  showVisitedOnly,
  setShowVisitedOnly,
  showTranscontinental,
  setShowTranscontinental,
  onSubregionChange,
  onShowAllCountries,
  resetFilters,
  initialView = "grid",
  className = "",
}: CountrySectionProps) {
  const { subregionsByRegion, subregionToRegion } = useCountryData();
  const { t: tAtlas } = useTranslation("atlas");
  const { t: tCommon } = useTranslation("common");
  const { t: tCountries } = useTranslation("countries");
  const { t: tExplore } = useTranslation("explore");

  const [viewMode, setViewMode] = useState<ViewMode>(initialView);

  const normalizedRegion =
    selectedRegion && selectedRegion !== "all" ? selectedRegion : undefined;

  const normalizedSubregion =
    selectedSubregion && selectedSubregion !== "all"
      ? selectedSubregion
      : undefined;

  // Get unique regions from both the region mapping and country data
  const uniqueRegions = Array.from(
    new Set([
      ...Object.keys(subregionsByRegion),
      ...countries.map((country) => country.region).filter(Boolean),
    ]),
  ).sort();

  // Get subregions for the currently selected region
  const uniqueSubregions =
    selectedRegion && selectedRegion !== "all"
      ? (subregionsByRegion[selectedRegion] ?? [])
      : [];

  const regionOptions = [
    {
      value: "all",
      label: tCountries("labels.region", "Region"),
    },
    ...uniqueRegions.map((region) => ({
      value: region,
      label: tCountries(`regions.${region}`, {
        defaultValue: region,
      }),
    })),
  ];

  const subregionOptions = [
    {
      value: "all",
      label: tCountries("labels.subregion", "Subregion"),
    },
    ...uniqueSubregions.map((subregion) => {
      const regionKey =
        selectedRegion || subregionToRegion.get(subregion) || "";
      const normalized = canonicalKey(subregion);

      return {
        value: subregion,
        label: regionKey
          ? tCountries(`subregions.${regionKey}.${normalized}`, {
              defaultValue: subregion,
            })
          : subregion,
      };
    }),
  ];

  // Handler to reset all filters and route to all countries
  function handleResetFilters() {
    resetFilters?.();
    setSortBy("name-asc");
    onShowAllCountries?.();
  }

  // Handler to toggle sovereign-only filter
  const handleSovereignToggle = () =>
    setSelectedSovereignOnly?.(!selectedSovereignOnly);

  // Handler to toggle visited/all
  const handleVisitedToggle = () => {
    setShowVisitedOnly(!showVisitedOnly);
  };

  // Handler to toggle transcontinental countries
  const handleTranscontinentalToggle = () => {
    setShowTranscontinental(!showTranscontinental);
  };

  // Filter countries based on search and selected filters
  const filtered = useMemo(
    () =>
      filterCountries(countries, {
        search,
        selectedRegion: normalizedRegion,
        selectedSubregion: normalizedSubregion,
        selectedSovereignty: selectedSovereignOnly ? "sovereign" : "",
        modifiers: showTranscontinental ? { tc: "include" } : undefined,
      }),
    [
      countries,
      search,
      normalizedRegion,
      normalizedSubregion,
      showTranscontinental,
      selectedSovereignOnly,
    ],
  );

  // Further filter by visited countries if toggled
  const filteredVisited = useMemo(
    () =>
      showVisitedOnly
        ? filtered.filter((country) =>
            visitedCountryCodes.includes(country.isoCode),
          )
        : filtered,
    [filtered, showVisitedOnly, visitedCountryCodes],
  );

  const {
    sortBy,
    setSortBy,
    sortedItems: sortedCountries,
  } = useSort(
    filteredVisited,
    (items, sortBy) => sortCountries(items, sortBy, buildVisitContext([])),
    "name-asc",
  );

  return (
    <div className={className}>
      <div className="mb-4 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={tAtlas(
                "countries.searchPlaceholder",
                "Search countries",
              )}
              className="mt-1 rounded-xl"
            />

            <div className="flex flex-row gap-2 w-full">
              <SelectInput
                value={selectedRegion || "all"}
                onChange={(value) => {
                  const region = String(value);

                  if (region === "all") {
                    setSelectedRegion("all");
                    setSelectedSubregion("");
                    onShowAllCountries?.();
                  } else {
                    setSelectedRegion(region);
                    setSelectedSubregion("all");
                  }
                }}
                options={regionOptions}
                className="min-w-[110px]"
              />

              <SelectInput
                value={selectedSubregion || "all"}
                onChange={(value) => {
                  const subregion = String(value);

                  if (subregion === "all" || subregion === "") {
                    setSelectedSubregion("");

                    if (onSubregionChange && selectedRegion) {
                      onSubregionChange(selectedRegion, "");
                    }
                  } else {
                    setSelectedSubregion(subregion);

                    if (onSubregionChange && selectedRegion) {
                      onSubregionChange(selectedRegion, subregion);
                    }
                  }
                }}
                options={subregionOptions}
                disabled={!selectedRegion || selectedRegion === "all"}
                className="min-w-[240px]"
              />
            </div>
          </div>

          <div className="flex flex-row mt-1 gap-2">
            <CountrySortSelect
              value={sortBy}
              onChange={(value: string) => setSortBy(value as typeof sortBy)}
              visitedOnly={undefined}
            />

            <div className="flex flex-row gap-2 ms-auto items-center justify-end">
              <ActionButton
                onClick={handleResetFilters}
                ariaLabel={tExplore("countries.resetFilters")}
                title={tCommon("actions.resetFilters")}
                icon={<ICONS.reset />}
                variant="toggle"
                rounded
              />

              <ToolbarToggleGroup
                options={[
                  {
                    value: "sovereign",
                    icon: <FaFlag />,
                    label: tExplore("countries.showSovereignOnly"),
                    ariaLabel: selectedSovereignOnly
                      ? tExplore("countries.showAllCountries")
                      : tExplore("countries.showSovereignOnly"),
                    title: selectedSovereignOnly
                      ? tExplore("countries.showAllCountries")
                      : tExplore("countries.showSovereignOnly"),
                    checked: !!selectedSovereignOnly,
                    rounded: true,
                    onClick: handleSovereignToggle,
                  },
                  {
                    value: "visited",
                    icon: <ICONS.visitStatus.visited />,
                    label: tExplore("countries.showVisitedOnly"),
                    ariaLabel: showVisitedOnly
                      ? tExplore("countries.showAllCountries")
                      : tExplore("countries.showVisitedOnly"),
                    title: showVisitedOnly
                      ? tExplore("countries.showAllCountries")
                      : tExplore("countries.showVisitedOnly"),
                    checked: showVisitedOnly,
                    rounded: true,
                    onClick: handleVisitedToggle,
                  },
                  {
                    value: "transcontinental",
                    icon: <PiGlobeStandFill className="text-lg" />,
                    label: tExplore("countries.showTranscontinental"),
                    ariaLabel: showTranscontinental
                      ? tExplore("countries.hideTranscontinental")
                      : tExplore("countries.showTranscontinental"),
                    title: showTranscontinental
                      ? tExplore("countries.hideTranscontinental")
                      : tExplore("countries.showTranscontinental"),
                    checked: showTranscontinental,
                    rounded: true,
                    onClick: handleTranscontinentalToggle,
                  },
                ]}
                className="gap-2"
              />

              <ViewModeSegmentedControl
                viewMode={viewMode}
                onChange={setViewMode}
              />
            </div>
          </div>
        </div>
      </div>

      <CountryDisplayPanel
        countries={sortedCountries}
        visitedCountryCodes={visitedCountryCodes}
        view={viewMode}
        showFlags
        showBadges={false}
        selectedIsoCode={selectedIsoCode}
        onCountryInfo={(country) => setSelectedIsoCode(country.isoCode)}
      />
    </div>
  );
}
