import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { useHighlightYearlyCountries } from "@features/atlas/timeline";
import { CountryDisplayPanel } from "@features/countries";
import { getVisitedCountriesForYear } from "@features/visits/utils/visits";
import type { Country } from "@types";
import { CountryVisitBadge } from "./CountryVisitBadge";
import React from "react";

interface CountryListProps {
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  countries: Country[];
  selectedIsoCode: string | null;
  hoveredIsoCode: string | null;
  onSelect: (isoCode: string | null) => void;
  onHover: (isoCode: string | null) => void;
  onCountryInfo?: (country: Country) => void;
}

export const CountryList = React.forwardRef<HTMLDivElement, CountryListProps>(
  (
    {
      setIsFocused,
      countries,
      selectedIsoCode,
      hoveredIsoCode,
      onSelect,
      onHover,
      onCountryInfo,
    },
    ref
  ) => {
    const [highlightedIsoCodes, highlightDirection] =
      useHighlightYearlyCountries();
    const { selectedYear, years } = useTimeline();
    const { trips } = useTrips();

    // Precompute previous years' visits for efficiency
    const previousYears = years.filter((y) => y < selectedYear);
    const previouslyVisitedIsoCodes = new Set(
      previousYears.flatMap((y) => getVisitedCountriesForYear(trips, y) || [])
    );

    // Precompute visit counts for badges
    const visitCountByIsoCode: Record<string, number> = {};
    years
      .filter((y) => y <= selectedYear)
      .forEach((y) => {
        (getVisitedCountriesForYear(trips, y) || []).forEach((iso) => {
          visitCountByIsoCode[iso] = (visitCountByIsoCode[iso] || 0) + 1;
        });
      });

    // Render country list with badges
    const renderBadge = (country: Country) => {
      const isTempHighlight = highlightedIsoCodes.includes(country.isoCode);
      if (!isTempHighlight) return null;
      return (
        <CountryVisitBadge
          revisit={previouslyVisitedIsoCodes.has(country.isoCode)}
          count={visitCountByIsoCode[country.isoCode] || 1}
          direction={highlightDirection}
        />
      );
    };

    return (
      <div
        ref={ref}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="list flex-1 min-h-0 overflow-y-auto -mx-3 focus:outline-none"
      >
        <div
          className="w-full select-none"
          onMouseLeave={() => {
            onHover(null);
            onSelect(null);
          }}
        >
          <CountryDisplayPanel
            countries={countries}
            showAllAsVisited={true}
            view="list"
            selectedIsoCode={selectedIsoCode}
            hoveredIsoCode={hoveredIsoCode}
            onSelect={onSelect}
            onHover={onHover}
            onCountryInfo={onCountryInfo}
            renderBadge={renderBadge}
            showBadges={true}
            showFlags={true}
          />
        </div>
      </div>
    );
  }
);
