import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFlag } from "react-icons/fa6";
import { PiGlobeStandFill } from "react-icons/pi";
import {
  ActionButton,
  SearchInput,
  SelectInput,
  ViewModeSegmentedControl,
} from "@components";
import { ICONS } from "@constants/icons";
import { coreFiltersConfig } from "@features/atlas/countries/config/filtersConfig";
import {
  CountryDisplayPanel,
  CountrySortSelect,
  filterCountries,
  sortCountries,
  useCountryData,
  type Country,
  type GeoType,
} from "@features/countries";
import { buildVisitContext } from "@features/visits/utils/visits";
import { useSort } from "@hooks";
import { canonicalKey } from "@utils/string";
import { ToggleButton } from "./ToggleButton";

interface CountrySectionProps {
  countries: Country[];
  visitedCountryCodes: string[];
  selectedIsoCode: string | null;
  setSelectedIsoCode: (isoCode: string | null) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedShowSovereignOnly?: boolean;
  search: string;
  setSearch: (search: string) => void;
  initialView?: "grid" | "list";
  className?: string;
  onAllCountries?: () => void;
  onShowSovereignOnly?: (v: boolean) => void;
  onSubregionChange?: (region: string, subregion: string) => void;
  resetFilters?: () => void;
}

export function CountrySection({
  countries,
  visitedCountryCodes,
  selectedIsoCode,
  setSelectedIsoCode,
  selectedRegion,
  setSelectedRegion,
  selectedSubregion,
  setSelectedSubregion,
  selectedShowSovereignOnly,
  search,
  setSearch,
  initialView = "grid",
  className = "",
  onAllCountries,
  onShowSovereignOnly,
  onSubregionChange,
  resetFilters,
}: CountrySectionProps) {
  const { t: tDashboard } = useTranslation("dashboard");

  const normalizedRegion =
    !selectedRegion || selectedRegion === "all" ? undefined : selectedRegion;
  const normalizedSubregion =
    !selectedSubregion || selectedSubregion === "all"
      ? undefined
      : selectedSubregion;
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialView);
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);
  const [showTranscontinental, setShowTranscontinental] = useState(false);

  // Generate options for region and subregion filters
  const regionSelectFilter = coreFiltersConfig.find((f) => f.key === "region")!;
  const subregionSelectFilter = coreFiltersConfig.find(
    (f) => f.key === "subregion",
  )!;

  // Get subregions for the currently selected region
  const { subregionsByRegion, subregionToRegion } = useCountryData();
  const uniqueRegions = Array.from(
    new Set([
      ...Object.keys(subregionsByRegion),
      ...countries.map((c) => c.region).filter(Boolean),
    ]),
  ).sort();
  const uniqueSubregions =
    selectedRegion && selectedRegion !== "all"
      ? (subregionsByRegion[selectedRegion] ?? [])
      : [];

  const { t: tAtlas } = useTranslation("atlas");
  const { t: tCountries } = useTranslation("countries");

  // Generate options using filter config functions and translate labels
  const regionBaseOptions = regionSelectFilter.getOptions(uniqueRegions) ?? [];
  const subregionBaseOptions =
    subregionSelectFilter.getOptions(uniqueSubregions) ?? [];

  const regionOptions = regionBaseOptions.map((o) => ({
    ...o,
    label:
      o.value === "all"
        ? tCountries("labels.region", "Region")
        : tCountries(`regions.${String(o.value)}`, {
            defaultValue: String(o.label),
          }),
  }));

  const subregionOptions = subregionBaseOptions.map((o) => {
    const sk = String(o.value);
    const regionKey = selectedRegion || subregionToRegion.get(sk) || "";
    const normalized = canonicalKey(sk);
    return {
      ...o,
      label:
        o.value === "all"
          ? tCountries("labels.subregion", "Subregion")
          : regionKey
            ? tCountries(`subregions.${regionKey}.${normalized}`, {
                defaultValue: String(o.label),
              })
            : String(o.label),
    };
  });

  // Shared filter props for select filters
  const filterProps = {
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    selectedSovereignty: "",
    setSelectedSovereignty: () => {},
    selectedGeoType: "" as GeoType | "",
    setSelectedGeoType: (() => {}) as (v: GeoType | "") => void,
    selectedVisited: "any",
    setSelectedVisited: () => {},
  };

  // Handler to reset all filters and route to all countries
  function handleResetFilters() {
    if (resetFilters) resetFilters();
    setSortBy("name-asc");
    if (onAllCountries) onAllCountries();
  }

  // Handler to toggle sovereign only filter
  const handleSovereignToggle = () => {
    if (onShowSovereignOnly) onShowSovereignOnly(!selectedShowSovereignOnly);
  };

  // Handler to toggle visited/all
  const handleVisitedToggle = () => {
    setShowVisitedOnly((prev) => !prev);
  };

  const handleTranscontinentalToggle = () => {
    setShowTranscontinental((s) => !s);
  };

  // Filter countries based on search and visited toggle
  const filtered = useMemo(
    () =>
      filterCountries(countries, {
        search,
        selectedRegion: normalizedRegion,
        selectedSubregion: normalizedSubregion,
        selectedSovereignty: selectedShowSovereignOnly ? "sovereign" : "",
        modifiers: showTranscontinental ? { tc: "include" } : undefined,
      }),
    [
      countries,
      search,
      normalizedRegion,
      normalizedSubregion,
      showTranscontinental,
      selectedShowSovereignOnly,
    ],
  );

  // Further filter by visited countries if toggled
  const filteredVisited = useMemo(
    () =>
      showVisitedOnly
        ? filtered.filter((c) => visitedCountryCodes.includes(c.isoCode))
        : filtered,
    [filtered, showVisitedOnly, visitedCountryCodes],
  );

  // Sort state
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
                value={regionSelectFilter.getValue(filterProps) ?? ""}
                onChange={(val) => {
                  if (val === "all") {
                    setSelectedRegion("all");
                    setSelectedSubregion("");
                    if (onAllCountries) onAllCountries();
                  } else {
                    regionSelectFilter.setValue(filterProps, val as string);
                    setSelectedSubregion("all");
                  }
                }}
                options={regionOptions}
                className="min-w-[110px]"
              />
              <SelectInput
                value={subregionSelectFilter.getValue(filterProps) ?? ""}
                onChange={(val) => {
                  if (val === "all" || val === "") {
                    setSelectedSubregion("");
                    if (onSubregionChange && selectedRegion) {
                      onSubregionChange(selectedRegion, "");
                    }
                  } else {
                    subregionSelectFilter.setValue(filterProps, val as string);
                    if (onSubregionChange && selectedRegion && val) {
                      onSubregionChange(selectedRegion, val as string);
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
              onChange={(v: string) => setSortBy(v as typeof sortBy)}
              visitedOnly={undefined}
            />
            <div className="flex flex-row gap-2 ms-auto items-center justify-end">
              <ActionButton
                onClick={handleResetFilters}
                ariaLabel={tDashboard(
                  "exploration.resetFilters",
                  "Reset Filters",
                )}
                title={tDashboard("exploration.resetFilters", "Reset Filters")}
                icon={<ICONS.reset />}
                variant="toggle"
                rounded
              />
              <ToggleButton
                on={!!selectedShowSovereignOnly}
                onClick={handleSovereignToggle}
                ariaLabelOn={tDashboard(
                  "exploration.showAllCountries",
                  "Show all countries",
                )}
                ariaLabelOff={tDashboard(
                  "exploration.showSovereignOnly",
                  "Show sovereign only",
                )}
                titleOn={tDashboard(
                  "exploration.showAllCountries",
                  "Show all countries",
                )}
                titleOff={tDashboard(
                  "exploration.showSovereignOnly",
                  "Show Sovereign Only",
                )}
                iconOn={<FaFlag />}
                iconOff={<FaFlag className="text-muted" />}
              />
              <ToggleButton
                on={showVisitedOnly}
                onClick={handleVisitedToggle}
                ariaLabelOn={tDashboard(
                  "exploration.showAllCountries",
                  "Show All Countries",
                )}
                ariaLabelOff={tDashboard(
                  "exploration.showVisitedOnly",
                  "Show Visited Only",
                )}
                titleOn={tDashboard(
                  "exploration.showAllCountries",
                  "Show All Countries",
                )}
                titleOff={tDashboard(
                  "exploration.showVisitedOnly",
                  "Show Visited Only",
                )}
                iconOn={<ICONS.visitStatus.visited />}
                iconOff={<ICONS.visitStatus.visited className="text-muted" />}
              />
              <ToggleButton
                on={showTranscontinental}
                onClick={handleTranscontinentalToggle}
                ariaLabelOn={tDashboard(
                  "exploration.hideTranscontinental",
                  "Hide transcontinental countries",
                )}
                ariaLabelOff={tDashboard(
                  "exploration.showTranscontinental",
                  "Show transcontinental countries",
                )}
                titleOn={tDashboard(
                  "exploration.hideTranscontinental",
                  "Hide transcontinental countries",
                )}
                titleOff={tDashboard(
                  "exploration.showTranscontinental",
                  "Show transcontinental countries",
                )}
                iconOn={<PiGlobeStandFill className="text-lg" />}
                iconOff={<PiGlobeStandFill className="text-lg text-muted" />}
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
        showFlags={true}
        showBadges={false}
        selectedIsoCode={selectedIsoCode}
        onCountryInfo={(country) => setSelectedIsoCode(country.isoCode)}
      />
    </div>
  );
}
