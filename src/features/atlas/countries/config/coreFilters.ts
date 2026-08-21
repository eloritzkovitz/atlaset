import type { GeoType, SovereigntyStatus } from "@features/countries/types";
import type { FilterConfig, FilterOption } from "@types";
import {
  capitalize,
  capitalizeWords,
  createSelectFilter,
  mapOptions,
} from "@utils";
import type { CountryFilterKey } from "../types";

interface CoreFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedGeoType: GeoType | "";
  setSelectedGeoType: (geoType: GeoType | "") => void;
  selectedSovereignty: SovereigntyStatus | "";
  setSelectedSovereignty: (sovereignty: SovereigntyStatus | "") => void;
  selectedVisited: string;
  setSelectedVisited: (visited: string) => void;
}

/** Configuration for country filters. */
type CoreFilterConfig<T = string, P = unknown> = FilterConfig<
  T,
  P,
  CountryFilterKey
>;

const allOption: FilterOption = {
  value: "all",
  label: "common:components.filter.all",
};

const ALL_GEO_TYPES: readonly GeoType[] = ["Coastal", "Landlocked", "Island"];

const SOVEREIGNTY_ORDER: readonly SovereigntyStatus[] = [
  "sovereign",
  "dependency",
  "overseas_region",
  "special_territory",
  "partially_recognized",
  "disputed",
  "unrecognized",
];

export const coreFiltersConfig: CoreFilterConfig<string, CoreFilterProps>[] = [
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
    () => [allOption, ...mapOptions([...ALL_GEO_TYPES], capitalize)],
    (props) => (props.selectedGeoType === "" ? "all" : props.selectedGeoType),
    (props, val) =>
      props.setSelectedGeoType(val === "all" ? "" : (val as GeoType)),
  ),
  createSelectFilter(
    "sovereignty",
    "atlas:countries.filters.core.sovereignty",
    () => [allOption, ...mapOptions([...SOVEREIGNTY_ORDER], capitalize)],
    (props) =>
      props.selectedSovereignty === "" ? "all" : props.selectedSovereignty,
    (props, val) =>
      props.setSelectedSovereignty(
        val === "all" ? "" : (val as SovereigntyStatus),
      ),
  ),
  {
    key: "visited",
    label: "atlas:countries.filters.core.visitStatus",
    type: "select",
    getOptions: () => [
      { value: "any", label: "common:components.filter.all" },
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
