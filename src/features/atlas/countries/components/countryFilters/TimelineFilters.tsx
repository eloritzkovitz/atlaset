import { useTranslation } from "react-i18next";
import { FaTimeline } from "react-icons/fa6";
import { CollapsibleHeader, NumberInput, SelectInput } from "@components";
import { useTimeline } from "@features/atlas/timeline";
import { useTrips } from "@features/trips";
import { getVisitCountStats } from "@features/visits";
import { clamp } from "@utils";
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
  const { t } = useTranslation("atlas");

  const { min: minPossible, max: maxPossible } = getVisitCountStats(
    trips,
    selectedYear,
  );

  return (
    <>
      <CollapsibleHeader
        icon={<FaTimeline />}
        label={t("countries.filters.timeline.title")}
        expanded={expanded}
        onToggle={onToggle}
      />
      {expanded && (
        <>
          <SelectInput
            label={t("countries.filters.timeline.year")}
            value={timelineFiltersConfig.year.getValue({ selectedYear })}
            onChange={(val) =>
              timelineFiltersConfig.year.setValue({ setSelectedYear }, val)
            }
            options={timelineFiltersConfig.year.getOptions(years)}
          />
          <div className="mt-4">
            <div className="font-medium mb-2">
              {t("countries.filters.timeline.visitCount")}
            </div>
            <div className="flex items-center gap-2 w-full">
              <span className="opacity-70">
                {t("countries.filters.timeline.from")}
              </span>
              <NumberInput
                label=""
                value={minVisitCount}
                min={minPossible}
                max={maxVisitCount ?? maxPossible}
                onChange={(v) =>
                  setMinVisitCount(
                    clamp(v, minPossible, maxVisitCount ?? maxPossible),
                  )
                }
                className="!my-0 flex-1"
              />
              <span className="opacity-70">
                {t("countries.filters.timeline.to")}
              </span>
              <NumberInput
                label=""
                value={maxVisitCount ?? maxPossible}
                min={minVisitCount}
                max={maxPossible}
                onChange={(v) =>
                  setMaxVisitCount &&
                  setMaxVisitCount(clamp(v, minVisitCount, maxPossible))
                }
                className="!my-0 flex-1"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
