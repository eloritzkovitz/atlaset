import { FaShapes } from "react-icons/fa6";
import { CollapsibleHeader, SelectInput } from "@components";
import { useCountryData, type SovereigntyType } from "@features/countries";
import type { VisitedStatus } from "@features/visits";
import { coreFiltersConfig } from "../../config/filtersConfig";

interface CoreFiltersProps {
  expanded: boolean;
  onToggle: () => void;
  selectedRegion: string;
  handleRegionChange: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedSovereignty: SovereigntyType | "";
  setSelectedSovereignty: (type: SovereigntyType | "") => void;
  selectedVisited: VisitedStatus;
  setSelectedVisited: (visited: VisitedStatus) => void;
  subregionOptions: string[];
  sovereigntyOptions: string[];
}

export function CoreFilters({
  expanded,
  onToggle,
  selectedRegion,
  handleRegionChange,
  selectedSubregion,
  setSelectedSubregion,
  selectedSovereignty,
  setSelectedSovereignty,
  selectedVisited,
  setSelectedVisited,
  subregionOptions,
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
            } else if (filter.key === "sovereignty") {
              value = selectedSovereignty;
              setValue = setSelectedSovereignty;
              options = filter.getOptions(sovereigntyOptions);
            } else if (filter.key === "visited") {
              value = selectedVisited;
              setValue = setSelectedVisited;
              options = filter.getOptions();
            }
            const selectValue = value === "" ? "all" : value;
            return setValue ? (
              <SelectInput
                key={filter.key}
                label={
                  typeof filter.label === "function"
                    ? filter.label(selectValue ?? "")
                    : filter.label
                }
                value={selectValue ?? "all"}
                onChange={(val) => setValue(val === "all" ? "" : String(val))}
                options={options ?? []}
              />
            ) : null;
          })}
        </>
      )}
    </>
  );
}
