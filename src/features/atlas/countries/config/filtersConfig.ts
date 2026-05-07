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

// "All" option constant (translation key)
const allOption: FilterOption = {
  value: "all",
  label: "common:filter.all",
};

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
    "atlas:countries.filters.core.region",
    (allRegions) => [
      allOption,
      ...mapOptions(allRegions ?? [], capitalizeWords),
    ],
    (props) => (props.selectedRegion === "" ? "all" : props.selectedRegion),
    (props, val) => props.setSelectedRegion(val === "all" ? "" : val),
  ),
  createSelectFilter(
    "subregion",
    "atlas:countries.filters.core.subregion",
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
    "atlas:countries.filters.core.geoType",
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
    (props, val) =>
      props.setSelectedGeoType(val === "all" ? "" : (val as GeoType)),
  ),
  createSelectFilter(
    "sovereignty",
    "atlas:countries.filters.core.sovereignty",
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
    label: "atlas:countries.filters.core.visitStatus",
    type: "select",
    getOptions: () => [
      { value: "any", label: "common:filter.all" },
      {
        value: "visited",
        label: "atlas:countries.filters.core.visited",
      },
      {
        value: "not_visited",
        label: "atlas:countries.filters.core.notVisited",
      },
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
        {
          value: "all",
          label: layer?.filterLabels?.all ?? "common:filter.all",
        },
        {
          value: "only",
          label: layer?.filterLabels?.only ?? "common:filter.includeOnly",
        },
        {
          value: "exclude",
          label: layer?.filterLabels?.exclude ?? "common:filter.exclude",
        },
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
    label: "atlas:countries.filters.timeline.year",
    getValue: ({ selectedYear }: { selectedYear: number }) => selectedYear,
    setValue: (
      { setSelectedYear }: { setSelectedYear: (year: number) => void },
      value: string | number,
    ) => setSelectedYear(Number(value)),
    getOptions: (years: number[]) =>
      years.map((year) => ({ value: year, label: String(year) })),
  },
  visitCount: {
    label: "atlas:countries.filters.timeline.visitCount",
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
};
