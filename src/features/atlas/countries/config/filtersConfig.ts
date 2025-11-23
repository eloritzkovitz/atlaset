import { SOVEREIGNTY_ORDER } from "@features/countries";
import type { CountryFilterConfig } from "@features/countries/types";
import { mapOptions } from "@features/countries/utils/countryFilters";
import type { FilterConfig, FilterOption, Overlay, SovereigntyType } from "@types";
import { createSelectFilter } from "@utils/filter";
import { capitalize } from "@utils/string";

// "All" option constant
const allOption: FilterOption = { value: "", label: "All" };

// Core filters configuration array
export const coreFiltersConfig: CountryFilterConfig[] = [
  createSelectFilter(
    "region",
    "Region",
    (allRegions) => [allOption, ...mapOptions(allRegions ?? [])],
    (props) => props.selectedRegion,
    (props, val) => props.setSelectedRegion(val)
  ),
  createSelectFilter(
    "subregion",
    "Subregion",
    (subregionOptions) => [allOption, ...mapOptions(subregionOptions ?? [])],
    (props) => props.selectedSubregion,
    (props, val) => props.setSelectedSubregion(val)
  ),
  createSelectFilter(
    "sovereignty",
    "Sovereignty",
    (options) => [
      allOption,
      ...SOVEREIGNTY_ORDER.filter((type) =>
        (options as SovereigntyType[] | undefined)?.includes(type)
      ).map((type) => ({
        value: type,
        label: capitalize(type),
      })),
    ],
    (props) => props.selectedSovereignty,
    (props, val) => props.setSelectedSovereignty(val)
  ),
];

// Overlay filter configuration object
export const overlayFilterConfig: FilterConfig = {
  key: "overlay",
  label: (overlay: Overlay) =>
    `${overlay.name} (${overlay.countries.length})`,
  type: "select",
  getOptions: () => [
    { value: "all", label: "All" },
    { value: "only", label: "Include only" },
    { value: "exclude", label: "Exclude" },
  ],
  getValue: (props, overlay: Overlay) =>
    props.overlaySelections[overlay.id] || "all",
  setValue: (props, val, overlay: Overlay) =>
    props.setOverlaySelections((sel: Record<string, string>) => ({
      ...sel,
      [overlay.id]: val,
    })),
};
