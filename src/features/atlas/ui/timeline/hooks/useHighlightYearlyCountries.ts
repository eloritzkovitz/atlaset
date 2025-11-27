import { useEffect, useRef, useState } from "react";
import { getVisitedCountriesForYear } from "@features/visits/utils/visits";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";

/**
 * Highlights countries visited in the selected timeline year.
 * @returns Array of highlighted country ISO codes.
 */
export function useHighlightYearlyCountries() {
  const { timelineMode, selectedYear } = useTimeline();
  const { trips } = useTrips();

  // State to hold highlighted country ISO codes
  const [highlightedIsoCodes, setHighlightedIsoCodes] = useState<string[]>([]);
  const prevYearRef = useRef<number | null>(null);

  // Highlight countries when timeline year changes
  useEffect(() => {
    if (!timelineMode) {
      setHighlightedIsoCodes([]);
      prevYearRef.current = selectedYear;
      return;
    }

    // Only highlight if the year has changed
    if (prevYearRef.current !== selectedYear) {
      const yearlyIsoCodes =
        getVisitedCountriesForYear(trips, selectedYear) || [];
      setHighlightedIsoCodes(yearlyIsoCodes);

      const timeout = setTimeout(() => {
        setHighlightedIsoCodes([]);
      }, 1000);

      prevYearRef.current = selectedYear;
      return () => clearTimeout(timeout);
    }
  }, [timelineMode, selectedYear, trips]);

  return highlightedIsoCodes;
}
