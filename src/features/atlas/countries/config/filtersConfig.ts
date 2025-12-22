import type { Overlay } from "@features/atlas/overlays";
import {
  SOVEREIGNTY_ORDER,  
  type CountryFilterConfig,
  type SovereigntyType,
} from "@features/countries";
import type { FilterConfig, FilterOption } from "@types";
import { mapOptions } from "@utils/array";
import { createSelectFilter } from "@utils/filter";
import { capitalize, capitalizeWords } from "@utils/string";

// "All" option constant
const allOption: FilterOption = { value: "all", label: "All" };

interface CountryFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedSovereignty: string;
  setSelectedSovereignty: (sovereignty: string) => void;
}

// Core filters configuration array
export const coreFiltersConfig: CountryFilterConfig<
  string,
  CountryFilterProps
>[] = [
  createSelectFilter(
    "region",
    "Region",
    (allRegions) => [
      allOption,
      ...mapOptions(allRegions ?? [], capitalizeWords),
    ],
    (props) => (props.selectedRegion === "" ? "all" : props.selectedRegion),
    (props, val) => props.setSelectedRegion(val)
  ),
  createSelectFilter(
    "subregion",
    "Subregion",
    (subregionOptions) => [
      allOption,
      ...mapOptions(subregionOptions ?? [], capitalizeWords),
    ],
    (props) => props.selectedSubregion,
    (props, val) => props.setSelectedSubregion(val)
  ),
  createSelectFilter(
    "sovereignty",
    "Sovereignty",
    (options) => [
      allOption,
      ...mapOptions(
        SOVEREIGNTY_ORDER.filter((type) =>
          (options as SovereigntyType[] | undefined)?.includes(type)
        ),
        capitalize
      ),
    ],
    (props) => props.selectedSovereignty,
    (props, val) => props.setSelectedSovereignty(val)
  ),
];

interface OverlayFilterProps {
  overlaySelections: Record<string, string>;
  setOverlaySelections: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

// Overlay filter configuration object
export const overlayFilterConfig: FilterConfig<
  Overlay,
  OverlayFilterProps,
  string
> = {
  key: "overlay",
  label: (overlay: Overlay) => `${overlay.name} (${overlay.countries.length})`,
  type: "select",
  getOptions: () => [
    { value: "all", label: "All" },
    { value: "only", label: "Include only" },
    { value: "exclude", label: "Exclude" },
  ],
  getValue: (props, overlay?: Overlay) =>
    overlay ? props.overlaySelections[overlay.id] || "all" : "all",
  setValue: (props, val, overlay?: Overlay) => {
    if (!overlay) return;
    props.setOverlaySelections((sel: Record<string, string>) => ({
      ...sel,
      [overlay.id]: val,
    }));
  },
};

// Timeline filter configuration object
export const timelineFiltersConfig = {
  year: {
    label: "Year",
    getValue: ({ selectedYear }: { selectedYear: number }) => selectedYear,
    setValue: (
      { setSelectedYear }: { setSelectedYear: (year: number) => void },
      value: string | number
    ) => setSelectedYear(Number(value)),
    getOptions: (years: number[]) =>
      years.map((year) => ({ value: year, label: String(year) })),
  },
  minVisitCount: {
    label: "Min Visit Count",
    getValue: ({ minVisitCount }: { minVisitCount: number }) => minVisitCount,
    setValue: (
      { setMinVisitCount }: { setMinVisitCount: (count: number) => void },
      value: string | number
    ) => setMinVisitCount(Number(value)),
    getOptions: (max: number) =>
      Array.from({ length: max }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      })),
  },
  maxVisitCount: {
    label: "Max Visit Count",
    getValue: ({ maxVisitCount }: { maxVisitCount: number }) => maxVisitCount,
    setValue: (
      { setMaxVisitCount }: { setMaxVisitCount: (count: number) => void },
      value: string | number
    ) => setMaxVisitCount(Number(value)),
    getOptions: (max: number) =>
      Array.from({ length: max }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      })),
  },
};
