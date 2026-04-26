import { FaShapes } from "react-icons/fa6";
import { CollapsibleHeader, SelectInput } from "@components";
import {
  useCountryData,
  type GeoType,
  type SovereigntyStatus,
} from "@features/countries";
import type { VisitedStatus } from "@features/visits";
import { coreFiltersConfig } from "../../config/filtersConfig";

interface CoreFiltersProps {
  expanded: boolean;
  onToggle: () => void;
  selectedRegion: string;
  handleRegionChange: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedGeoType: GeoType | "";
  setSelectedGeoType: (type: GeoType | "") => void;
  selectedSovereignty: SovereigntyStatus | "";
  setSelectedSovereignty: (status: SovereigntyStatus | "") => void;
  sovereignOnly: boolean;
  selectedVisited: VisitedStatus;
  setSelectedVisited: (visited: VisitedStatus) => void;
  visitedOnly: boolean;
  subregionOptions: string[];
  geoTypeOptions: GeoType[];
  sovereigntyOptions: string[];
}

export function CoreFilters({
  expanded,
  onToggle,
  selectedRegion,
  handleRegionChange,
  selectedSubregion,
  setSelectedSubregion,
  selectedGeoType,
  setSelectedGeoType,
  selectedSovereignty,
  setSelectedSovereignty,
  sovereignOnly,
  selectedVisited,
  setSelectedVisited,
  visitedOnly,
  subregionOptions,
  geoTypeOptions,
  sovereigntyOptions,
}: CoreFiltersProps) {
  const { allRegions } = useCountryData();

  return (
    <>
      <CollapsibleHeader
        icon={<FaShapes />}
        label="Core Filters"
        expanded={expanded}
        onToggle={onToggle}
      />
      {expanded && (
        <>
          {coreFiltersConfig.map((filter) => {
            let value, setValue, options;
            if (filter.key === "region") {
              value = selectedRegion;
              setValue = handleRegionChange;
              options = filter.getOptions(allRegions);
            } else if (filter.key === "subregion") {
              value = selectedSubregion;
              setValue = setSelectedSubregion;
              options = filter.getOptions(subregionOptions);
            } else if (filter.key === "geoType") {
              value = selectedGeoType;
              setValue = setSelectedGeoType;
              options = filter.getOptions(geoTypeOptions);
            } else if (filter.key === "sovereignty") {
              value = selectedSovereignty;
              setValue = setSelectedSovereignty;
              options = filter.getOptions(sovereigntyOptions);
            } else if (filter.key === "visited") {
              value = selectedVisited;
              setValue = setSelectedVisited;
              options = filter.getOptions();
            }

            const disabled =
              (filter.key === "sovereignty" && sovereignOnly) ||
              (filter.key === "visited" && visitedOnly);

            const selectValue =
              value === "" || value === undefined ? "all" : String(value);

            return setValue ? (
              <SelectInput
                key={filter.key}
                label={
                  typeof filter.label === "function"
                    ? filter.label(selectValue ?? "")
                    : filter.label
                }
                value={selectValue ?? "all"}
                onChange={(val) => {
                  if (disabled) return;
                  setValue(val === "all" ? "" : String(val));
                }}
                options={options ?? []}
                disabled={disabled}
              />
            ) : null;
          })}
        </>
      )}
    </>
  );
}
