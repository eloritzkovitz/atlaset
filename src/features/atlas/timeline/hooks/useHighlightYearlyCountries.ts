import { useEffect, useRef, useState } from "react";
import { getVisitedCountriesForYear } from "@features/visits/utils/visits";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";

/**
 * Highlights countries visited in the selected timeline year.
 * @returns Array of highlighted country ISO codes and direction of year change ("asc" | "desc" | null).
 */
export function useHighlightYearlyCountries() {
  const { timelineMode, selectedYear } = useTimeline();
  const { trips } = useTrips();

  const [highlightedIsoCodes, setHighlightedIsoCodes] = useState<string[]>([]);
  const [direction, setDirection] = useState<"asc" | "desc" | null>(null);
  const prevYearRef = useRef<number | null>(null);

  useEffect(() => {
    if (!timelineMode) {
      setHighlightedIsoCodes([]);
      setDirection(null);
      prevYearRef.current = selectedYear;
      return;
    }

    if (prevYearRef.current !== selectedYear) {
      const yearlyIsoCodes =
        getVisitedCountriesForYear(trips, selectedYear) || [];
      setHighlightedIsoCodes(yearlyIsoCodes);

      if (prevYearRef.current !== null) {
        setDirection(selectedYear > prevYearRef.current ? "asc" : "desc");
      } else {
        setDirection(null);
      }

      const timeout = setTimeout(() => {
        setHighlightedIsoCodes([]);
        setDirection(null);
      }, 1000);

      prevYearRef.current = selectedYear;
      return () => clearTimeout(timeout);
    }
  }, [timelineMode, selectedYear, trips]);

  return [highlightedIsoCodes, direction] as const;
}
