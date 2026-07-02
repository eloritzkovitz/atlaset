import { useRef, useState } from "react";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { useUI } from "@contexts/UIContext";
import { useHighlightYearlyCountries } from "@features/atlas/timeline";
import { CountryDisplayPanel, type Country } from "@features/countries";
import { useVisitStats } from "@features/visits";
import { useListNavigation } from "@hooks";
import { CountryActions } from "./CountryActions";
import { CountryVisitBadge } from "./CountryVisitBadge";

interface CountryListViewProps {
  countries: Country[];
  selectedIsoCode: string | null;
  hoveredIsoCode: string | null;
  onSelect: (isoCode: string | null) => void;
  onHover: (isoCode: string | null) => void;
  onCountryInfo?: (country: Country) => void;
}

export function CountryListView({
  countries,
  selectedIsoCode,
  hoveredIsoCode,
  onSelect,
  onHover,
  onCountryInfo,
}: CountryListViewProps) {
  const [highlightedIsoCodes, highlightDirection] =
    useHighlightYearlyCountries();
  const { selectedYear, years } = useTimeline();
  const { trips } = useTrips();
  const { showCountries, uiVisible } = useUI();

  // Focus state for keyboard navigation
  const [isFocused, setIsFocused] = useState(false);

  // Keyboard navigation for country list
  useListNavigation({
    items: countries,
    getKey: (c) => c.isoCode,
    selectedKey: selectedIsoCode,
    hoveredKey: hoveredIsoCode,
    onSelect,
    onHover,
    onItemInfo: onCountryInfo,
    enabled: uiVisible && showCountries && isFocused,
  });

  // Context menu state for right-click actions
  const [selectedContextCountry, setSelectedContextCountry] =
    useState<Country | null>(null);
  const countryActionsRef = useRef<{
    openAtCoordinates: (x: number, y: number) => void;
  } | null>(null);
  const activeRowRef = useRef<HTMLElement | null>(null);

  // Handle right-click context menu on country rows
  const handleContextMenu = (e: React.MouseEvent, country: Country) => {
    e.preventDefault();
    e.stopPropagation();

    activeRowRef.current = e.currentTarget as HTMLElement;
    setSelectedContextCountry(country);
    countryActionsRef.current?.openAtCoordinates(e.clientX, e.clientY);
  };

  // Precompute previous years' visits
  const { visitCountByIsoCode, previouslyVisitedIsoCodes } = useVisitStats(
    trips,
    selectedYear,
    years,
  );

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
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="list flex-1 min-h-0 overflow-y-auto -mx-4 focus:outline-none focus:ring-2 focus:ring-ring-focus"
    >
      <div
        className="w-full select-none p-1"
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
          onContextMenu={handleContextMenu}
          renderBadge={renderBadge}
          showBadges={true}
          showFlags={true}
        />
      </div>
      <CountryActions
        ref={countryActionsRef}
        triggerRef={activeRowRef}
        country={selectedContextCountry}
        onCountryInfo={onCountryInfo}
      />
    </div>
  );
}
