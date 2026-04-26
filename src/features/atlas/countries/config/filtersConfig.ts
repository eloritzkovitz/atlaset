import type { Layer } from "@features/atlas/layers";
import { type GeoType, type SovereigntyStatus } from "@features/countries";
import type { FilterConfig, FilterOption } from "@types";
import { mapOptions } from "@utils/array";
import { createSelectFilter } from "@utils/filter";
import { capitalize, capitalizeWords } from "@utils/string";

// Predefined sovereignty order for consistent dropdown ordering
export const SOVEREIGNTY_ORDER: SovereigntyStatus[] = [
  "Sovereign",
  "Dependency",
  "Overseas Region",
  "Disputed",
  "Unrecognized",
];

/** Filter keys for countries */
export type CountryFilterKey =
  | "region"
  | "subregion"
  | "geoType"
  | "sovereignty"
  | "visited"
  | "layer";

/** Configuration for country filters. */
export type CountryFilterConfig<T = string, P = unknown> = FilterConfig<
  T,
  P,
  CountryFilterKey
>;

// "All" option constant
const allOption: FilterOption = { value: "all", label: "All" };

interface CountryFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedGeoType: GeoType | "";
  setSelectedGeoType: (geoType: GeoType | "") => void;
  selectedSovereignty: string;
  setSelectedSovereignty: (sovereignty: string) => void;
  selectedVisited: string;
  setSelectedVisited: (visited: string) => void;
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
    (props, val) => props.setSelectedRegion(val === "all" ? "" : val),
  ),
  createSelectFilter(
    "subregion",
    "Subregion",
    (subregionOptions) => [
      allOption,
      ...mapOptions(subregionOptions ?? [], capitalizeWords),
    ],
    (props) =>
      props.selectedSubregion === "" ? "all" : props.selectedSubregion,
    (props, val) => props.setSelectedSubregion(val === "all" ? "" : val),
  ),
  createSelectFilter(
    "geoType",
    "Geographic Type",
    (options) => [
      allOption,
      ...mapOptions(
        (["Coastal", "Landlocked", "Island"] as GeoType[]).filter((type) =>
          (options as GeoType[] | undefined)?.includes(type),
        ),
        capitalize,
      ),
    ],
    (props) => (props.selectedGeoType === "" ? "all" : props.selectedGeoType),
      (props, val) => props.setSelectedGeoType(val === "all" ? "" : (val as GeoType)),
  ),
  createSelectFilter(
    "sovereignty",
    "Sovereignty",
    (options) => [
      allOption,
      ...mapOptions(
        SOVEREIGNTY_ORDER.filter((type) =>
          (options as SovereigntyStatus[] | undefined)?.includes(type),
        ),
        capitalize,
      ),
    ],
    (props) =>
      props.selectedSovereignty === "" ? "all" : props.selectedSovereignty,
    (props, val) => props.setSelectedSovereignty(val === "all" ? "" : val),
  ),
  {
    key: "visited",
    label: "Visit Status",
    type: "select",
    getOptions: () => [
      { value: "any", label: "All" },
      { value: "visited", label: "Visited" },
      { value: "not_visited", label: "Not Visited" },
    ],
    getValue: (props) => props.selectedVisited || "any",
    setValue: (props, val) => {
      props.setSelectedVisited(val);
    },
  },
];

interface LayerFilterProps {
  layerSelections: Record<string, string>;
  setLayerSelections: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

// Layer filter configuration object
export const layerFilterConfig: FilterConfig<Layer, LayerFilterProps, string> =
  {
    key: "layer",
    label: (layer: Layer) => `${layer.name} (${layer.countries.length})`,
    type: "select",
    getOptions: (layers?: Layer[]) => {
      const layer = layers?.[0];
      return [
        { value: "all", label: layer?.filterLabels?.all ?? "All" },
        { value: "only", label: layer?.filterLabels?.only ?? "Include only" },
        { value: "exclude", label: layer?.filterLabels?.exclude ?? "Exclude" },
      ];
    },
    getValue: (props, layer?: Layer) =>
      layer ? props.layerSelections[layer.id] || "all" : "all",
    setValue: (props, val, layer?: Layer) => {
      if (!layer) return;
      props.setLayerSelections((sel: Record<string, string>) => ({
        ...sel,
        [layer.id]: val,
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
      value: string | number,
    ) => setSelectedYear(Number(value)),
    getOptions: (years: number[]) =>
      years.map((year) => ({ value: year, label: String(year) })),
  },
  minVisitCount: {
    label: "Min Visit Count",
    getValue: ({ minVisitCount }: { minVisitCount: number }) => minVisitCount,
    setValue: (
      { setMinVisitCount }: { setMinVisitCount: (count: number) => void },
      value: string | number,
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
      value: string | number,
    ) => setMaxVisitCount(Number(value)),
    getOptions: (max: number) =>
      Array.from({ length: max }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      })),
  },
};
