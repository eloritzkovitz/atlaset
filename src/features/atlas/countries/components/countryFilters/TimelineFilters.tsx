import { FaClockRotateLeft } from "react-icons/fa6";
import { CollapsibleHeader, NumberInput, SelectInput } from "@components";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { getVisitedCountriesUpToYear } from "@features/visits";
import { clamp } from "@utils/number";
import { timelineFiltersConfig } from "../../config/filtersConfig";

interface TimelineFiltersProps {
  expanded: boolean;
  onToggle: () => void;
  minVisitCount: number;
  setMinVisitCount: (count: number) => void;
  maxVisitCount?: number;
  setMaxVisitCount?: (count: number) => void;
}

export function TimelineFilters({
  expanded,
  onToggle,
  minVisitCount,
  setMinVisitCount,
  maxVisitCount,
  setMaxVisitCount,
}: TimelineFiltersProps) {
  const { years, selectedYear, setSelectedYear } = useTimeline();
  const { trips } = useTrips();

  // Get the visit count map for the selected year
  const visitCountMap = getVisitedCountriesUpToYear(
    trips,
    selectedYear,
    undefined
  );

  // Get all visit counts as an array
  const visitCounts = Object.values(visitCountMap);

  // Compute min and max (default to 1 if no visits)
  const minPossible = visitCounts.length > 0 ? Math.min(...visitCounts) : 1;
  const maxPossible = visitCounts.length > 0 ? Math.max(...visitCounts) : 1;

  return (
    <>
      <CollapsibleHeader
        icon={<FaClockRotateLeft />}
        label="Timeline Filters"
        expanded={expanded}
        onToggle={onToggle}
      />
      {expanded && (
        <>
          <SelectInput
            label={timelineFiltersConfig.year.label}
            value={timelineFiltersConfig.year.getValue({ selectedYear })}
            onChange={(val) =>
              timelineFiltersConfig.year.setValue({ setSelectedYear }, val)
            }
            options={timelineFiltersConfig.year.getOptions(years)}
          />
          <div className="mt-4">
            <div className="font-medium mb-2">Visit count</div>
            <div className="flex items-center gap-2 w-full">
              <span className="opacity-70">From</span>
              <NumberInput
                label=""
                value={minVisitCount}
                min={minPossible}
                max={maxVisitCount ?? maxPossible}
                onChange={v => setMinVisitCount(clamp(v, minPossible, maxVisitCount ?? maxPossible))}
                className="!my-0 flex-1"
              />
              <span className="opacity-70">to</span>
              <NumberInput
                label=""
                value={maxVisitCount ?? maxPossible}
                min={minVisitCount}
                max={maxPossible}
                onChange={v => setMaxVisitCount && setMaxVisitCount(clamp(v, minVisitCount, maxPossible))}
                className="!my-0 flex-1"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
