import { FaClockRotateLeft } from "react-icons/fa6";
import { CollapsibleHeader, SelectInput } from "@components";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { getVisitedCountriesUpToYear } from "@features/visits";
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
  setMinVisitCount,
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
  const minVisitCount = visitCounts.length > 0 ? Math.min(...visitCounts) : 1;
  const maxVisitCount = visitCounts.length > 0 ? Math.max(...visitCounts) : 1;

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
          <SelectInput
            label={timelineFiltersConfig.minVisitCount.label}
            value={minVisitCount}
            onChange={(val) => setMinVisitCount(Number(val))}
            options={timelineFiltersConfig.minVisitCount.getOptions(
              maxVisitCount
            )}
          />
          {typeof maxVisitCount === "number" && setMaxVisitCount && (
            <SelectInput
              label={timelineFiltersConfig.maxVisitCount.label}
              value={maxVisitCount}
              onChange={(val) => setMaxVisitCount(Number(val))}
              options={timelineFiltersConfig.maxVisitCount.getOptions(
                maxVisitCount
              )}
            />
          )}
        </>
      )}
    </>
  );
}
