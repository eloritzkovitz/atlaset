import { useState } from "react";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { useCountryData } from "@features/countries";
import { getVisitedCountriesForYear } from "@features/visits/utils/visits";
import {
  CENTER_INDEX,
  YEAR_MARKER_MIN_WIDTH,
  MAX_COUNTRIES_BEFORE_EXPAND,
} from "./constants";
import { VisitedCountryNames } from "./VisitedCountryNames";
import { TimelineDot } from "./TimelineDot";

export function TimelineBar() {
  const { countries } = useCountryData();
  const { trips } = useTrips();
  const { years, selectedYear, setSelectedYear } = useTimeline();
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const selectedIdx = years.indexOf(selectedYear);
  const total = years.length;

  // Determine start and end indices for slicing
  let start = selectedIdx - CENTER_INDEX;
  let end = selectedIdx + CENTER_INDEX + 1;

  // Calculate how much padding is needed on each side
  let padStart = 0;
  let padEnd = 0;
  if (start < 0) {
    padStart = -start;
    start = 0;
  }
  if (end > total) {
    padEnd = end - total;
    end = total;
  }

  const visibleYears = years.slice(start, end);

  // Pad with nulls for empty spaces
  const paddedYears = [
    ...Array(padStart).fill(null),
    ...visibleYears,
    ...Array(padEnd).fill(null),
  ];

  return (
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 px-4 py-2 flex items-center gap-2">
      {/* Timeline line */}
      <div
        className="absolute left-0 right-0 top-1/2 h-1 bg-muted/20 rounded pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Year markers */}
      <div className="absolute flex bottom-3 justify-center gap-4 relative select-none">
        {paddedYears.map((year, idx) => {
          if (year === null)
            return (
              <span key={idx} style={{ minWidth: YEAR_MARKER_MIN_WIDTH }} />
            );

          // Get visited countries for the year
          const visitedIsoCodes =
            getVisitedCountriesForYear(trips, year, undefined) || [];
          const visited = visitedIsoCodes
            .map((code) => countries.find((c) => c.isoCode === code)?.name)
            .filter(Boolean) as string[];

          // Determine if the current year is expanded
          const isExpanded = expandedYear === year;
          const showExpand = visited.length > MAX_COUNTRIES_BEFORE_EXPAND;

          return (
            <div
              key={year}
              className="relative flex flex-col items-center"
              style={{ minWidth: YEAR_MARKER_MIN_WIDTH }}
            >
              <VisitedCountryNames
                names={visited}
                isExpanded={isExpanded}
                showExpand={showExpand}
                onExpand={() => setExpandedYear(year)}
                onCollapse={() => setExpandedYear(null)}
              />
              {/* Year number */}
              <span
                className={`mb-1 ${
                  year === selectedYear ? "font-bold" : "font-normal"
                }`}
                style={{ zIndex: 1 }}
              >
                {year}
              </span>
              <TimelineDot
                selected={year === selectedYear}
                onClick={() => setSelectedYear(year)}
                ariaLabel={`Select year ${year}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
